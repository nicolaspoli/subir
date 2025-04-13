import { useState, useEffect, useCallback } from 'react'

const useWebSocket = (url, onMessageReceived) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    // Mock para desarrollo
    if (process.env.NODE_ENV === 'development') {
      const mockSocket = {
        readyState: 1,
        send: (msg) => {
          console.log('Mock WebSocket send:', msg)
          // Simular respuesta
          setTimeout(() => {
            onMessageReceived(`Mock response to: ${msg}`)
          }, 500)
        },
        close: () => console.log('Mock WebSocket closed')
      }
      setSocket(mockSocket)
      return () => mockSocket.close()
    }

    // Conexión real en producción
    const ws = new WebSocket(url)
    
    ws.onopen = () => {
      console.log('WebSocket connected')
      setSocket(ws)
    }
    
    ws.onmessage = (event) => {
      onMessageReceived(event.data)
    }
    
    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setSocket(null)
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [url, onMessageReceived])

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message)
    } else {
      console.error('WebSocket is not connected')
    }
  }, [socket])

  return { sendMessage }
}

export default useWebSocket