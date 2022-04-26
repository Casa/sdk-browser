export enum CONNECT_ACTION {
  READY = 'ready',
  CLOSE = 'close',
  SET_TOKEN = 'set-token',
}

export const CONNECT_ACTIONS = Object.values(CONNECT_ACTION)

export type CasaMessage =
  | {
      action: CONNECT_ACTION.READY
    }
  | {
      action: CONNECT_ACTION.CLOSE
    }
  | {
      action: CONNECT_ACTION.SET_TOKEN
      apiToken: string
    }

export function postMessage(message: CasaMessage) {
  window.parent.postMessage(message, '*')
}
