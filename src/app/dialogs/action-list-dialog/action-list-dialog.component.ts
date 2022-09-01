import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListModuleData } from 'src/app/entities/dialog';

@Component({
  selector: 'app-action-list-dialog',
  templateUrl: './action-list-dialog.component.html',
  styleUrls: ['./action-list-dialog.component.scss']
})
export class ActionListDialogComponent{

  constructor(
    public dialogRef: MatDialogRef<ActionListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListModuleData) {}

}
