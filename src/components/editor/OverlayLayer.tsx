// OverlayLayer.tsx
import React from 'react';

import OverlayContent from '@/components/editor/OverlayContent';
import { OverlayItem } from '@/types/app';

interface OverlayLayerProps {
  overlays: OverlayItem[];
  updateOverlays: React.Dispatch<React.SetStateAction<OverlayItem[]>>;
}

const OverlayLayer: React.FC<OverlayLayerProps> = React.memo(
  ({ overlays, updateOverlays }) => {
    return (
      <>
        {overlays.map((overlay) => (
          <OverlayContent
            key={overlay.id}
            overlay={overlay}
            updateOverlays={updateOverlays}
          />
        ))}
      </>
    );
  },
);

export default OverlayLayer;
