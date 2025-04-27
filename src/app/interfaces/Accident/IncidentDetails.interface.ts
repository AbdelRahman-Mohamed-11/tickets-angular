export interface GetCommentDto {
  id: string;
  text: string;
  creatorId: string;
  createdAt: string;
}

export interface GetAttachmentDto {
  id: string;
  fileName: string;
  filePath: string;
  uploadedAt: string;
}

export interface IncidentDetailsDto {
  id: string;
  callType: number;
  module: number;
  urlOrFormName: string;
  isRecurring: boolean;
  recurringCallId: string | null;
  priority: number;
  subject: string;
  description: string;
  suggestion: string | null;
  supportStatus: number;
  userStatus: number;
  loggedById: string;
  loggedByUserName: string;
  assignedToId: string | null;
  assignedToUserName: string | null;
  createdDate: string;
  deliveryDate: string | null;
  comments: GetCommentDto[];
  attachments: GetAttachmentDto[];
}
