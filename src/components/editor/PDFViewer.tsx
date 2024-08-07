import { Spin } from 'antd';
import React, { useCallback, useImperativeHandle, useState } from 'react';
import { isMobile, isTablet } from 'react-device-detect';
import { Document, Page } from 'react-pdf';

import DroppableArea from '@/components/editor/DroppableArea';
import OverlayLayer from '@/components/editor/OverlayLayer';
import { Jobdoc } from '@/service/shared/Response/participantDocs';
import { OverlayItem } from '@/types/app';

interface PDFViewerProps {
  pdfUrl?: string;
  addOverlay: (item: OverlayItem) => void;
  updateOverlays: React.Dispatch<React.SetStateAction<OverlayItem[]>>;
  selectedDocument?: Jobdoc;
  overlays: OverlayItem[];
  onLoad?: (values: { numPages: number }) => void;
}

const PDFViewer = React.forwardRef<HTMLDivElement, PDFViewerProps>(
  (
    { pdfUrl, addOverlay, updateOverlays, selectedDocument, overlays, onLoad },
    ref: React.ForwardedRef<any>,
  ) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [extraPages, setExtraPages] = useState<number[]>([]);
    const [zoom, setZoom] = useState(isMobile || isTablet ? 0.6 : 1.3); // Zoom state

    const onDocumentLoadSuccess = useCallback(
      ({ numPages }: { numPages: number }) => {
        onLoad && onLoad({ numPages });
        setNumPages(numPages);
      },
      [],
    );

    useImperativeHandle(ref, () => ({
      setPageNumber: (page: number) => {
        if (page > 0 && page <= (numPages || 1) + extraPages.length) {
          setCurrentPage(page);
          const container = document.querySelector('.pdf-container');
          if (container) {
            const pageHeight =
              container.scrollHeight / ((numPages || 1) + extraPages.length);
            container.scrollTop = (page - 1) * pageHeight;
          }
        }
      },
      getCurrentPage: () => currentPage,
      addBlankPage: () => {
        setExtraPages((prev) => [...prev, (numPages || 1) + prev.length + 1]);
      },
      zoomIn: () => setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2)), // Max zoom 2x
      zoomOut: () => setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5)), // Min zoom 0.5x
    }));

    const onLoadError = (error: Error) => {
      // eslint-disable-next-line no-console
      console.error('ERROR LOADING THE PDF DOC: ', error);
    };

    const renderPages = () => {
      const totalNumPages = (numPages || 0) + extraPages.length;
      const pages = [];

      const documentOverlays = selectedDocument?.ID
        ? overlays?.filter((ov) => ov?.jobDocId === selectedDocument?.ID)
        : [];

      for (let pageNumber = 1; pageNumber <= totalNumPages; pageNumber++) {
        if (pageNumber <= numPages!) {
          // Render styled pages
          pages.push(
            <DroppableArea
              key={pageNumber}
              addOverlay={addOverlay}
              updateOverlays={updateOverlays}
              overlays={overlays}
              pageNumber={pageNumber}
            >
              <OverlayLayer
                overlays={documentOverlays?.filter(
                  (ov) => ov?.pageNumber === pageNumber,
                )}
                updateOverlays={updateOverlays}
              />
              <Page
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="border-solid border-gray-300 p-2"
                pageNumber={pageNumber}
                scale={zoom}
              />
            </DroppableArea>,
          );
        } else {
          // Render blank pages
          pages.push(
            <DroppableArea
              key={pageNumber}
              addOverlay={addOverlay}
              updateOverlays={updateOverlays}
              overlays={overlays}
              pageNumber={pageNumber}
            >
              <div
                className="h-screen border-solid w-full border-gray-300 flex items-center justify-center my-2"
                style={{ pageBreakAfter: 'always' }}
              >
                <span className="text-xs bg-white p-2 text-gray-200">
                  Blank Page {pageNumber}
                </span>
              </div>
            </DroppableArea>,
          );
        }
      }

      return pages;
    };

    return (
      <div
        ref={ref}
        className="w-full pdf-container flex flex-col items-center  overflow-x-auto"
      >
        {pdfUrl ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="w-full h-full flex justify-center items-center">
                <Spin spinning />
              </div>
            }
            onLoadError={onLoadError}
            className="self-center"
          >
            {renderPages()}
          </Document>
        ) : (
          <div className="flex justify-center items-center h-screen">
            No document selected
          </div>
        )}
      </div>
    );
  },
);

export default PDFViewer;
