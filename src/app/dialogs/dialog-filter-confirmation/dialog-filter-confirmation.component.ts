import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogMessage } from 'src/app/entities/dialog';

@Component({
  selector: 'app-dialog-filter-confirmation',
  templateUrl: './dialog-filter-confirmation.component.html',
  styleUrls: ['./dialog-filter-confirmation.component.scss']
})
export class DialogFilterConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogFilterConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMessage) {
  }

  onClick(): void {
    this.dialogRef.close();
  }


}
