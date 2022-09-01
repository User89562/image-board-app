import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogMessage } from 'src/app/entities/dialog';

@Component({
  selector: 'app-dialog-message-box',
  templateUrl: './dialog-message-box.component.html',
  styleUrls: ['./dialog-message-box.component.scss']
})
export class DialogMessageBoxComponent {

  color: any;

  constructor(
    public dialogRef: MatDialogRef<DialogMessageBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMessage) {
    if (data.color) {
      this.color = data.color;
    }
  }

  onClick(): void {
    this.dialogRef.close();
  }

}
