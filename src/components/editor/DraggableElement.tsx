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

const getInitialSize = (type?: ItemTypeValues) => {
  switch (type) {
    case 'text':
      return { width: 200, height: 30 };
    case 'image':
      return { width: 200, height: 100 };
    case 'input':
      return { width: 10, height: 30 };
    case 'whiteBox':
      return { width: 100, height: 60 };
    case 'tag':
      return { width: 150, height: 80 };
    default:
      return { width: 50, height: 50 };
  }
};

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
    width: initialSize?.width ?? getInitialSize(type)?.width,
    height: initialSize?.height ?? getInitialSize(type)?.height,
    jobDocId,
  };
  const [, drag] = useDrag({
    type,
    item,
  });

  return <div ref={drag}>{children}</div>;
};

export default DraggableElement;
