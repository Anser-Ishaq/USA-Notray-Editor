// SidePanel.tsx
import { Button, message } from 'antd';
import html2canvas from 'html2canvas';
import React from 'react';

import DraggableElement from '@/components/editor/DraggableElement';
import DataHelper from '@/helper/DataHelper';
import {
  useCompleteJobDocumentMutation,
  useUpdateSessionMutation,
} from '@/service/notarySession/hooks';
import { NotarySessionResponse } from '@/service/shared/Response/notarySession';
import { ParticipantDocsResponse } from '@/service/shared/Response/participantDocs';
import { ISessionStatus, ItemType } from '@/types/app';

interface SidePanelProps {
  data: NotarySessionResponse | undefined;
  notary: ParticipantDocsResponse['notary'][0] | undefined;
  documentsData: ParticipantDocsResponse | undefined;
}

const SidePanel: React.FC<SidePanelProps> = ({
  data,
  notary,
  documentsData,
}) => {
  const { mutate: updateSessionStatus, isPending } = useUpdateSessionMutation();
  const { mutate: completeJobDocument, isPending: savingDocument } =
    useCompleteJobDocumentMutation();

  async function exportPDF() {
    const input = document.getElementById('pdf-viewer');
    if (!input) return;

    try {
      // Capture the content as a canvas
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: true, // Enable logging for debugging
        allowTaint: true, // Allow cross-origin images to taint the canvas
      });

      // Convert the canvas to a base64 string
      const base64String = canvas.toDataURL('image/png');

      // Log the base64 string to the console
      console.log('Base64 representation of the document:');
      console.log(base64String);

      // Optionally, you can still create the PDF object if needed
      // const pdf = new jsPDF({
      //   orientation: 'p',
      //   unit: 'px',
      //   format: [canvas.width, canvas.height],
      // });
      // pdf.addImage(base64String, 'PNG', 0, 0, canvas.width, canvas.height);

      // You can return the base64 string if you want to use it elsewhere
      return base64String;
    } catch (error) {
      console.error('Error generating document base64:', error);
    }
  }

  console.log('DATA', data);
  const endSession = () => {
    updateSessionStatus(
      {
        sessionId: 2793,
        jobId: data?.session?.[0]?.job_id ?? 0,
        status: ISessionStatus.END_NOTARIZATION,
      },
      {
        onSuccess: () => {
          message.success('Session ended successfully');
        },
      },
    );
  };

  const completeNotarization = async () => {
    const base64Doc = await exportPDF();
    updateSessionStatus(
      {
        sessionId: 2793,
        jobId: data?.session?.[0]?.job_id ?? 0,
        status: ISessionStatus.NOTARIZATION_COMPLETED,
      },
      {
        onSuccess: () => {
          completeJobDocument({
            job_id: data?.session?.[0]?.job_id ?? 0,
            job_doc_id: documentsData?.job_docs?.[0]?.ID ?? 0,
            status: ISessionStatus.NOTARIZATION_COMPLETED,
            doc_base64: base64Doc ?? '',
            docId: documentsData?.job_docs?.[0]?.ID ?? 0,
          });
        },
      },
    );
  };
  return (
    <div className="bg-gray-50 h-full overflow-y-auto fixed right-0 w-1/4 col-span-3">
      <div className="p-4">
        <h3 className="text-xl mb-4">PDF</h3>
        <div className="flex items-center gap-4 mb-2">
          <Button
            loading={isPending}
            color="error"
            type="primary"
            block
            className="mb-2 flex-1"
            onClick={endSession}
          >
            End Session
          </Button>
          <Button
            loading={isPending || savingDocument}
            type="primary"
            block
            className="mb-2 flex-1"
            onClick={completeNotarization}
          >
            Complete
          </Button>
        </div>
        <Button
          type="default"
          block
          className="flex-1 mb-4"
          onClick={exportPDF}
        >
          Export
        </Button>
        {data?.job_participant?.map(
          (jp: NotarySessionResponse['job_participant'][0]) => (
            <div key={jp.ID} className="flex flex-col mb-4">
              <h3 className="text-xl mb-4">{jp.fullname}</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <DraggableElement type={ItemType.INPUT}>
                  <Button type="default" block className="mb-2">
                    Text
                  </Button>
                </DraggableElement>
                <DraggableElement
                  type={ItemType.TEXT}
                  overlayText={jp.fullname}
                >
                  <Button type="default" block className="mb-2">
                    Name
                  </Button>
                </DraggableElement>
                <DraggableElement
                  type={ItemType.IMAGE}
                  imgSrc={jp.signature_filename}
                >
                  <Button type="default" block className="mb-2">
                    Sign
                  </Button>
                </DraggableElement>
                <DraggableElement
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
            <DraggableElement type={ItemType.INPUT}>
              <Button type="default" block className="justify-start mb-2">
                Text
              </Button>
            </DraggableElement>
            <DraggableElement
              type={ItemType.TEXT}
              overlayText={notary?.fullname}
            >
              <Button type="default" block className="justify-start mb-2">
                Name
              </Button>
            </DraggableElement>
            <DraggableElement type={ItemType.TEXT} overlayText={notary?.title}>
              <Button type="default" block className="justify-start mb-2">
                Title
              </Button>
            </DraggableElement>
            <DraggableElement
              type={ItemType.TEXT}
              overlayText={notary?.commission_id}
            >
              <Button type="default" block className="justify-start mb-2">
                Commission ID
              </Button>
            </DraggableElement>
            <DraggableElement
              type={ItemType.TEXT}
              overlayText={notary?.eo_expdate}
            >
              <Button type="default" block className="justify-start mb-2">
                Commission Exp Date
              </Button>
            </DraggableElement>
            <DraggableElement type={ItemType.IMAGE} imgSrc={notary?.seal}>
              <Button type="default" block className="justify-start mb-2">
                Seal
              </Button>
            </DraggableElement>
            <DraggableElement
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
