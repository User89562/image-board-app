
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogMessage } from 'src/app/entities/dialog';

@Component({
  selector: 'app-dialog-confirmation-box',
  templateUrl: './dialog-confirmation-box.component.html',
  styleUrls: ['./dialog-confirmation-box.component.scss']
})
export class DialogConfirmationBoxComponent  {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMessage) {
  }

  onClick(): void {
    this.dialogRef.close();
  }

}
