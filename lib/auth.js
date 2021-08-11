import BigCommerce from 'node-bigcommerce'
import { setUser, setStore, getStoreToken } from './db'

const bigcommerce = new BigCommerce({
  logLevel: 'info',
  clientId: 'oe8lq8hg8t6mp5iguclj6y1to63le7x',
  secret: '3dc230f0e239bb8f404357c5b939780723a272faf6e683bef946088c4a9b2d32',
  callback: process.env.AUTH_CALLBACK,
  responseType: 'json',
  headers: { 'Accept-Encoding': '*' },
  apiVersion: 'v3',
})

const bigcommerceSigned = new BigCommerce({
  secret: '3dc230f0e239bb8f404357c5b939780723a272faf6e683bef946088c4a9b2d32',
  responseType: 'json',
})

export function getBCAuth(query) {
  return bigcommerce.authorize(query)
}

export function getBCVerify({ signed_payload }) {
  return bigcommerceSigned.verify(signed_payload)
}

export async function bcRequest(session) {
  let dd = {
    name: 'kmChat',
    description: 'Build responsive websites',
    html: '<script type="text/javascript">\n    (function(d, m){\n        var kommunicateSettings =     {"appId":"1d0333d5e02513886181e9f36a1501214","popupWidget":true,"automaticChatOpenOnNavigation":true};\n        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;\n        s.src = "https://widget-test.kommunicate.io/v2/kommunicate.app";\n        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);\n        window.kommunicate = m; m._globals = kommunicateSettings;\n    })(document, window.kommunicate || {});\n\n</script>',
    auto_uninstall: true,
    load_method: 'default',
    location: 'footer',
    visibility: 'all_pages',
    kind: 'script_tag',
    consent_category: 'functional',
  }
  const res = await getSession(session)
  if (res) {
    const bigcommerceScript = new BigCommerce({
      secret:
        '3dc230f0e239bb8f404357c5b939780723a272faf6e683bef946088c4a9b2d32',
      clientId: 'oe8lq8hg8t6mp5iguclj6y1to63le7x',
      headers: { 'Accept-Encoding': '*' },
      apiVersion: 'v3',
      accessToken: res.accessToken,
      storeHash: res.storeHash,
    })
    const allScripts = await bigcommerceScript.request(
      'get',
      '/content/scripts'
    )
    const isChatInstalled = allScripts.data.filter(
      (script) => script.name === 'kmChat'
    ).length

    !isChatInstalled &&
      (await bigcommerceScript.request('post', '/content/scripts', dd))
  } else {
    return null
  }
}

export function setSession(session) {
  setUser(session)
  setStore(session)
}

export async function getSession(session) {
  const storeHash = session.context?.split('/')[1] || ''
  const storeDetails = await getStoreToken(storeHash)
  return storeDetails
}
