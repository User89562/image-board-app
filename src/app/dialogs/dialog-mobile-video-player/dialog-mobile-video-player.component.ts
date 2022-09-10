import { HydrusFile } from 'src/app/entities/hydrus-file';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-mobile-video-player',
  templateUrl: './dialog-mobile-video-player.component.html',
  styleUrls: ['./dialog-mobile-video-player.component.scss']
})
export class DialogMobileVideoPlayerComponent {
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<DialogMobileVideoPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HydrusFile) {
  }

  onClick(): void {
    this.dialogRef.close();
  }

  onLoad(): void {
    this.loading = false;
  }
}
