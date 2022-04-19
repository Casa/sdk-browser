let API_ORIGIN = 'https://api.keys.casa'
let WEB_APP_ORIGIN = 'https://app.keys.casa'

export default {
  get api(): string {
    return API_ORIGIN
  },
  set api(origin: string) {
    API_ORIGIN = origin
  },
  get webApp(): string {
    return WEB_APP_ORIGIN
  },
  set webApp(origin: string) {
    WEB_APP_ORIGIN = origin
  },
}
