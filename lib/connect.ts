import { CONNECT_ACTION, CONNECT_ACTIONS, CasaMessage } from './message'
import origin from './origin'
import token from './token'

export interface ConnectOptions {
  email?: string
}

export async function connect(
  developerAppId: string,
  options: ConnectOptions = {},
): Promise<string | null> {
  if (developerAppId == null || developerAppId === '') {
    throw new Error('Cannot connect with Casa without a valid developer app ID')
  }

  if (hasIframe()) {
    return null
  }

  const iframe = createIframe()
  document.body.appendChild(iframe)

  return new Promise<string | null>(resolve => {
    window.addEventListener('message', onMessage)

    function onMessage(event: MessageEvent<unknown>) {
      if (event.origin !== origin.webApp) {
        return
      }

      if (!isRecognizedMessage(event.data)) {
        console.warn('Received unrecognized message: %o', event)
        return
      }

      console.log('Received message: %o', event)

      if (event.data.action === CONNECT_ACTION.READY) {
        iframe.contentWindow?.postMessage(
          {
            developerAppId,
            options,
          },
          '*',
        )
        return
      }

      if (event.data.action === CONNECT_ACTION.SUCCESS) {
        token.set(event.data.apiToken)
        resolve(event.data.apiToken)
      } else if (event.data.action === CONNECT_ACTION.CANCEL) {
        resolve(null)
      }

      window.removeEventListener('message', onMessage)
      iframe.remove()
    }
  })
}

function isRecognizedMessage(data: unknown): data is CasaMessage {
  if (typeof data !== 'object' || Array.isArray(data) || data == null) {
    return false
  }

  return CONNECT_ACTIONS.includes((data as CasaMessage).action)
}

function createIframe() {
  const iframe = document.createElement('iframe')

  iframe.setAttribute('src', `${origin.webApp}/connect`)
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('width', '100%')
  iframe.setAttribute('height', '100%')

  iframe.setAttribute(
    'style',
    [
      'overflow: hidden',
      'width: 100%',
      'height: 100%',
      'background: rgba(190, 188, 202, 0.85)',
      'background: linear-gradient(180deg, rgba(235, 234, 234, 0.85) 0%, rgba(190, 188, 202, 0.85) 100%);',
      '-webkit-backdrop-filter: blur(28px)',
      'backdrop-filter: blur(28px)',
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

function hasIframe() {
  return (
    document.querySelector(`iframe[src="${`${origin.webApp}/connect`}"]`) !=
    null
  )
}
