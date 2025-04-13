import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

const ChatComponent = ({ messages = [], onNewMessage = () => {} }) => {
  const [messageInput, setMessageInput] = useState('')
  const messagesEndRef = useRef(null)

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onNewMessage(messageInput)
      setMessageInput('')
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat-container">
      <h2>Satellite Chat</h2>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={`msg-${index}`} className="message">
            <div className="message-sender">User {index + 1}</div>
            <div className="message-content">{msg}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  )
}

ChatComponent.propTypes = {
  messages: PropTypes.array,
  onNewMessage: PropTypes.func
}

ChatComponent.defaultProps = {
  messages: [],
  onNewMessage: () => {}
}

export default ChatComponent