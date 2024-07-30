// PDFViewer.tsx
import { Spin } from 'antd';
import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Document, Page } from 'react-pdf';

interface PDFViewerProps {
  pdfUrl?: string;
}

const PDFViewer = React.forwardRef<HTMLDivElement, PDFViewerProps>(
  ({ pdfUrl }, ref: React.ForwardedRef<any>) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const onDocumentLoadSuccess = useCallback(
      ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
      },
      [],
    );

    useImperativeHandle(ref, () => ({
      setPageNumber: (page: number) => {
        if (page > 0 && page <= (numPages || 1)) {
          setCurrentPage(page);
          const container = document.querySelector('.pdf-container');
          if (container) {
            const pageHeight = container.scrollHeight / (numPages || 1);
            container.scrollTop = (page - 1) * pageHeight;
          }
        }
      },
      getCurrentPage: () => currentPage,
    }));

    return (
      <div ref={ref} className="w-full">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="w-full h-full flex justify-center items-center">
              <Spin spinning />
            </div>
          }
          className="self-center"
        >
          {numPages &&
            Array.from({ length: numPages }, (_, index) => index + 1).map(
              (pageNumber) => <Page key={pageNumber} pageNumber={pageNumber} />,
            )}
        </Document>
      </div>
    );
  },
);

export default PDFViewer;
