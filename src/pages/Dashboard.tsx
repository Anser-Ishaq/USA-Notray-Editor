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
import { MdAddCircleOutline } from 'react-icons/md';
import { pdfjs } from 'react-pdf';

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

const Dashboard: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Jobdoc>();
  const [overlays, setOverlays] = useState<OverlayItem[]>([]);

  const pdfRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<any>(null);

  const { data: userSession, isLoading: userSessionLoading } =
    useUserSessionQuery({ sessionId: 246 });
  const { data, isLoading } = useNotarySessionQuery({ sessionId: 246 });
  const { data: participantDocs, isLoading: docsLoading } =
    usePartcipantDocsQuery({ sessionId: 246 });

  const addOverlay = useCallback((item: OverlayItem) => {
    setOverlays((prevOverlays) => [...prevOverlays, item]);
  }, []);

  const updateOverlays = useCallback(
    (updater: React.SetStateAction<OverlayItem[]>) => {
      setOverlays(updater);
    },
    [],
  );

  const notary = useMemo(
    () => participantDocs?.notary?.[0],
    [participantDocs?.notary],
  );

  useEffect(() => {
    if (data && userSession?.[0]?.socket_room_id) {
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
  }, [data, userSession]);

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
      participantDocs?.job_docs?.map((jd) => ({
        ...jd,
        label: jd.file_name,
        value: jd.ID,
      })),
    [participantDocs?.job_docs],
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
            {/* Video call component */}
            <div className="p-2">
              <Select
                loading={docsLoading}
                options={docsOptions}
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
                icon={<MdAddCircleOutline />}
                type="primary"
                block
                className="mb-2 flex-1"
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
                overlays={overlays}
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
            data={data}
            documentsData={participantDocs}
            notary={notary}
          />
        </div>
      </Spin>
    </DndProvider>
  );
};

export default Dashboard;
