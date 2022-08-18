import { CONNECT_ACTION, CONNECT_ACTIONS, CasaMessage } from './message'

const WEB_APP_ORIGIN = 'https://app.keys.casa'

let popupWindow: Window | null = null

export interface ConnectOptions {
  appId: string
  email?: string
  webAppOrigin?: string
}

export async function connect(options: ConnectOptions): Promise<string | null> {
  const { appId, webAppOrigin = WEB_APP_ORIGIN } = options

  if (appId == null || appId === '') {
    throw new Error('Cannot connect with Casa without a valid app name')
  }

  if (popupWindow != null) {
    console.warn('Already started to connect with Casa')
    return null
  }

  popupWindow = openPopupWindow({
    ...options,
    appId,
    webAppOrigin,
  })

  let token: string | null = null

  return new Promise<string | null>(resolve => {
    const wait = 1000
    const intervalId = setInterval(() => {
      // popupWindow?.postMessage('check this out', '*')
      if (popupWindow == null || popupWindow.closed === true) {
        clearInterval(intervalId)
        onClose()
      }
    }, wait)

    window.addEventListener('beforeunload', onClose)
    window.addEventListener('message', onMessage)

    function onClose() {
      window.removeEventListener('beforeunload', onClose)
      window.removeEventListener('message', onMessage)

      if (popupWindow == null) {
        return
      }

      resolve(token)
      popupWindow.close()
      popupWindow = null
    }

    function onMessage(event: MessageEvent<unknown>) {
      if (event.origin !== webAppOrigin) {
        return
      }

      if (popupWindow == null) {
        onClose()
        return
      }

      if (!isRecognizedMessage(event.data)) {
        console.warn('Received unrecognized message: %o', event)
        return
      }

      console.log('Received message: %o', event)

      if (event.data.action === CONNECT_ACTION.SET_TOKEN) {
        token = event.data.apiToken
        return
      }
    }
  })
}

function isRecognizedMessage(data: unknown): data is CasaMessage {
  if (typeof data !== 'object' || Array.isArray(data) || data == null) {
    return false
  }

  return CONNECT_ACTIONS.includes((data as CasaMessage).action)
}

function openPopupWindow({
  webAppOrigin,
  ...options
}: ConnectOptions & {
  webAppOrigin: string
}) {
  const searchParams = getPopupSearchParams(options)
  const windowFeatures = getPopupWindowFeatures()

  const popupWindow = window.open(
    `${webAppOrigin}/connect?${searchParams}`,
    '',
    windowFeatures,
  )

  if (popupWindow?.focus) {
    popupWindow.focus()
  }

  return popupWindow
}

function getPopupSearchParams(options: Omit<ConnectOptions, 'webAppOrigin'>) {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(options)) {
    if (value != null) {
      searchParams.append(key, String(value))
    }
  }

  return searchParams.toString()
}

function getPopupWindowFeatures() {
  const width = 1280
  const height = 880

  // Fixes dual-screen position
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY

  const screenWidth =
    window.innerWidth ?? document.documentElement.clientWidth ?? screen.width
  const screenHeight =
    window.innerHeight ?? document.documentElement.clientHeight ?? screen.height

  const half = 0.5
  const left = half * (screenWidth - width) + dualScreenLeft
  const top = half * (screenHeight - height) + dualScreenTop

  return [
    'popup=yes',
    'menubar=no',
    'status=no',
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
  ].join(',')
}
