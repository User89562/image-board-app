import { HydrusFile } from './../entities/hydrus-file';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.scss']
})
//TODO: border color for delete - icons for inbox, archive and trash
export class ImageDisplayComponent implements OnInit {
  @Input() hydrusFile!: HydrusFile;

  constructor() { 
  }

  ngOnInit(): void {
  }

}
