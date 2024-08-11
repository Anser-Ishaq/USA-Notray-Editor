import { PlusCircleFilled, SyncOutlined } from '@ant-design/icons';
import { Button, Select, Spin } from 'antd';
import PersonaReact from 'persona-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isMobile } from 'react-device-detect';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';

import PDFViewer from '@/components/editor/PDFViewer';
import SidePanel from '@/components/editor/SidePanel';
import {
  useNotarySessionQuery,
  usePartcipantDocsQuery,
  useUserSessionQuery,
} from '@/service/notarySession/hooks';
import { Jobdoc } from '@/service/shared/Response/participantDocs';
import { PageSyncRecievedEventData } from '@/service/shared/Response/socket';
import socketService from '@/service/socket/socketService';
import { OverlayItem } from '@/types/app';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Dashboard: React.FC = () => {
  const { id } = useParams();

  const sessionId = +(id ?? 246);
  const [totalPdfPages, setTotalPdfPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number | null>(null);

  const [selectedDocument, setSelectedDocument] = useState<Jobdoc>();
  const [overlays, setOverlays] = useState<OverlayItem[]>([]);

  const pdfDocumentRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<any>(null);

  const { data: userSession, isLoading: userSessionLoading } =
    useUserSessionQuery({ sessionId });
  const { data: sessionData, isLoading } = useNotarySessionQuery({ sessionId });
  const { data: participantDocs, isLoading: docsLoading } =
    usePartcipantDocsQuery({ sessionId });

  const addOverlay = useCallback((item: OverlayItem) => {
    setOverlays((prevOverlays) => [...prevOverlays, item]);
  }, []);

  const updateOverlays = useCallback(
    (updater: React.SetStateAction<OverlayItem[]>) => {
      setOverlays(updater);
    },
    [],
  );

  const notary = useMemo(() => sessionData?.user?.[0], [sessionData?.user]);

  useEffect(() => {
    if (sessionData && userSession?.[0]?.socket_room_id) {
      socketService.connect(import.meta.env.VITE_PUBLIC_SOCKET_ENDPOINT);
      socketService.joinRoom(userSession?.[0]?.socket_room_id);

      socketService.onPageSync((data: PageSyncRecievedEventData) => {
        if (data?.syncData?.scrollPosition) {
          editorContainerRef.current.scrollTop = data?.syncData?.scrollPosition;
        }
      });

      socketService.onAddNewPage(
        (pdfDocumentRef as any)?.current?.addBlankPage,
      );

      return () => {
        socketService.disconnect();
      };
    }
  }, [sessionData, userSession]);

  const onPageSync = () => {
    if (!userSession?.[0]?.socket_room_id) return;
    const scrollPosition = editorContainerRef?.current?.scrollTop;
    socketService.sendPageSync({
      socketRoomId: userSession?.[0]?.socket_room_id,
      syncData: {
        scrollPosition,
      },
    });
  };

  const docsOptions = useMemo(
    () =>
      participantDocs?.job_docs?.map((jd) => ({
        ...jd,
        label: jd.file_name,
        value: jd.ID,
      })),
    [participantDocs?.job_docs],
  );

  useEffect(() => {
    if (userSession?.[0]?.metadata) {
      try {
        const parsedOverlays = JSON.parse(userSession?.[0]?.metadata);
        setOverlays(parsedOverlays);
      } catch (error) {
        console.log('Unable to parse metadata', error);
      }
    }
  }, [sessionData, userSession]);

  const zoomIn = () => {
    if (pdfDocumentRef.current) {
      const pdfViewer = pdfDocumentRef.current as any; // Type assertion for ref
      pdfViewer.zoomIn();
    }
  };

  const zoomOut = () => {
    if (pdfDocumentRef.current) {
      const pdfViewer = pdfDocumentRef.current as any; // Type assertion for ref
      pdfViewer.zoomOut();
    }
  };

  useEffect(() => {
    if (participantDocs?.job_docs && participantDocs?.job_docs?.length > 0) {
      setSelectedDocument(participantDocs.job_docs[0]);
    }
  }, [participantDocs?.job_docs]);

  const handleScroll = () => {
    const container = editorContainerRef.current;
    if (container && totalPdfPages) {
      const scrollPosition = container.scrollTop;
      const pageHeight = container.scrollHeight / totalPdfPages;
      const currentPage = Math.floor(scrollPosition / pageHeight) + 1;
      setCurrentPage(currentPage);
    }
  };

  const onDocumentLoad = ({ numPages }: { numPages: number }) => {
    setTotalPdfPages(numPages);
  };

  return (
    <>
      <PersonaReact
        templateId="tmpl_bY18rJArzhJzCbTDH5MWoaLZ>"
        environmentId="env_6yoiGX97iP1dU7135cx9e5Uo"
        onLoad={() => {
          console.log('Loaded inline');
        }}
        onComplete={({ inquiryId, status: _, fields: _fields }) => {
          // Inquiry completed. Optionally tell your server about it.
          console.log(`Sending finished inquiry ${inquiryId} to backend`);
        }}
      />
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <Spin spinning={isLoading || userSessionLoading || docsLoading}>
          <div
            ref={editorContainerRef}
            onScroll={handleScroll}
            className="grid grid-cols-1 md:grid-cols-12 h-screen overflow-y-auto w-full"
          >
            <div className="flex md:hidden justify-between w-full z-20 fixed left-2 top-2 flex-row items-center">
              <div className="flex items-center gap-2">
                <Button
                  shape="circle"
                  type="primary"
                  block
                  className="flex-1"
                  icon={<PlusCircleFilled />}
                  onClick={(pdfDocumentRef as any)?.current?.addBlankPage}
                />
                <Button
                  shape="circle"
                  type="primary"
                  block
                  className="flex-1"
                  icon={<SyncOutlined />}
                  onClick={onPageSync}
                />
                <div className="block lg:hidden">
                  Page {currentPage} of {totalPdfPages || 0}
                </div>
              </div>
              <Select
                loading={docsLoading}
                options={docsOptions}
                value={selectedDocument?.ID}
                allowClear
                onChange={(value: number) => {
                  setSelectedDocument(
                    participantDocs?.job_docs?.find((jd) => jd.ID === value),
                  );
                }}
                className="mr-6"
                placeholder="Select Document"
              />
            </div>
            <div className="hidden md:block md:col-span-2" />
            <div className="hidden md:block bg-gray-50 h-full overflow-y-auto md:fixed md:left-0 md:w-1/5 w-full md:col-span-2">
              <div className="p-2">
                <Select
                  loading={docsLoading}
                  options={docsOptions}
                  value={selectedDocument?.ID}
                  allowClear
                  onChange={(value: number) => {
                    setSelectedDocument(
                      participantDocs?.job_docs?.find((jd) => jd.ID === value),
                    );
                  }}
                  className="w-full mb-4"
                  placeholder="Select Document"
                />
                <Button
                  color="error"
                  type="primary"
                  block
                  className="mb-2 flex-1"
                  onClick={(pdfDocumentRef as any)?.current?.addBlankPage}
                >
                  Add Page
                </Button>
                <Button
                  color="error"
                  type="primary"
                  block
                  className="mb-2 flex-1"
                  onClick={onPageSync}
                >
                  Sync Pages
                </Button>
              </div>
              <div className="mx-2">
                {import.meta.env.PROD ? (
                  <iframe
                    src={sessionData?.jobSchedule?.[0]?.whereby_host_link}
                    allow="camera; microphone; fullscreen; speaker; display-capture"
                    className="border-none w-full h-[calc(100vh-150px)] rounded "
                  />
                ) : null}
              </div>
            </div>
            <div
              id="pdf-viewer"
              className="relative mb-28 h-full col-span-12 md:col-span-8"
            >
              <div className="hidden lg:block fixed left-[50%] -translate-x-[50%] z-50">
                Page {currentPage} of {totalPdfPages || 0}
              </div>
              <PDFViewer
                ref={pdfDocumentRef}
                addOverlay={addOverlay}
                onLoad={onDocumentLoad}
                updateOverlays={updateOverlays}
                selectedDocument={selectedDocument}
                overlays={overlays}
                pdfUrl={selectedDocument?.file_path}
              />
            </div>
            <div className="hidden md:block md:col-span-2" />
            <SidePanel
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              data={sessionData}
              userSession={userSession}
              documentsData={participantDocs}
              notary={notary}
              overlays={overlays}
              selectedDocument={selectedDocument}
              sessionId={sessionId}
            />
          </div>
        </Spin>
      </DndProvider>
    </>
  );
};

export default Dashboard;
