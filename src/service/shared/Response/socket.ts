export interface PageSyncRecievedEventData {
  socketRoomId: string;
  syncData: SyncData;
}

interface SyncData {
  scrollPosition: number;
}
