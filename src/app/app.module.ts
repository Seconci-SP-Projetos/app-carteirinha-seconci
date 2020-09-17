import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MaterialModule} from './material/material.module';
import { AgmCoreModule } from '@agm/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { LoginDetailResolver } from './login-routing.module'
import { AceiteDetailResolver } from './aceite-routing.module'

import { MultiService } from './services/multi.services'
import { CarteiraComponent } from './carteira/carteira.component';
import { AgendaComponent } from './agenda/agenda.component';
import { PageNoFoundComponent } from './page-no-found/page-no-found.component';
import { LoginComponent } from './login/login.component';
import { TermoAceiteComponent } from './termo-aceite/termo-aceite.component';
import { MapComponent } from './map/map.component'
import { ManualComponent } from './manual/manual.component';

import { environment } from '../environments/environment';
import { PromptInstallComponent } from './services/prompt-install/prompt-install.component'
import { PwaService } from './services/pwa.service';
import { ProfileComponent } from './profile/profile.component';
import { CustomMessageComponent } from './services/custom-message/custom-message.component';
import { ValidaSMSComponent } from './valida-sms/valida-sms.component';
import { ValidaSMSDetailResolver } from './valida-SMS.resolver';
import { DocumentosComponent } from './documentos/documentos.component';
import { ExibeDocComponent } from './exibe-doc/exibe-doc.component';

const initializer = (pwaService: PwaService) => () => pwaService.initPwaPrompt();

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL }
  };

  buildHammer(element: HTMLElement) {

    const mc = new Hammer(element, { touchAction: 'pan-y' });
    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    
    return mc;

  }
}

@NgModule({
  declarations: [
    AppComponent,
    CarteiraComponent,
    AgendaComponent,
    PageNoFoundComponent,
    LoginComponent,
    TermoAceiteComponent,
    MapComponent,
    ManualComponent, 
    PromptInstallComponent, 
    ProfileComponent,
    CustomMessageComponent,
    ValidaSMSComponent,
    DocumentosComponent,
    ExibeDocComponent
  ],
  imports: [
    FormsModule, 
    ReactiveFormsModule,
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PdfViewerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAxivt9lTyMrY-k_VkqAArN2Rl7O_8TGBg'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ]
  ,
  entryComponents: [ PromptInstallComponent, CustomMessageComponent ],  
  providers: [ AuthService,
               AuthGuardService, 
               LoginDetailResolver,
               AceiteDetailResolver,
               ValidaSMSDetailResolver,
               { provide: APP_INITIALIZER, useFactory: initializer, deps: [PwaService], multi: true},
               { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig, },
               MultiService
             ],
  bootstrap: [AppComponent],
  exports: [MaterialModule]
  
})
export class AppModule { }
