import * as Realm from 'realm-web'
const app = new Realm.App({ id: 'km-chat-realm-tbdui' })
const mongodb = app.currentUser.mongoClient('mongodb-atlas')
const db = mongodb.db('km-chat-bc-db')

export async function setUser({ user }) {
  if (!user) return null

  const { email, id, username } = user
  const ref = db.collection('users')
  const res = await ref.findOne({ email })

  if (res) {
    await ref.findOneAndUpdate({ email }, { ...user })
  } else {
    await ref.insertOne({ ...user })
  }
}

export async function setStore(session) {
  const {
    access_token: accessToken,
    context,
    user: { id },
  } = session
  // Only set on app install or update
  if (!accessToken) return null

  const storeHash = context?.split('/')[1] || ''
  const ref = db.collection('store')
  const data = { accessToken, adminId: id, storeHash }
  const res = await ref.findOne({ adminId: id })

  if (res) {
    await ref.findOneAndUpdate({ adminId: id }, { ...data })
  } else {
    await ref.insertOne({ ...data })
  }
  return data
}

export async function getStoreToken(storeHash) {
  if (!storeHash) return null
  const storeDoc = await db.collection('store').findOne({ storeHash })

  return storeDoc && storeDoc.accessToken ? storeDoc : null
}
