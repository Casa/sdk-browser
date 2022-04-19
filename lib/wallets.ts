import origin from './origin'
import token from './token'

export async function getWallets() {
  return await fetch(`${origin.api}/api/walletAccounts`, {
    headers: {
      'X-Api-Key': token.get(),
    },
  }).then(response => response.json())
}
