const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="userMessage">
      {message}
    </div>
  )
}

export default Notification