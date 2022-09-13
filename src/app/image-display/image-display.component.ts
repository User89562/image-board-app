import { HydrusFile } from './../entities/hydrus-file';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { E } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.scss']
})
//TODO: border color for delete - icons for inbox, archive and trash
export class ImageDisplayComponent implements OnInit {
  @Input() hydrusFile!: HydrusFile;
  @Input() heightNum: number;
  @Input() widthNum: number;
  @Input() thumbnail!: boolean;
  fileType: string;

  constructor() { 
    this.fileType = '';
    this.heightNum = 0;
    this.widthNum = 0;
  }

  ngOnInit(): void {
    if (this.hydrusFile.mime.includes('video')){
      this.fileType = 'video';
    } else if (this.hydrusFile.mime.includes('gif')){
      this.fileType = 'gif';
    } else if (this.hydrusFile.mime.includes('image')){
      this.fileType = 'image';
    }
  }

  determineFileTitle(): string {
    let series = '';

    this.hydrusFile.service_names_to_statuses_to_display_tags['all known tags'][0].forEach(element => {
      if (element.includes('series')){
        series += element.substring(element.indexOf(':')+1) +', ';
      } 
    });
    return (series).trimEnd().slice(0, -1);
  }  

  isPlayable(file: HydrusFile): boolean {
    if (file.mime.includes('video') || file.mime.includes('gif')){
      return true;
    }
    return false;
  }

}
