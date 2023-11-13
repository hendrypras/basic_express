const handleClientError = (res, status, statusMessage, message) => {
  return res.status(status).json({ status: statusMessage, message })
}
export default handleClientError
