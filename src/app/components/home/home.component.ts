import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentService } from '../../services/accident.service';
import { Accident } from '../../interfaces/Accident/Accident.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  accidents: Accident[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private accidentService: AccidentService) {}

  ngOnInit(): void {
    this.loadAccidents();
  }

  private loadAccidents(): void {
    this.accidentService.getAccidents().subscribe({
      next: (data) => {
        this.accidents = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load accidents';
        this.loading = false;
      },
    });
  }

  mapPriority(priority: string): string {
    const priorityValue = Number(priority);
    switch (priorityValue) {
      case 1:
        return 'Showstopper';
      case 2:
        return 'High';
      case 3:
        return 'Medium';
      case 4:
        return 'Low';
      default:
        return 'Unknown';
    }
  }

  mapCallType(callType: string): string {
    const callTypeValue = Number(callType);
    switch (callTypeValue) {
      case 1:
        return 'Bug';
      case 2:
        return 'Change Request';
      case 3:
        return 'Clarification';
      case 4:
        return 'Data Correction';
      case 5:
        return 'Enhancement';
      case 6:
        return 'Report';
      case 7:
        return 'Performance';
      case 8:
        return 'User Access';
      default:
        return 'Unknown';
    }
  }

  mapModule(module: string): string {
    const moduleValue = Number(module);
    switch (moduleValue) {
      case 1:
        return 'Finance';
      case 2:
        return 'Purchase';
      case 3:
        return 'Stock';
      case 4:
        return 'Sales/CRM';
      case 5:
        return 'Service';
      case 6:
        return 'HRMS';
      case 7:
        return 'MyLog';
      default:
        return 'Unknown';
    }
  }

  mapUserStatus(userStatus: string): string {
    const statusValue = Number(userStatus);
    switch (statusValue) {
      case 1:
        return 'Pending';
      case 2:
        return 'Reopen';
      case 3:
        return 'Closed';
      default:
        return 'Unknown';
    }
  }

  mapSupportStatus(supportStatus: string): string {
    const statusValue = Number(supportStatus);
    switch (statusValue) {
      case 1:
        return 'Pending';
      case 2:
        return 'Work In Progress';
      case 3:
        return 'Delivered';
      default:
        return 'Unknown';
    }
  }
}
