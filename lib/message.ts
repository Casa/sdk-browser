export enum CONNECT_ACTION {
  SET_TOKEN = 'set-token',
}

export const CONNECT_ACTIONS = Object.values(CONNECT_ACTION)

export type CasaMessage = {
  action: CONNECT_ACTION.SET_TOKEN
  apiToken: string
}

export function postMessage(message: CasaMessage) {
  const opener = window.opener as Window | null
  if (opener == null) {
    throw new Error('Unable to post a message without an opener')
  }
  opener.postMessage(message, '*')
}
