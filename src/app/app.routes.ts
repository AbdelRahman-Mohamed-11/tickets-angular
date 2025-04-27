import { Routes } from '@angular/router';
import { IncidentDetailsComponent } from './components/Incidents/incident-details/incident-details.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateIncidentComponent } from './components/Incidents/create-incident/create-incident.component';
import { UpdateIncidentComponent } from './components/Incidents/update-incident/update-incident.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'create-incident',
    component: CreateIncidentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'incidents/:id',
    component: IncidentDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'incidents/:id/edit',
    component: UpdateIncidentComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
