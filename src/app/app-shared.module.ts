import { ImageDisplayChunkSelectListComponent } from './image-display-chunk/image-display-chunk-select-list/image-display-chunk-select-list.component';
import { ImageDisplayChunkComponent } from './image-display-chunk/image-display-chunk.component';
import { DialogMobileVideoPlayerComponent } from './dialogs/dialog-mobile-video-player/dialog-mobile-video-player.component';
import { OverlayArchiveDeleteFilterMobileComponent } from './overlay/overlay-archive-delete-filter-mobile/overlay-archive-delete-filter-mobile.component';
import { DialogFilterConfirmationComponent } from './dialogs/dialog-filter-confirmation/dialog-filter-confirmation.component';
import { OverlayArchiveDeleteFilterComponent } from './overlay/overlay-archive-delete-filter/overlay-archive-delete-filter.component';
import { ImageDisplayComponent } from './image-display/image-display.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  Title } from '@angular/platform-browser';
import { ActionListDialogComponent } from './dialogs/action-list-dialog/action-list-dialog.component';
import { DialogConfirmationBoxComponent } from './dialogs/dialog-confirmation-box/dialog-confirmation-box.component';
import { DialogMessageBoxComponent } from './dialogs/dialog-message-box/dialog-message-box.component';
import { MaterialComponents } from './material-components/material-components';
import { OverlayComponent } from './overlay/overlay.component';



@NgModule({
  declarations: [
    DialogMessageBoxComponent,
    DialogConfirmationBoxComponent,
    DialogFilterConfirmationComponent,
    DialogMobileVideoPlayerComponent,
    ActionListDialogComponent,
    OverlayComponent,
    OverlayArchiveDeleteFilterComponent,
    OverlayArchiveDeleteFilterMobileComponent,
    ImageDisplayComponent,
    ImageDisplayChunkComponent,
    
    
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
    DialogFilterConfirmationComponent,
    DialogMobileVideoPlayerComponent,
    ActionListDialogComponent,
    OverlayComponent,
    OverlayArchiveDeleteFilterComponent,
    OverlayArchiveDeleteFilterMobileComponent,
    FormsModule,
    ReactiveFormsModule,
    ImageDisplayComponent,
    ImageDisplayChunkComponent,
  ],
  providers: [{provide: OverlayContainer, useClass: FullscreenOverlayContainer}, Title]
})
export class AppSharedModule { }
