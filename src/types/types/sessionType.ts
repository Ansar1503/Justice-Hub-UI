export interface SessionDocument {
  _id: string;
  session_id: string;
  client_id: string;
  document: { name: string; type: string; url: string; _id?: string }[];
  createdAt: Date;
  updatedAt: Date;
}
