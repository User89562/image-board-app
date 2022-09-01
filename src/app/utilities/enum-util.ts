export enum MESSAGE_TYPE {
  waiting = "waiting",
  finished = "done",
  failed = "warning",
  error = "error",
  redirect = "redirect",
  addAnother = "add another",
  cancel = "cancel",
}



export class EnumUtil {
  constructor() {}

  public static get messageType(): typeof MESSAGE_TYPE {
    return MESSAGE_TYPE;
  }
}
