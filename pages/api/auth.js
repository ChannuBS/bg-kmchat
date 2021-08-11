import { getBCAuth, setSession } from '../../lib/auth'

export default async function auth(req, res) {
  try {
    let session = await getBCAuth(req.query)
    await setSession(session)
    res.redirect(302, '/')
  } catch (error) {
    const { message, response } = error
    res.status(response?.status || 500).json({ message })
  }
}
