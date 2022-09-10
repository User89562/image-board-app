import { DialogMobileVideoPlayerComponent } from './../dialogs/dialog-mobile-video-player/dialog-mobile-video-player.component';
import { HydrusFile } from 'src/app/entities/hydrus-file';
import { DialogFilterConfirmationComponent } from './../dialogs/dialog-filter-confirmation/dialog-filter-confirmation.component';

import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActionListDialogComponent } from "../dialogs/action-list-dialog/action-list-dialog.component";
import { DialogMessageBoxComponent } from "../dialogs/dialog-message-box/dialog-message-box.component";
import { ListData, ListModuleData} from "../entities/dialog";

import { DialogConfirmationBoxComponent } from '../dialogs/dialog-confirmation-box/dialog-confirmation-box.component';

export class DialogMessageUtils {
  constructor(private dialog: MatDialog) {}

  displayError(dialogMessage: string, dialogTitle: string) {
    let dialogMessageArray = [];

    if (typeof dialogMessage === "string") {
      dialogMessageArray = [dialogMessage];
    } else {
      dialogMessageArray = dialogMessage;
    }

    this.dialog.open(DialogMessageBoxComponent, {
      data: {
        messageArray: dialogMessageArray,
        title: dialogTitle,
        color: "#E57373",
      },
    });
  }

  displayMessage(dialogMessage: string, dialogTitle: string, color?: string): MatDialogRef<any> {
    let dialogMessageArray = [];

    if (typeof(dialogMessage) === 'string') {
      dialogMessageArray = [dialogMessage];
    } else {
      dialogMessageArray = dialogMessage;
    }

    if (color) {
      return this.dialog.open(DialogMessageBoxComponent, {
        data: {messageArray: dialogMessageArray, title: dialogTitle, color: color},
        restoreFocus: false
      });
    }

    return this.dialog.open(DialogMessageBoxComponent, {
      data: {messageArray: dialogMessageArray, title: dialogTitle},
      restoreFocus: false
    });
  }


  displayConfirmation(dialogMessage: string, dialogTitle: string): MatDialogRef<any> {
    let dialogMessageArray = [];

    if (typeof(dialogMessage) === 'string') {
      dialogMessageArray = [dialogMessage];
    } else {
      dialogMessageArray = dialogMessage;
    }

    return this.dialog.open(DialogConfirmationBoxComponent, {
      data: {messageArray: dialogMessageArray, title: dialogTitle}
    });

  }

  displayFilterConfirmation(dialogMessage: string, dialogTitle: string): MatDialogRef<any> {
    let dialogMessageArray = [];

    if (typeof(dialogMessage) === 'string') {
      dialogMessageArray = [dialogMessage];
    } else {
      dialogMessageArray = dialogMessage;
    }

    return this.dialog.open(DialogFilterConfirmationComponent, {
      data: {messageArray: dialogMessageArray, title: dialogTitle}
    });

  }

  displayList(list: ListModuleData) {
    return this.dialog.open(ActionListDialogComponent, {
      data: list,
      autoFocus: false,
    });
  }


  displayVideoPlayer(file: HydrusFile) {
    return this.dialog.open(DialogMobileVideoPlayerComponent, {
      data: file,
      autoFocus: false,
    });
  }
  /*
  mapToJson(mapper: Map<string, any>) {
    const json = {};
    mapper.forEach((value, key) => {
      json[key] = value;
    });
    return [JSON.stringify(json)];
  }*/

  mapToArray(map: Map<any, any>): any[] {
    const msg = [];

    for (const entry of map.entries()) {
      if (entry[0] === "regex") {
        msg.push(entry[0] + " : " + JSON.stringify(entry[1]));
      } else {
        msg.push(entry[0] + " : " + entry[1]);
      }
    }
    return msg;
  }
}
