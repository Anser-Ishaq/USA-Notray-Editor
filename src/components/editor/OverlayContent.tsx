import classNames from 'classnames';
import { cloneElement, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { MdCancel } from 'react-icons/md';
import { ResizableBox } from 'react-resizable';

import 'react-resizable/css/styles.css';

import { ItemType, OverlayItem } from '@/types/app';

function autoGrow(inputId: string) {
  const inputMirrorDiv = document.getElementById('inputMirror-' + inputId)!;
  const input: any = document.getElementById('input-' + inputId)!;
  inputMirrorDiv.textContent = input.value || input.placeholder;
  input.style.width = inputMirrorDiv.offsetWidth + 'px';
}

const InputElement = ({ overlay }: { overlay: OverlayItem }) => {
  return (
    <div
      className="overlayed-input-container"
      id={'inputContainer-' + overlay?.id}
    >
      <input
        type="text"
        className="font-body ring-none border-none"
        id={'input-' + overlay?.id}
        onInput={() => overlay?.id && autoGrow(overlay.id)}
      />
      <div
        className="overlayed-input-mirror"
        id={'inputMirror-' + overlay?.id}
      ></div>
    </div>
  );
};

const OverlayContent = ({
  overlay,
  updateOverlays,
}: {
  overlay: OverlayItem;
  updateOverlays: React.Dispatch<React.SetStateAction<OverlayItem[]>>;
}) => {
  const content = useMemo(() => {
    switch (overlay.type) {
      case ItemType.WHITE_BOX:
        return <div className="w-full h-full bg-white" />;
      case ItemType.INPUT:
        return <InputElement overlay={overlay} />;
      case ItemType.TEXT:
        return (
          <p
            id={overlay.id}
            className="w-full h-full"
            style={{ fontSize: `${overlay.width / 10}px` }} // Example for dynamic font size
          >
            {overlay.overlayText}
          </p>
        );
      case ItemType.IMAGE:
        return (
          <img
            id={overlay.id}
            className="w-full h-full object-contain"
            src={overlay?.src}
          />
        );
      default:
        return null;
    }
  }, [overlay]);

  const [_, drag] = useDrag({
    type: overlay.type,
    item: { ...overlay },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const removeOverlay = () => {
    updateOverlays((prevOverlays) => [
      ...prevOverlays.filter((ov) => ov?.id !== overlay.id),
    ]);
  };

  if (!content) return;
  return (
    <div
      className="resizable-overlay -translate-y-[50%] -translate-x-[50%] rounded z-10 cursor-move absolute p-0.5"
      style={{
        top: overlay.position.y,
        left: overlay.position.x,
        width: overlay.width,
        height: overlay.height,
      }}
    >
      <ResizableBox
        style={{ width: overlay?.type === 'input' ? 'max-content' : undefined }}
        width={overlay.width}
        height={overlay.height}
        onResizeStop={(_, data) => {
          overlay.width = data.size.width;
          overlay.height = data.size.height;
          updateOverlays((prevOverlays) => [
            ...prevOverlays.filter((ov) => ov?.id !== overlay.id),
            {
              ...(overlay as OverlayItem),
              width: data.size.width,
              height: data.size.height,
            },
          ]);
        }}
        resizeHandles={['se']}
      >
        {cloneElement(content, {
          ref: drag,
          style: {
            width: '100%',
            height: '100%',
          },
        })}
        <div
          className={classNames(
            overlay?.type === 'input' ? 'left-0 top-0' : 'top-0 right-0',
            'cancel-icon hidden text-red-500 absolute cursor-pointer hover:text-red-700 hover:scale-125 transition-all',
          )}
          onClick={removeOverlay}
        >
          <MdCancel />
        </div>
      </ResizableBox>
    </div>
  );
};

export default OverlayContent;
