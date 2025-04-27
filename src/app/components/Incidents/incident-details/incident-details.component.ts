import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccidentService } from '../../../services/accident.service';
import { IncidentDetailsDto } from '../../../interfaces/Accident/IncidentDetails.interface';

@Component({
  selector: 'app-incident-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './incident-details.component.html',
  styleUrls: ['./incident-details.component.css'],
})
export class IncidentDetailsComponent implements OnInit {
  incident: IncidentDetailsDto | null = null;
  loading = true;
  error = '';

  // lookup tables for enums
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
  supportStatuses = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'WIP' },
    { value: 3, label: 'Delivered' },
  ];
  userStatuses = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Reopen' },
    { value: 3, label: 'Closed' },
  ];

  constructor(
    private route: ActivatedRoute,
    private accidentService: AccidentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'No incident ID provided';
      this.loading = false;
      return;
    }
    this.accidentService.getIncidentDetails(id).subscribe({
      next: (inc) => {
        this.incident = inc;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load incident details';
        this.loading = false;
      },
    });
  }

  getLabel(list: { value: number; label: string }[], value: number): string {
    return list.find((x) => x.value === value)?.label ?? 'Unknown';
  }
}
