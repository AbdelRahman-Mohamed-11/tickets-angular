import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccidentService } from '../../../services/accident.service';
import { IncidentDetailsDto } from '../../../interfaces/Accident/IncidentDetails.interface';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interfaces/user.interface';
import { Observable, of } from 'rxjs';
import { AddCommentsDto } from '../../../interfaces/Accident/AddCommentDto.interface';

@Component({
  selector: 'app-update-incident',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-incident.component.html',
  styleUrls: ['./update-incident.component.css'],
})
export class UpdateIncidentComponent implements OnInit {
  incident!: IncidentDetailsDto;
  users: User[] = [];
  loading = true;
  error = '';
  filesToUpload: File[] = [];
  attachmentsToRemove: string[] = [];
  isAdmin = false;
  newComment = '';
  userStatuses = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Reopen' },
    { value: 3, label: 'Closed' },
  ];
  supportStatuses = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Work In Progress' },
    { value: 3, label: 'Delivered' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: AccidentService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getIncidentDetails(id).subscribe({
      next: (dto) => {
        this.incident = dto;
        this.loading = false;
        this.loadERPUsers();
        this.loadCurrentUser();
      },
      error: () => {
        this.error = 'Could not load incident';
        this.loading = false;
      },
    });
  }

  toggleRemoveAttachment(att: { id: string; fileName: string }) {
    if (this.attachmentsToRemove.includes(att.id)) {
      this.attachmentsToRemove = this.attachmentsToRemove.filter(
        (x) => x !== att.id
      );
    } else {
      this.attachmentsToRemove.push(att.id);
    }
  }

  private loadCurrentUser() {
    this.auth.getCurrentUser().subscribe({
      next: (user) => {
        this.isAdmin = user.roles.includes('Admin');
      },
      error: () => console.warn('Failed to load current user'),
    });
  }

  private loadERPUsers() {
    this.auth.getERPUsers().subscribe({
      next: (list) => (this.users = list),
      error: () => console.warn('Failed to load users'),
    });
  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (input.files) this.filesToUpload = Array.from(input.files);
  }

  save() {
    this.loading = true;
    const id = this.incident.id;
    const payload = {
      suggestion: this.incident.suggestion ?? undefined,
      userStatus: this.incident.userStatus,
      supportStatus: this.incident.supportStatus,
      assignedToId: this.incident.assignedToId ?? undefined,
      deliveryDate: this.incident.deliveryDate ?? undefined,
    };

    this.svc.updateIncident(id, payload).subscribe({
      next: () => {
        const removePromise =
          this.attachmentsToRemove.length > 0
            ? this.svc.removeAttachments(id, this.attachmentsToRemove)
            : of(undefined);

        removePromise.subscribe({
          next: () => {
            if (this.filesToUpload.length > 0) {
              this.svc
                .addIncidentAttachments(id, this.filesToUpload)
                .subscribe({
                  next: () => this.router.navigateByUrl('/home'),
                  error: (err) => {
                    console.error('Error uploading new attachments:', err);
                    this.loading = false;
                    this.error = 'Failed to upload attachments';
                  },
                });
            } else {
              this.router.navigateByUrl('/home');
            }
          },
          error: (err) => {
            console.error('Error removing attachments:', err);
            this.loading = false;
            this.error = 'Failed to update attachments';
          },
        });
      },
      error: (err) => {
        console.error('Error updating incident:', err);
        this.loading = false;
        this.error = 'Failed to update incident';
      },
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) return;

    this.loading = true;
    const commentDto: AddCommentsDto = { comments: [this.newComment] };

    this.svc.aaddCommentsToIncident(this.incident.id, commentDto).subscribe({
      next: (updatedComments) => {
        this.incident.comments = updatedComments;
        this.newComment = '';
        this.loading = false;
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        this.error = 'Failed to add comment';
        this.loading = false;
      },
    });
  }
}
