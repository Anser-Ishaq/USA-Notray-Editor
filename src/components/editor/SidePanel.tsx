// SidePanel.tsx
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React from 'react';
import { useDispatch } from 'react-redux';

import DraggableElement from '@/components/editor/DraggableElement';
import DataHelper from '@/helper/DataHelper';
import {
  useCompleteJobDocumentMutation,
  useUpdateSessionMutation,
} from '@/service/notarySession/hooks';
import { NotarySessionResponse } from '@/service/shared/Response/notarySession';
import {
  Jobdoc,
  ParticipantDocsResponse,
} from '@/service/shared/Response/participantDocs';
import { UserSessionResponse } from '@/service/shared/Response/userSession';
import socketService from '@/service/socket/socketService';
import { hideLoader, setLoader } from '@/store/slices/app';
import { ISessionStatus, ItemType, OverlayItem } from '@/types/app';

interface SidePanelProps {
  data: NotarySessionResponse | undefined;
  userSession?: UserSessionResponse;
  notary: ParticipantDocsResponse['notary'][0] | undefined;
  documentsData: ParticipantDocsResponse | undefined;
  overlays?: OverlayItem[];
  sessionId?: number;
  selectedDocument?: Jobdoc;
  zoomIn: () => void;
  zoomOut: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  data,
  userSession,
  notary,
  documentsData,
  overlays,
  sessionId,
  selectedDocument,
  zoomIn,
  zoomOut,
}) => {
  const dispatch = useDispatch();

  const { mutate: updateSessionStatus, isPending } = useUpdateSessionMutation();
  const { mutate: completeJobDocument, isPending: savingDocument } =
    useCompleteJobDocumentMutation();

  async function exportPDF() {
    const input = document.getElementById('pdf-viewer');
    if (!input) return;

    const pdf = new jsPDF('p', 'pt', 'a4');
    const pages = input.querySelectorAll('.pdf-page');

    dispatch(
      setLoader({
        isLoading: true,
        message: 'Compiling PDF',
      }),
    );

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;

      // Scale the canvas to match A4 size
      const canvas = await html2canvas(page, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.5); // Compress the image to reduce size

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i > 0) {
        pdf.addPage();
      }

      dispatch(
        setLoader({
          isLoading: true,
          message: 'Compiling Page number: ' + (i + 1),
        }),
      );

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    dispatch(
      setLoader({
        isLoading: true,
        message: 'Finalizing the PDF',
      }),
    );

    pdf.save('test.pdf');

    // Get the PDF as a base64 string
    const base64PDF = pdf.output('datauristring');

    dispatch(hideLoader());

    return base64PDF;
  }

  // This is required because JSON.stringify cannot parse circular JSON
  const sanitizedOverlays = overlays
    ?.filter((ov) => !!ov?.jobDocId && !!ov?.pageNumber && ov?.position)
    ?.map((ov) => {
      const { children: _, ...sanitizedOverlay } = ov;
      return sanitizedOverlay;
    });

  const endSession = () => {
    updateSessionStatus(
      {
        sessionId: sessionId ?? 246,
        jobId: data?.session?.[0]?.job_id ?? 0,
        status: ISessionStatus.END_NOTARIZATION,
        metadata: JSON.stringify(sanitizedOverlays),
      },
      {
        onSuccess: () => {
          message.success('Session ended successfully');
        },
      },
    );
  };

  const completeNotarization = async () => {
    dispatch(setLoader({ isLoading: true, message: 'Compiling PDF ...' }));

    const base64Doc = await exportPDF();

    // // This is required because JSON.stringify cannot parse circular JSON
    // const sanitizedOverlays = overlays?.map((ov) => {
    //   const { children: _, ...sanitizedOverlay } = ov;
    //   return sanitizedOverlay;
    // });

    console.log('BASE 64', base64Doc);

    // updateSessionStatus(
    //   {
    //     sessionId: sessionId ?? 246,
    //     jobId: data?.session?.[0]?.job_id ?? 0,
    //     status: ISessionStatus.NOTARIZATION_COMPLETED,
    //     metadata: JSON.stringify(sanitizedOverlays),
    //   },
    //   {
    //     onSuccess: () => {
    completeJobDocument(
      {
        job_id: data?.session?.[0]?.job_id ?? 0,
        job_doc_id: documentsData?.job_docs?.[0]?.ID ?? 0,
        status: 'COMPLETED',
        doc_base64: base64Doc ?? '',
        docId: documentsData?.job_docs?.[0]?.ID ?? 0,
      },
      {
        onSuccess: () => {
          socketService.emit('message', {
            socketRoomId: userSession?.[0]?.socket_room_id,
            front_doc_index: documentsData?.job_docs?.[0]?.ID,
            doc_id: documentsData?.job_docs?.[0]?.ID,
            action: 'completedocument',
            jobId: userSession?.[0]?.job_id,
          });
        },
      },
    );
    //     },
    //   },
    // );
  };

  return (
    <div className="bg-gray-50 h-full overflow-y-auto fixed right-0 w-1/5 col-span-3">
      <div className="p-2">
        <h3 className="text-xl mb-4">PDF</h3>
        <div className="flex items-center gap-4 mb-2">
          <Button
            color="error"
            type="primary"
            block
            className="mb-2 flex-1"
            onClick={zoomIn}
            icon={<ZoomInOutlined />}
            disabled={!selectedDocument}
          />
          <Button
            type="primary"
            block
            className="mb-2 flex-1"
            onClick={zoomOut}
            icon={<ZoomOutOutlined />}
            disabled={!selectedDocument}
          />
        </div>
        <div className="flex items-center gap-4 mb-2">
          <Button
            loading={isPending}
            color="error"
            type="primary"
            block
            className="mb-2 flex-1"
            onClick={endSession}
            disabled={!selectedDocument}
          >
            End Session
          </Button>
          <Button
            loading={isPending || savingDocument}
            type="primary"
            block
            className="mb-2 flex-1"
            onClick={completeNotarization}
            disabled={!selectedDocument}
          >
            Complete
          </Button>
        </div>
        {data?.job_participant?.map(
          (jp: NotarySessionResponse['job_participant'][0]) => (
            <div key={jp.ID} className="flex flex-col mb-4">
              <h3 className="text-xl mb-4">{jp.fullname}</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.INPUT}
                >
                  <Button type="default" block className="mb-2">
                    Text
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.TEXT}
                  overlayText={jp.fullname}
                >
                  <Button type="default" block className="mb-2">
                    Name
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.IMAGE}
                  imgSrc={jp.signature_filename}
                >
                  <Button type="default" block className="mb-2">
                    Sign
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.TEXT}
                  overlayText={DataHelper.getInitials(jp.fullname)}
                >
                  <Button type="default" block className="mb-2">
                    Initial
                  </Button>
                </DraggableElement>
              </div>
            </div>
          ),
        )}
        {notary ? (
          <>
            <h3 className="mb-4 mt-4">Notary</h3>
            <DraggableElement
              jobDocId={selectedDocument?.ID}
              type={ItemType.INPUT}
            >
              <Button type="default" block className="justify-start mb-2">
                Text
              </Button>
            </DraggableElement>
            <DraggableElement
              jobDocId={selectedDocument?.ID}
              type={ItemType.TEXT}
              overlayText={notary?.fullname}
            >
              <Button type="default" block className="justify-start mb-2">
                Name
              </Button>
            </DraggableElement>
            <DraggableElement
              jobDocId={selectedDocument?.ID}
              type={ItemType.TEXT}
              overlayText={notary?.title}
            >
              <Button type="default" block className="justify-start mb-2">
                Title
              </Button>
            </DraggableElement>
            <DraggableElement
              jobDocId={selectedDocument?.ID}
              type={ItemType.TEXT}
              overlayText={notary?.commission_id}
            >
              <Button type="default" block className="justify-start mb-2">
                Commission ID
              </Button>
            </DraggableElement>
            <DraggableElement
              jobDocId={selectedDocument?.ID}
              type={ItemType.TEXT}
              overlayText={notary?.eo_expdate}
            >
              <Button type="default" block className="justify-start mb-2">
                Commission Exp Date
              </Button>
            </DraggableElement>
            <DraggableElement
              jobDocId={selectedDocument?.ID}
              type={ItemType.IMAGE}
              imgSrc={notary?.seal}
            >
              <Button type="default" block className="justify-start mb-2">
                Seal
              </Button>
            </DraggableElement>
            <DraggableElement
              jobDocId={selectedDocument?.ID}
              type={ItemType.TEXT}
              overlayText={notary?.disclosure}
            >
              <Button type="default" block className="justify-start mb-2">
                Disclosure
              </Button>
            </DraggableElement>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SidePanel;
