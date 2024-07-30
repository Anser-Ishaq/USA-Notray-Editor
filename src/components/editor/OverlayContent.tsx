import { cloneElement, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { MdCancel } from 'react-icons/md';
import { ResizableBox } from 'react-resizable';

import 'react-resizable/css/styles.css';

import { ItemType, OverlayItem } from '@/types/app';

const OverlayContent = ({
  overlay,
  updateOverlays,
}: {
  overlay: OverlayItem;
  updateOverlays: React.Dispatch<React.SetStateAction<OverlayItem[]>>;
}) => {
  const content = useMemo(() => {
    switch (overlay.type) {
      case ItemType.INPUT:
        return <input id={overlay.id} className="w-full h-full" />;
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
      id={overlay.id}
      className="resizable-overlay -translate-y-[50%] -translate-x-[50%] border border-gray-300 rounded z-10 bg-gray-300/25 cursor-move absolute p-1"
      style={{
        top: overlay.position.y,
        left: overlay.position.x,
        width: overlay.width,
        height: overlay.height,
      }}
    >
      <ResizableBox
        width={overlay.width || 100}
        height={overlay.height || 100}
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
            width: overlay.width,
            height: overlay.height,
          },
        })}
        <div
          className="cancel-icon hidden text-red-500 absolute top-0 right-0 cursor-pointer hover:text-red-700 hover:scale-125 transition-all"
          onClick={removeOverlay}
        >
          <MdCancel />
        </div>
      </ResizableBox>
    </div>
  );
};

export default OverlayContent;
