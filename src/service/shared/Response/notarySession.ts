export interface NotarySessionResponse {
  job_participant: Jobparticipant[];
  session: Session[];
  sessionDoc: any[];
  user: User[];
  jobSchedule: JobSchedule[];
}

interface JobSchedule {
  ID: number;
  company_id: string;
  job_id: string;
  job_date: string;
  job_time: string;
  meeting_link: string;
  whereby_host_link: string;
  whereby_join_link: string;
  schedule_status: boolean;
  notary_availability_id: number;
  notary_id: number;
  old_date: null;
  resched_by: null;
}

interface User {
  ID: number;
  company_id: string;
  fullname: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  tc_contact_number: string;
  tc_contact_email: string;
  comm_id_num: string;
  comm_state: string;
  comm_expdate: string;
  signature_filename: string;
  comm_cert_filename: string;
  initials_filename: string;
  idc_filename: string;
  idc_expdate: string;
  eo_amount: string;
  eo_expdate: string;
  eo_certificate: string;
  bond_amount: string;
  bond_expdate: string;
  bond_certificate_filename: string;
  nsa_certified: string;
  nsa_expdate: string;
  speaking_chinese: string;
  speaking_spanish: string;
  speaking_portuguese: string;
  speaking_german: string;
  speaking_french: string;
  speaking_russian: string;
  speaking_italian: string;
  status: string;
  jobs_availed: null;
  date_created: string;
  date_deleted: null;
  stamp_filepath: null;
  commission_exp_date: string;
  commission_id: string;
  disclosure: string;
  seal: string;
  title: string;
  checkbox: string;
  whitebox: string;
  initial: string;
  name: string;
  signature: string;
}

interface Session {
  id: number;
  user_id: number;
  job_id: number;
  name: string;
  type: string;
  status: string;
  meeting_link: null;
  meeting_link_expiry: null;
  session_link: string;
  session_expiry: null;
  meeting_password: null;
  session_active: number;
  end_datetime: null;
  start_datetime: null;
  metadata: null;
  socket_room_id: null;
  session_meta: null;
  created_at: string;
  updated_at: null;
  deleted_at: null;
}

interface Jobparticipant {
  ID: number;
  type: string;
  job_id: string;
  fullname: string;
  email: string;
  phone_number: string;
  tag_color: string;
  role: string;
  same_location: null;
  same_time: string;
  status: string;
  verified: number;
  signature_filename: string;
  initials_filename: string;
  certificateArn: null;
  certificate: string;
  date_created: string;
  date_deleted: null;
}
