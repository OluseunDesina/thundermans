import { NgModule } from '@angular/core';

import {
  MatToolbarModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule,
  MatListModule,
  MatIconModule
} from '@angular/material';

@NgModule({
  exports: [
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatListModule,
    MatIconModule
  ]
})
export class MaterialModule {}
