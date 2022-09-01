import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActionListDialogComponent } from './dialogs/action-list-dialog/action-list-dialog.component';
import { DialogConfirmationBoxComponent } from './dialogs/dialog-confirmation-box/dialog-confirmation-box.component';
import { DialogMessageBoxComponent } from './dialogs/dialog-message-box/dialog-message-box.component';
import { MaterialComponents } from './material-components/material-components';
import { OverlayComponent } from './overlay/overlay.component';



@NgModule({
  declarations: [
    DialogMessageBoxComponent,
    DialogConfirmationBoxComponent,
    ActionListDialogComponent,
    OverlayComponent,
  ],
  imports: [
    CommonModule,
    MaterialComponents,
    FlexLayoutModule,
  ],
  exports: [
    CommonModule,
    MaterialComponents,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    DialogMessageBoxComponent,
    DialogConfirmationBoxComponent,
    ActionListDialogComponent,
    OverlayComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{provide: OverlayContainer, useClass: FullscreenOverlayContainer}, Title]
})
export class AppSharedModule { }
