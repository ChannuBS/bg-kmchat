import { getBCVerify, bcRequest, setSession } from '../../lib/auth'

export default async function load(req, res) {
  try {
    const session = await getBCVerify(req.query)
    await setSession(session)
    await bcRequest(session)
    res.redirect(302, '/')
  } catch (error) {
    const { message, response } = error
    res.status(response?.status || 500).json({ message })
  }
}
