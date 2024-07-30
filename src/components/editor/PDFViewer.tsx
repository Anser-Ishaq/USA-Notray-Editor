// PDFViewer.tsx
import { Spin } from 'antd';
import React, { useCallback, useState } from 'react';
import { Document, Page } from 'react-pdf';

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = React.memo(({ pdfUrl }) => {
  const [_numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, _setPageNumber] = useState(1);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    [],
  );

  return (
    <div className="w-full">
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
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  );
});

export default PDFViewer;
