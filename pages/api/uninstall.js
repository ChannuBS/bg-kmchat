import { getBCVerify } from '../../lib/auth'

export default async function uninstall(req, res) {
  try {
    await getBCVerify(req.query)

    res.status(200).end()
  } catch (error) {
    const { message, response } = error
    res.status(response?.status || 500).json({ message })
  }
}
