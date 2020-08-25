import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatBadgeModule} from '@angular/material/badge';

import {MatBottomSheetModule, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatRippleModule,
    MatSnackBarModule
  ],
  exports: [
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatBottomSheetModule,
    MatToolbarModule,
    MatRippleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatBadgeModule
  ]
})
export class MaterialModule { }
