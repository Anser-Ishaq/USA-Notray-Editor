export interface AddNewPageEventData {
  socketRoomId: string; // Required: To specify the room for emitting events
  dataBaseActiveDocId: number; // Required: Identifies the document being modified
  pageCount: number; // Required: The new page count after the addition
  meta?: Record<string, any>; // Optional: Any additional metadata
  sessionId: string; // Required: Identifies the session for tracking purposes
  user_id: number; // Required: Identifies the user performing the action
  user_type?: string; // Optional: Type of user, e.g., "admin", "editor"
  action?: string; // Optional: Describes the action, e.g., "add"
  action_details?: string; // Optional: Additional details about the action
  type?: string; // Optional: Specifies the type of event or user interaction
}

export interface PageSyncEventData {
  socketRoomId: string; // Required: To specify the room for emitting events
  syncData: Record<string, any>; // Required: The data to be synchronized, could include content or state
}
