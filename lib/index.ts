import origin from './origin'
import token from './token'

export function setApiToken(apiToken: string) {
  token.set(apiToken)
}

export function resetApiToken() {
  token.reset()
}

export function setApiOrigin(apiOrigin: string) {
  origin.api = apiOrigin
}

export function setWebAppOrigin(webAppOrigin: string) {
  origin.webApp = webAppOrigin
}

export * from './connect'
export * from './message'
export * from './wallets'
