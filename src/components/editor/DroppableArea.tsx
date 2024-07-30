// DroppableArea.tsx
import React from 'react';
import { useDrop } from 'react-dnd';
import * as uuid from 'uuid';

import { ItemType, OverlayItem } from '@/types/app';

interface DroppableAreaProps {
  children: React.ReactNode;
  addOverlay: (item: OverlayItem) => void;
  updateOverlays: React.Dispatch<React.SetStateAction<OverlayItem[]>>;
  pdfRef: React.RefObject<HTMLDivElement>;
  overlays: OverlayItem[];
}

const DroppableArea: React.FC<DroppableAreaProps> = ({
  children,
  addOverlay,
  updateOverlays,
  pdfRef,
  overlays,
}) => {
  const [, drop] = useDrop({
    accept: [ItemType.TEXT, ItemType.IMAGE, ItemType.INPUT],
    canDrop: (_item: OverlayItem, monitor) => {
      const offset = monitor.getClientOffset();
      const dropperDimensions = pdfRef.current?.getBoundingClientRect();

      return (
        (dropperDimensions &&
          offset &&
          dropperDimensions.left < offset?.x &&
          dropperDimensions.right > offset?.x &&
          dropperDimensions.top < offset?.y &&
          dropperDimensions.bottom > offset?.y) ??
        false
      );
    },
    drop: (item: OverlayItem, monitor) => {
      const dropperDimensions = pdfRef.current?.getBoundingClientRect();
      const offset = monitor.getClientOffset();

      if (!dropperDimensions || !offset) return;

      const x = offset.x - dropperDimensions.left;
      const y = offset.y - dropperDimensions.top;

      if (overlays?.find((ov) => ov?.id === item.id)) {
        updateOverlays((prevOverlays) => [
          ...prevOverlays.filter((ov) => ov?.id !== item.id),
          {
            ...item,
            position: { x, y },
          },
        ]);
      } else {
        addOverlay({
          ...item,
          id: item?.id ?? uuid.v4(),
          position: { x, y },
        });
      }
    },
  });

  return (
    <div ref={drop} className="h-full w-full">
      {children}
    </div>
  );
};

export default React.memo(DroppableArea);
