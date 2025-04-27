export interface CreateIncidentDto {
  callType: number;
  module: number;
  urlOrFormName: string;
  isRecurring: boolean;
  recurringCallId?: string | null;
  priority: number;
  subject: string;
  description: string;
  suggestion?: string | null;
}
