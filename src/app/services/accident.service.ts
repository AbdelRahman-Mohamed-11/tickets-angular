import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccidentPagedResult } from '../interfaces/Accident/AccidentPagedResult.interface';
import { IncidentListItem } from '../interfaces/Accident/IncidentListItem.interface';
import { CreateIncidentDto } from '../interfaces/Accident/CreateIncidentDto.interface';
import { CreateResponse } from '../interfaces/Accident/CreateResponse.interface';
import {
  GetCommentDto,
  IncidentDetailsDto,
} from '../interfaces/Accident/IncidentDetails.interface';
import { AddCommentsDto } from '../interfaces/Accident/AddCommentDto.interface';

@Injectable({
  providedIn: 'root',
})
export class AccidentService {
  private readonly API_URL = 'https://localhost:7269/api/incidents';

  constructor(private http: HttpClient) {}

  getAccidents(
    pageNumber: number = 1,
    pageSize: number = 10,
    supportStatus?: number | null,
    userStatus?: number | null,
    module?: number | null,
    priority?: number | null,
    assignedToId?: string | null,
    fromDate?: string,
    toDate?: string
  ): Observable<AccidentPagedResult> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (supportStatus != null) {
      params = params.set('supportStatus', supportStatus);
    }
    if (userStatus != null) {
      params = params.set('userStatus', userStatus);
    }
    if (module != null) {
      params = params.set('module', module);
    }
    if (priority != null) {
      params = params.set('priority', priority);
    }
    if (assignedToId) {
      params = params.set('assignedToId', assignedToId);
    }
    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get<AccidentPagedResult>(`${this.API_URL}/paged`, {
      params,
    });
  }

  getIncidentList(): Observable<IncidentListItem[]> {
    return this.http.get<IncidentListItem[]>(`${this.API_URL}/list`);
  }

  createIncident(payload: CreateIncidentDto): Observable<CreateResponse> {
    return this.http.post<CreateResponse>(`${this.API_URL}`, payload);
  }

  addIncidentAttachments(incidentId: string, files: File[]): Observable<void> {
    const formData = new FormData();
    files.forEach((f) => formData.append('Files', f, f.name));
    return this.http.post<void>(
      `${this.API_URL}/${incidentId}/attachments`,
      formData
    );
  }

  getIncidentDetails(id: string): Observable<IncidentDetailsDto> {
    return this.http.get<IncidentDetailsDto>(`${this.API_URL}/${id}`);
  }

  updateIncident(
    id: string,
    payload: {
      suggestion?: string;
      userStatus?: number;
      supportStatus?: number;
      assignedToId?: string;
      deliveryDate?: string;
    }
  ): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}`, payload);
  }

  updateAttachments(id: string, files: File[]): Observable<void> {
    const form = new FormData();
    files.forEach((f) => form.append('Files', f, f.name));
    return this.http.put<void>(`${this.API_URL}/${id}/attachments`, form);
  }

  removeAttachments(id: string, attachmentIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${id}/remove-attachments`, {
      attachmentIds,
    });
  }

  aaddCommentsToIncident(
    incidentId: string,
    dto: AddCommentsDto
  ): Observable<GetCommentDto[]> {
    return this.http.put<GetCommentDto[]>(
      `${this.API_URL}/${incidentId}/comments`,
      dto
    );
  }
}
