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
    <div className="flex flex-col fixed bottom-0 left-0 right-0 md:left-auto md:right-0 md:w-1/5 md:h-screen md:top-0">
      {import.meta.env.PROD ? (
        <div className="md:hidden w-2/5 bg-gray-200/50 overflow-y-scroll rounded-lg self-end h-32 mb-4 mr-4 z-20">
          <iframe
            src={data?.jobSchedule?.[0]?.whereby_host_link}
            allow="camera; microphone; fullscreen; speaker; display-capture"
            className="border-none w-full h-[calc(100vh-150px)] rounded "
          />
        </div>
      ) : null}
      <div className="flex md:hidden w-full justify-end items-center gap-2 mb-2">
        <Button
          type="primary"
          shape="round"
          className="flex-shrink-0"
          onClick={zoomIn}
          icon={<ZoomInOutlined />}
          disabled={!selectedDocument}
        />
        <Button
          shape="round"
          type="primary"
          className="flex-shrink-0 mr-4"
          onClick={zoomOut}
          icon={<ZoomOutOutlined />}
          disabled={!selectedDocument}
        />
      </div>
      <div className="h-full bg-gray-50 overflow-x-auto">
        <div className="p-2 flex flex-nowrap md:flex-wrap">
          <div className="flex-shrink-0 mr-4 md:mr-0 md:w-full mb-4">
            <h3 className="hidden md:block text-xl mb-3 whitespace-nowrap">
              PDF Controls
            </h3>
            <div className="hidden md:flex items-center gap-2 mb-2">
              <Button
                color="error"
                type="primary"
                className="flex-shrink-0"
                onClick={zoomIn}
                icon={<ZoomInOutlined />}
                disabled={!selectedDocument}
              />
              <Button
                type="primary"
                className="flex-shrink-0"
                onClick={zoomOut}
                icon={<ZoomOutOutlined />}
                disabled={!selectedDocument}
              />
            </div>
            <div className="hidden md:flex flex-col items-center gap-2 mb-2">
              <Button
                loading={isPending}
                color="error"
                type="primary"
                className="flex-shrink-0 w-full whitespace-nowrap"
                onClick={endSession}
                disabled={!selectedDocument}
              >
                End Session
              </Button>
              <Button
                loading={isPending || savingDocument}
                type="primary"
                className="flex-shrink-0 w-full whitespace-nowrap"
                onClick={completeNotarization}
                disabled={!selectedDocument}
              >
                Complete
              </Button>
            </div>
          </div>

          {data?.job_participant?.map((jp) => (
            <div key={jp.ID} className="flex-shrink-0 mr-4 md:mr-0 md:w-full">
              <h3 className="text-xl mb-4 whitespace-nowrap">{jp.fullname}</h3>
              <div className="flex md:grid md:grid-cols-2 gap-4 md:gap-x-4 gap-y-0 md:gap-y-1">
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.INPUT}
                >
                  <Button
                    type="default"
                    className="flex-shrink-0 md:w-full whitespace-nowrap"
                  >
                    Text
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.TEXT}
                  overlayText={jp.fullname}
                >
                  <Button
                    type="default"
                    className="flex-shrink-0 md:w-full whitespace-nowrap"
                  >
                    Name
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.IMAGE}
                  imgSrc={jp.signature_filename}
                >
                  <Button
                    type="default"
                    className="flex-shrink-0 md:w-full whitespace-nowrap"
                  >
                    Sign
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.TEXT}
                  overlayText={DataHelper.getInitials(jp.fullname)}
                >
                  <Button
                    type="default"
                    className="flex-shrink-0 md:w-full whitespace-nowrap"
                  >
                    Initial
                  </Button>
                </DraggableElement>
              </div>
            </div>
          ))}

          {notary && (
            <div className="flex-shrink-0 mr-4 md:mr-0 md:w-full">
              <h3 className="mb-4 md:mt-4 whitespace-nowrap">Notary</h3>
              <div className="flex md:block">
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.INPUT}
                >
                  <Button
                    type="default"
                    className="mr-2 md:mr-0 md:w-full md:justify-start mb-2 whitespace-nowrap"
                  >
                    Text
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.TEXT}
                  overlayText={notary?.fullname}
                >
                  <Button
                    type="default"
                    className="mr-2 md:mr-0 md:w-full md:justify-start mb-2 whitespace-nowrap"
                  >
                    Name
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.TEXT}
                  overlayText={notary?.title}
                >
                  <Button
                    type="default"
                    className="mr-2 md:mr-0 md:w-full md:justify-start mb-2 whitespace-nowrap"
                  >
                    Title
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.TEXT}
                  overlayText={notary?.commission_id}
                >
                  <Button
                    type="default"
                    className="mr-2 md:mr-0 md:w-full md:justify-start mb-2 whitespace-nowrap"
                  >
                    Commission ID
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.TEXT}
                  overlayText={notary?.eo_expdate}
                >
                  <Button
                    type="default"
                    className="mr-2 md:mr-0 md:w-full md:justify-start mb-2 whitespace-nowrap"
                  >
                    Commission Exp Date
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.WHITE_BOX}
                >
                  <Button
                    type="default"
                    className="mr-2 md:mr-0 md:w-full md:justify-start mb-2 whitespace-nowrap"
                  >
                    White Box
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.IMAGE}
                  imgSrc={notary?.seal}
                >
                  <Button
                    type="default"
                    className="mr-2 md:mr-0 md:w-full md:justify-start mb-2 whitespace-nowrap"
                  >
                    Seal
                  </Button>
                </DraggableElement>
                <DraggableElement
                  jobDocId={selectedDocument?.ID}
                  type={ItemType.TEXT}
                  overlayText={notary?.disclosure}
                >
                  <Button
                    type="default"
                    className="mr-2 md:mr-0 md:w-full md:justify-start mb-2 whitespace-nowrap"
                  >
                    Disclosure
                  </Button>
                </DraggableElement>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
