import { Accident } from './Accident.interface';

export interface AccidentPagedResult {
  data: Accident[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
