export enum MESSAGE_TYPE {
  waiting = "waiting",
  finished = "done",
  failed = "warning",
  error = "error",
  redirect = "redirect",
  addAnother = "add another",
  cancel = "cancel",
}

export enum SWIPE_DIRECTION{
  DIRECTION_NONE=0,
  DIRECTION_LEFT=2,
  DIRECTION_RIGHT=4,
  DIRECTION_UP=8,
  DIRECTION_DOWN=16
}

export class EnumUtil {
  constructor() {}

  public static get messageType(): typeof MESSAGE_TYPE {
    return MESSAGE_TYPE;
  }

  public static get swipeDirection(): typeof SWIPE_DIRECTION {
    return SWIPE_DIRECTION;
  }
}
