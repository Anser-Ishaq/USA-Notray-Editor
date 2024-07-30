export type UserSessionResponse = UserSession[];

export interface UserSession {
  id: number;
  user_id: number;
  job_id: number;
  name: string;
  type: string;
  status: string;
  meeting_link: string;
  meeting_link_expiry: null;
  session_link: string;
  session_expiry: null;
  meeting_password: string;
  session_active: number;
  end_datetime: string;
  start_datetime: string;
  metadata: null;
  socket_room_id: string;
  session_meta: null;
  created_at: string;
  updated_at: null;
  deleted_at: null;
}
