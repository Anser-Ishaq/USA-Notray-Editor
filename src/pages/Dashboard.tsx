// Dashboard.tsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { pdfjs } from 'react-pdf';

import DroppableArea from '@/components/editor/DroppableArea';
import OverlayLayer from '@/components/editor/OverlayLayer';
import PDFViewer from '@/components/editor/PDFViewer';
import SidePanel from '@/components/editor/SidePanel';
import {
  useNotarySessionQuery,
  usePartcipantDocsQuery,
} from '@/service/notarySession/hooks';
import { OverlayItem } from '@/types/app';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Dashboard: React.FC = () => {
  const [overlays, setOverlays] = useState<OverlayItem[]>([]);

  const pdfRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useNotarySessionQuery({ sessionId: 2793 });
  const { data: participantDocs, isLoading: docsLoading } =
    usePartcipantDocsQuery({ sessionId: 2793 });

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

  const MemoizedPDFViewer = useMemo(() => React.memo(PDFViewer), []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 min-h-screen w-full">
        <div className="bg-gray-50 h-full col-span-3">
          {/* Video call component */}
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
            <OverlayLayer overlays={overlays} updateOverlays={updateOverlays} />
            <MemoizedPDFViewer pdfUrl="https://ewr1.vultrobjects.com/notary-storage/notary-storage/files/job/10/dummy.pdf" />
          </DroppableArea>
        </div>
        <SidePanel
          data={data}
          documentsData={participantDocs}
          notary={notary}
        />
      </div>
    </DndProvider>
  );
};

export default Dashboard;
