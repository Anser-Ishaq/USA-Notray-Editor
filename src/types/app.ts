import { ReactNode } from 'react';
// types.ts

export const ItemType = {
  TEXT: 'text',
  INPUT: 'input',
  TAG_INPUT: 'tagInput',
  TAG: 'tag',
  IMAGE: 'image',
  WHITE_BOX: 'whiteBox',
} as const;

export enum ISessionStatus {
  START_TAGGING = 'START TAGGING',
  END_TAGGING = 'END TAGGING',
  START_NOTARIZATION = 'START NOTARIZATION',
  END_NOTARIZATION = 'END NOTARIZATION',
  NOTARIZATION_COMPLETED = 'NOTARIZATION COMPLETED',
}

export type ItemTypeKeys = keyof typeof ItemType;
export type ItemTypeValues = (typeof ItemType)[ItemTypeKeys];

export interface OverlayItem {
  type: ItemTypeValues;
  children: ReactNode;
  src?: string;
  jobDocId?: number;
  text?: string;
  overlayText?: string;
  value?: string;
  id?: string;
  position: { x: number; y: number };
  initialSize?: { width: number; height: number };
  width: number;
  height: number;
  pageNumber?: number;
}
