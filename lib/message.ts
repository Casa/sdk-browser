export enum CONNECT_ACTION {
  READY = 'ready',
  CANCEL = 'cancel',
  SUCCESS = 'success',
}

export const CONNECT_ACTIONS = Object.values(CONNECT_ACTION)

export type CasaMessage =
  | {
      action: CONNECT_ACTION.READY
    }
  | {
      action: CONNECT_ACTION.CANCEL
    }
  | {
      action: CONNECT_ACTION.SUCCESS
      apiToken: string
    }
