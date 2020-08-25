import { Component, Inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-prompt-component',
  templateUrl: './prompt-install.component.html',
  styleUrls: ['./prompt-install.component.scss']
})
export class PromptInstallComponent  {

  constructor( @Inject(MAT_BOTTOM_SHEET_DATA) public data: { mobileType: 'ios' | 'android', promptEvent?: any },
  private bottomSheetRef: MatBottomSheetRef<PromptInstallComponent>) { }

  public installPwa(): void {
      sessionStorage.setItem('installRequested', 'yes')
      this.data.promptEvent.prompt();
      this.close();
  }

  public close() {
    this.bottomSheetRef.dismiss();
  }


  get installRequested() { return sessionStorage.getItem('installRequested') };
}
