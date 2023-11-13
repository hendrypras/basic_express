const handleResponseSuccess = (res, status, message, data) => {
  return res.status(status).json({ message, data })
}
export default handleResponseSuccess
