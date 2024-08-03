import React from 'react';
import { useDrop } from 'react-dnd';
import * as uuid from 'uuid';

import { ItemType, OverlayItem } from '@/types/app';

interface DroppableAreaProps {
  children: React.ReactNode;
  addOverlay: (item: OverlayItem) => void;
  updateOverlays: React.Dispatch<React.SetStateAction<OverlayItem[]>>;
  overlays: OverlayItem[];
  pageNumber: number;
}

const DroppableArea: React.FC<DroppableAreaProps> = React.memo(
  ({ children, addOverlay, updateOverlays, overlays, pageNumber }) => {
    const [, drop] = useDrop({
      accept: [ItemType.TEXT, ItemType.IMAGE, ItemType.INPUT],
      canDrop: (_item: OverlayItem, monitor) => {
        const offset = monitor.getClientOffset();
        const dropperDimensions = document
          ?.querySelector(`.pdf-page[data-page-number='${pageNumber}']`)
          ?.getBoundingClientRect();

        return (
          (dropperDimensions &&
            offset &&
            dropperDimensions.left < offset?.x &&
            dropperDimensions.right > offset?.x) ??
          false
        );
      },
      drop: (item: OverlayItem, monitor) => {
        const offset = monitor.getClientOffset();
        const dropperDimensions = document
          ?.querySelector(`.pdf-page[data-page-number='${pageNumber}']`)
          ?.getBoundingClientRect();

        if (!dropperDimensions || !offset) return;

        const x = offset.x - dropperDimensions.left;
        const y = offset.y - dropperDimensions.top;

        if (overlays?.find((ov) => ov?.id === item.id)) {
          updateOverlays((prevOverlays) => [
            ...prevOverlays.filter((ov) => ov?.id !== item.id),
            {
              ...item,
              pageNumber,
              position: { x, y },
            },
          ]);
        } else {
          addOverlay({
            ...item,
            id: item?.id ?? uuid.v4(),
            pageNumber,
            position: { x, y },
          });
        }
      },
    });

    return (
      <div
        ref={drop}
        className="pdf-page h-full w-full relative flex justify-center my-2"
        data-page-number={pageNumber}
      >
        {children}
      </div>
    );
  },
);

export default DroppableArea;
