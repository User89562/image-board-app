/* list selections module*/
export class ListModuleData {
    constructor(){}
    title!: string;
    listData!: ListData[];
}

export class ListData {
    constructor(
        public name: string,
        public listItem: string,
        public icon: string,
      ) {}
}

// dialog-message-box
export interface DialogMessage {
    messageArray: [];
    title: string;
    color?: string;
  }

