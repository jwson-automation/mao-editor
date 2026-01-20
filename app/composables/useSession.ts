export function useSession() {
  const SESSION_KEY = 'mao-session-id'

  // Generate session ID
  function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }

  // Get session ID (create if not exists)
  function getSessionId(): string {
    if (import.meta.server) return ''

    let sessionId = localStorage.getItem(SESSION_KEY)

    if (!sessionId) {
      sessionId = generateSessionId()
      localStorage.setItem(SESSION_KEY, sessionId)
    }

    return sessionId
  }

  // Reset session
  function resetSession(): string {
    if (import.meta.server) return ''

    const newSessionId = generateSessionId()
    localStorage.setItem(SESSION_KEY, newSessionId)
    return newSessionId
  }

  return {
    getSessionId,
    resetSession
  }
}
