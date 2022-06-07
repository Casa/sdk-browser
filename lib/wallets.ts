import { getWallets as getWalletsNode } from '@casainc/node'

import origin from './origin'
import token from './token'

export async function getWallets() {
  return await getWalletsNode({
    token: token.get(),
    origin: origin.api,
  })
}
