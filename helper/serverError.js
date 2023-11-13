const handleHanldeError = res => {
  return res.status(500).json({ message: 'Internal Server Error' })
}
export default handleHanldeError
