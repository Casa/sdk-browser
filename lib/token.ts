let API_TOKEN: string | null = null

export default {
  getOptionalToken(): string | null {
    return API_TOKEN
  },
  get(): string {
    if (API_TOKEN == null) {
      throw new Error('No API token has been set')
    }
    return API_TOKEN
  },
  set(token: string): void {
    API_TOKEN = token
  },
}
