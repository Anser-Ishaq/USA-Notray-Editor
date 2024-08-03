import { Spin } from 'antd';
import React, { useCallback, useImperativeHandle, useState } from 'react';
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
  pdfRef: React.RefObject<HTMLDivElement>;
  overlays: OverlayItem[];
}

const PDFViewer = React.forwardRef<HTMLDivElement, PDFViewerProps>(
  (
    { pdfUrl, addOverlay, updateOverlays, selectedDocument, overlays, pdfRef },
    ref: React.ForwardedRef<any>,
  ) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [extraPages, setExtraPages] = useState<number[]>([]);

    const onDocumentLoadSuccess = useCallback(
      ({ numPages }: { numPages: number }) => {
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
          pages.push(
            <div
              className="pdf-page w-full relative flex justify-center my-2"
              key={pageNumber}
            >
              <DroppableArea
                addOverlay={addOverlay}
                updateOverlays={updateOverlays}
                pdfRef={pdfRef}
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
                  className="border-solid border-gray-300 p-2"
                  pageNumber={pageNumber}
                />
              </DroppableArea>
            </div>,
          );
        } else {
          pages.push(
            <DroppableArea
              addOverlay={addOverlay}
              updateOverlays={updateOverlays}
              pdfRef={pdfRef}
              overlays={overlays}
              pageNumber={pageNumber}
            >
              <div
                key={`extra-page-${pageNumber}`}
                className="h-screen border-solid border-gray-300 flex items-center justify-center my-2"
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
        className="w-full pdf-container flex flex-col items-center"
      >
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
      </div>
    );
  },
);

export default PDFViewer;
