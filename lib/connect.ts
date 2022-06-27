import { CONNECT_ACTION, CONNECT_ACTIONS, CasaMessage } from './message'

const WEB_APP_ORIGIN = 'https://app.keys.casa'

export interface ConnectOptions {
  appName: string
  email?: string
  webAppOrigin?: string
}

export async function connect(
  options: ConnectOptions,
  parent: HTMLElement = document.body,
): Promise<string | null> {
  const { appName, webAppOrigin = WEB_APP_ORIGIN } = options

  if (appName == null || appName === '') {
    throw new Error('Cannot connect with Casa without a valid app name')
  }

  if (hasIframe(webAppOrigin)) {
    return null
  }

  let token: string | null = null

  const iframe = createIframe(webAppOrigin)
  parent.appendChild(iframe)

  return new Promise<string | null>(resolve => {
    window.addEventListener('message', onMessage)

    function onMessage(event: MessageEvent<unknown>) {
      if (event.origin !== webAppOrigin) {
        return
      }

      if (!isRecognizedMessage(event.data)) {
        console.warn('Received unrecognized message: %o', event)
        return
      }

      console.log('Received message: %o', event)

      if (event.data.action === CONNECT_ACTION.READY) {
        const connectOptions: ConnectOptions = {
          ...options,
          appName,
          webAppOrigin,
        }
        iframe.contentWindow?.postMessage(connectOptions, webAppOrigin)
        return
      }

      if (event.data.action === CONNECT_ACTION.SET_TOKEN) {
        token = event.data.apiToken
        return
      }

      if (event.data.action === CONNECT_ACTION.CLOSE) {
        window.removeEventListener('message', onMessage)
        resolve(token)
        iframe.remove()
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

function createIframe(webAppOrigin: string) {
  const iframe = document.createElement('iframe')

  iframe.setAttribute('src', `${webAppOrigin}/connect`)
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('width', '100%')
  iframe.setAttribute('height', '100%')

  iframe.setAttribute(
    'style',
    [
      'overflow: hidden',
      'width: 100%',
      'height: 100%',
      'position: absolute',
      'z-index: 1000',
      'top: 0',
      'left: 0',
      'right: 0',
      'bottom: 0',
    ].join(';'),
  )

  return iframe
}

function hasIframe(webAppOrigin: string) {
  return (
    document.querySelector(`iframe[src="${`${webAppOrigin}/connect`}"]`) != null
  )
}
