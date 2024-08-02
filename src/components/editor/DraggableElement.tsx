import { ReactNode } from 'react';
import { useDrag } from 'react-dnd';

import { ItemTypeValues, OverlayItem } from '@/types/app';

interface DraggableElementProps {
  type: ItemTypeValues;
  children: ReactNode;
  overlayText?: string;
  initialSize?: { width: number; height: number };
  imgSrc?: string;
  initialPosition?: { x: number; y: number };
  jobDocId?: number;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  type,
  children,
  initialPosition,
  overlayText,
  initialSize,
  imgSrc,
  jobDocId,
}) => {
  const item: OverlayItem = {
    type,
    overlayText,
    src: imgSrc,
    children,
    position: initialPosition ?? { x: 0, y: 0 },
    width: initialSize?.width ?? 100,
    height: initialSize?.height ?? 100,
    jobDocId,
  };
  const [, drag] = useDrag({
    type,
    item,
  });

  return <div ref={drag}>{children}</div>;
};

export default DraggableElement;
