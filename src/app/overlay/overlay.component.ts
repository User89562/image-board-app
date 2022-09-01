import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InjectorService } from '../services/injector.service';
import { EnumUtil } from '../utilities/enum-util';

enum PROCESSING_STATES {
  processing,
  error,
  complete
}


@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  subscriptions: Subscription[] = [];
  items!: Map<string, string>;
  enumUtil = EnumUtil;
  displayAdd: boolean = false;
  errorFound: boolean = false;

  constructor(private injectorService: InjectorService, private router: Router) {
    if (this.router.url.search('add') != -1) {
      this.displayAdd = true;
    }
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(this.injectorService.proccessingFound$.subscribe( r => {
      this.items = r;
    }));
  }

  get processingStates(): typeof PROCESSING_STATES {
    return PROCESSING_STATES;
  }

  // figure out something for different states -> error, complete and processing
  isComplete(): PROCESSING_STATES {
    let numKeys = 0;
    let counter = 0;
    if (this.items) {
      for (const key of this.items.keys()) {
        numKeys++;
        if (key === this.enumUtil.messageType.error) {
          this.errorFound = true;
          return this.processingStates.error;
        } else if (this.items.get(key) === this.enumUtil.messageType.finished) {
          counter ++;
        }
      }
    }
    if (numKeys === counter && numKeys != 0) {
      return this.processingStates.complete;
    }
    return this.processingStates.processing;

  }


  closeOverlay(msg: string): void {
    this.injectorService.closeOverlay(msg);
  }


}
