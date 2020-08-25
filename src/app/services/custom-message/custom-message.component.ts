import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-update-component',
  templateUrl: './custom-message.component.html',
  styleUrls: ['./custom-message.component.scss']
})
export class CustomMessageComponent  {

  constructor( @Inject(MAT_BOTTOM_SHEET_DATA) public data: { success:  true | false; message: string},
  private bottomSheetRef: MatBottomSheetRef<CustomMessageComponent>) { }

}
