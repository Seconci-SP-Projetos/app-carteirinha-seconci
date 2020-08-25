import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Platform } from '@angular/cdk/platform';
import { timer } from 'rxjs';
import { PromptInstallComponent } from './prompt-install/prompt-install.component';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private promptEvent: any;

  constructor(
    private bottomSheet: MatBottomSheet,
    private platform: Platform,
  ) { }

  public initPwaPrompt() {

    console.log(this.platform)

    if (this.platform.ANDROID) {
        window.addEventListener('beforeinstallprompt', (event: any) => {
          console.log('entering android')
          event.preventDefault();
          this.promptEvent = event;
          this.openPromptComponent('android'); 
        });
    } else if (this.platform.IOS) {
      const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator['standalone']);
      if (!isInStandaloneMode) {
        this.openPromptComponent('ios');
      }
    }  
  }
  
  private openPromptComponent(mobileType: 'ios' | 'android') {
    if (sessionStorage.getItem('installRequested') !== 'yes') {
      timer(3000)
        .pipe(take(1))
        .subscribe(() => this.bottomSheet.open(PromptInstallComponent, { data: { mobileType, promptEvent: this.promptEvent } }));
    }
  }
}