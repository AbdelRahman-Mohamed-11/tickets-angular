import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccidentService } from '../../../services/accident.service';
import { CreateIncidentDto } from '../../../interfaces/Accident/CreateIncidentDto.interface';
import { IncidentListItem } from '../../../interfaces/Accident/IncidentListItem.interface';
import { CreateResponse } from '../../../interfaces/Accident/CreateResponse.interface';

@Component({
  selector: 'app-create-incident',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-incident.component.html',
  styleUrls: ['./create-incident.component.css'],
})
export class CreateIncidentComponent implements OnInit {
  incident: CreateIncidentDto = {
    callType: null!,
    module: null!,
    urlOrFormName: '',
    isRecurring: false,
    recurringCallId: null,
    priority: null!,
    subject: '',
    description: '',
    suggestion: '',
  };

  incidents: IncidentListItem[] = [];
  selectedFiles: File[] = [];

  callTypes = [
    { value: 1, label: 'Bug' },
    { value: 2, label: 'Change Request' },
    { value: 3, label: 'Clarification' },
    { value: 4, label: 'Data Correction' },
    { value: 5, label: 'Enhancement' },
    { value: 6, label: 'Report' },
    { value: 7, label: 'Performance' },
    { value: 8, label: 'User Access' },
  ];

  modules = [
    { value: 1, label: 'Finance' },
    { value: 2, label: 'Purchase' },
    { value: 3, label: 'Stock' },
    { value: 4, label: 'Sales/CRM' },
    { value: 5, label: 'Service' },
    { value: 6, label: 'HRMS' },
    { value: 7, label: 'MyLog' },
  ];

  priorities = [
    { value: 1, label: 'Showstopper' },
    { value: 2, label: 'High' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'Low' },
  ];

  constructor(
    private accidentService: AccidentService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onRecurringChange(): void {
    if (this.incident.isRecurring) {
      this.accidentService.getIncidentList().subscribe({
        next: (data) => (this.incidents = data),
        error: () => alert('Failed to load incidents'),
      });
    } else {
      this.incidents = [];
      this.incident.recurringCallId = null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  saveIncident(): void {
    if (!this.incident.isRecurring) {
      this.incident.recurringCallId = null;
    }

    this.accidentService.createIncident(this.incident).subscribe({
      next: (res: CreateResponse) => {
        const newId = res.id;
        if (this.selectedFiles.length) {
          this.accidentService
            .addIncidentAttachments(newId, this.selectedFiles)
            .subscribe({
              next: () => {
                this.router.navigateByUrl('/');
              },
              error: () => {
                this.router.navigateByUrl('/');
              },
            });
        } else {
          this.router.navigateByUrl('/');
        }
      },
    });
  }

  navigateBack() {
    this.router.navigate(['/home']);
  }
}
