import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CarteiraComponent } from './carteira/carteira.component';
import { PageNoFoundComponent } from './page-no-found/page-no-found.component';
import { MapComponent } from './map/map.component';
import { ManualComponent } from './manual/manual.component';
import { AgendaComponent } from './agenda/agenda.component';
import { LoginDetailResolver } from './login-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ValidaSMSComponent } from './valida-sms/valida-sms.component';
import { ValidaSMSDetailResolver } from './valida-SMS.resolver';
import { DocumentosComponent } from './documentos/documentos.component';
import { ExibeDocComponent } from './exibe-doc/exibe-doc.component';

import { AuthGuardService as AuthGuard } from './auth-guard.service';

const routes: Routes = [
  { path: 'login', 
    component: LoginComponent,
    resolve: {
      component: LoginDetailResolver
    } 
  },
  { path: 'validasms', 
    component: ValidaSMSComponent,
    resolve: {
      component: ValidaSMSDetailResolver
    } 
  },
  { path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'agenda', 
    component: AgendaComponent,
    canActivate: [AuthGuard]
  },
  { path: 'documentos', 
    component: DocumentosComponent,
    canActivate: [AuthGuard]
  },
  { path: 'exibeDoc', 
    component: ExibeDocComponent,
    canActivate: [AuthGuard]
  },
  { path: 'carteira', 
    component: CarteiraComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'map', 
    component: MapComponent,
    canActivate: [AuthGuard] },
  { path: 'manual', 
    component: ManualComponent,
    canActivate: [AuthGuard] },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  { path: '**', component: PageNoFoundComponent },
  { path: '',   component: LoginDetailResolver }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
