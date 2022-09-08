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
  @Input() heightNum?: string;
  @Input() widthNum?: string;
  @Input() thumbnail!: boolean;

  constructor() { 
  }

  ngOnInit(): void {}

  determineFileTitle(): string {
    let series = '';

    this.hydrusFile.service_names_to_statuses_to_display_tags['all known tags'][0].forEach(element => {
      if (element.includes('series')){
        series += element.substring(element.indexOf(':')+1) +', ';
      } 
    });
    return (series).trimEnd().slice(0, -1);
  }

}
