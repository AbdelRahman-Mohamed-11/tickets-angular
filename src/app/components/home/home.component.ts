import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccidentService } from '../../services/accident.service';
import { AuthService } from '../../services/auth.service';
import { Accident } from '../../interfaces/Accident/Accident.interface';
import { trigger, transition, style, animate } from '@angular/animations';
import { User } from '../../interfaces/user.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  accidents: Accident[] = [];
  users: User[] = [];
  loading = true;
  error = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  totalCount = 0;
  pageSizeOptions = [5, 10, 20, 50, 100];

  filters = {
    supportStatus: null as number | null,
    userStatus: null as number | null,
    module: null as number | null,
    priority: null as number | null,
    assignedToId: null as string | null,
    fromDate: '',
    toDate: '',
  };

  constructor(
    private accidentService: AccidentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccidents();
    this.loadUsers();
  }

  private loadAccidents(): void {
    this.loading = true;
    this.accidentService
      .getAccidents(
        this.currentPage,
        this.pageSize,
        this.filters.supportStatus,
        this.filters.userStatus,
        this.filters.module,
        this.filters.priority,
        this.filters.assignedToId,
        this.filters.fromDate,
        this.filters.toDate
      )
      .subscribe({
        next: (result) => {
          this.accidents = result.data;
          this.currentPage = result.totalPages === 0 ? 0 : result.currentPage;
          this.pageSize = result.pageSize;
          this.totalPages = result.totalPages;
          this.totalCount = result.totalCount;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load accidents';
          this.loading = false;
        },
      });
  }

  private loadUsers(): void {
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: () => {
        console.error('Failed to load users');
      },
    });
  }

  onFiltersChange(): void {
    this.currentPage = 1;
    this.loadAccidents();
  }

  resetFilters(): void {
    this.filters = {
      supportStatus: null,
      userStatus: null,
      module: null,
      priority: null,
      assignedToId: null,
      fromDate: '',
      toDate: '',
    };
    this.currentPage = 1;
    this.loadAccidents();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadAccidents();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAccidents();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadAccidents();
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
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

  navigateToCreateIncident(): void {
    this.router.navigateByUrl('/create-incident');
  }

  navigateToViewIncident(id: number): void {
    this.router.navigateByUrl(`/incidents/${id}`);
  }
  navigateToEditIncident(id: number): void {
    this.router.navigateByUrl(`/incidents/${id}/edit`);
  }
}
