// Dashboard.tsx
import { Button, Select, Spin } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';

import DroppableArea from '@/components/editor/DroppableArea';
import OverlayLayer from '@/components/editor/OverlayLayer';
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

const job_docs: Jobdoc[] = [
  {
    ID: 234,
    company_id: null,
    job_id: '244',
    file_name: 'michael poitevint.pdf',
    file_path: 'https://getsamplefiles.com/download/pdf/sample-1.pdf',
    white_pages: 0,
    status: 'COMPLETED',
    date_created: '2024-02-01T16:47:12.000Z',
    date_deleted: null,
    document_id: null,
    created_at: '2024-02-01T16:47:12.000Z',
    updated_at: null,
    deleted_at: null,
    complete_url: 'https://getsamplefiles.com/download/pdf/sample-1.pdf',
    doc_name: 'michael poitevint.pdf',
    doc_url: null,
    Document: null,
  },
  {
    ID: 235,
    company_id: null,
    job_id: '244',
    file_name: 'Test Document 2.pdf',
    file_path: 'https://getsamplefiles.com/download/pdf/sample-4.pdf',
    white_pages: 0,
    status: 'COMPLETED',
    date_created: '2024-02-01T16:47:12.000Z',
    date_deleted: null,
    document_id: null,
    created_at: '2024-02-01T16:47:12.000Z',
    updated_at: null,
    deleted_at: null,
    complete_url: 'https://getsamplefiles.com/download/pdf/sample-4.pdf',
    doc_name: 'Test Document 2.pdf',
    doc_url: null,
    Document: null,
  },
  {
    ID: 236,
    company_id: null,
    job_id: '244',
    file_name: 'Test Document 3.pdf',
    file_path: 'https://getsamplefiles.com/download/pdf/sample-2.pdf',
    white_pages: 0,
    status: 'COMPLETED',
    date_created: '2024-02-01T16:47:12.000Z',
    date_deleted: null,
    document_id: null,
    created_at: '2024-02-01T16:47:12.000Z',
    updated_at: null,
    deleted_at: null,
    complete_url: 'https://getsamplefiles.com/download/pdf/sample-2.pdf',
    doc_name: 'Test Document 3.pdf',
    doc_url: null,
    Document: null,
  },
];

const Dashboard: React.FC = () => {
  const { id } = useParams();

  const sessionId = +(id ?? 246);

  const [selectedDocument, setSelectedDocument] = useState<Jobdoc>();
  const [overlays, setOverlays] = useState<OverlayItem[]>([]);

  const pdfRef = useRef<HTMLDivElement>(null);
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

      return () => {
        socketService.disconnect();
      };
    }
  }, [sessionData, userSession]);

  const onPageSync = () => {
    if (!userSession?.[0]?.socket_room_id || !pdfRef.current) return;
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
      job_docs?.map((jd) => ({
        ...jd,
        label: jd.file_name,
        value: jd.ID,
      })),
    [],
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

  const documentOverlays = useMemo(
    () => overlays?.filter((ov) => ov?.jobDocId === selectedDocument?.ID),
    [overlays, selectedDocument?.ID],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Spin spinning={isLoading || userSessionLoading || docsLoading}>
        <div
          ref={editorContainerRef}
          className="grid grid-cols-12 h-screen overflow-y-auto w-full"
        >
          <div className="col-span-3" />
          <div className="bg-gray-50 h-full overflow-y-auto fixed left-0 w-1/4">
            <div className="p-2">
              <Select
                loading={docsLoading}
                options={docsOptions}
                allowClear
                onChange={(value: number) => {
                  setSelectedDocument(job_docs?.find((jd) => jd.ID === value));
                }}
                className="w-full mb-4"
                placeholder="Select Document"
              />
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
              <iframe
                src={sessionData?.jobSchedule?.[0]?.whereby_host_link}
                allow="camera; microphone; fullscreen; speaker; display-capture"
                className="border-none w-full h-[calc(100vh-150px)] rounded "
              />
            </div>
          </div>
          <div
            ref={pdfRef}
            id="pdf-viewer"
            className="h-full col-span-6 relative"
          >
            <DroppableArea
              addOverlay={addOverlay}
              updateOverlays={updateOverlays}
              pdfRef={pdfRef}
              overlays={overlays}
            >
              <OverlayLayer
                overlays={documentOverlays}
                updateOverlays={updateOverlays}
              />
              <PDFViewer
                pdfUrl={
                  selectedDocument?.file_path ??
                  'https://getsamplefiles.com/download/pdf/sample-3.pdf'
                }
              />
            </DroppableArea>
          </div>
          <SidePanel
            data={sessionData}
            documentsData={participantDocs}
            notary={notary}
            overlays={overlays}
            selectedDocument={selectedDocument}
            sessionId={sessionId}
          />
        </div>
      </Spin>
    </DndProvider>
  );
};

export default Dashboard;
