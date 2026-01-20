import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { User, LoginCredentials, SignupCredentials } from '~/types/auth'

export function useAuth() {
  const USER_STORAGE_KEY = 'mao-user-id'
  const currentUser = useState<string | null>('currentUser', () => null)

  // Simple hash function for 4-digit password
  function hashPassword(password: string): string {
    // Simple hash (in production, use proper hashing)
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(36)
  }

  // Check if user is logged in
  function isLoggedIn(): boolean {
    if (import.meta.server) return false

    if (!currentUser.value) {
      currentUser.value = localStorage.getItem(USER_STORAGE_KEY)
    }
    return !!currentUser.value
  }

  // Get current username
  function getCurrentUser(): string | null {
    if (import.meta.server) return null

    if (!currentUser.value) {
      currentUser.value = localStorage.getItem(USER_STORAGE_KEY)
    }
    return currentUser.value
  }

  // Signup
  async function signup(credentials: SignupCredentials): Promise<{ success: boolean, error?: string }> {
    try {
      const { username, password } = credentials

      // Validate username (alphanumeric, 1-20 chars)
      if (!/^[a-zA-Z0-9]{1,20}$/.test(username)) {
        return { success: false, error: 'Username must be 1-20 alphanumeric characters' }
      }

      // Validate password (4+ digits)
      if (!/^\d{4,}$/.test(password)) {
        return { success: false, error: 'Password must be at least 4 digits' }
      }

      const { $db } = useNuxtApp()
      const userRef = doc($db, 'users', username)

      // Check if user already exists
      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        return { success: false, error: 'Username already exists' }
      }

      // Create user
      const newUser: User = {
        id: username,
        password: hashPassword(password),
        createdAt: new Date()
      }

      await setDoc(userRef, newUser)

      // Login user
      currentUser.value = username
      localStorage.setItem(USER_STORAGE_KEY, username)

      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'Signup failed' }
    }
  }

  // Login
  async function login(credentials: LoginCredentials): Promise<{ success: boolean, error?: string }> {
    try {
      const { username, password } = credentials

      // Validate password format (at least 4 digits)
      if (!/^\d{4,}$/.test(password)) {
        return { success: false, error: 'Invalid password format' }
      }

      const { $db } = useNuxtApp()
      const userRef = doc($db, 'users', username)

      // Get user
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) {
        return { success: false, error: 'User not found' }
      }

      const user = userDoc.data() as User

      // Check password
      if (user.password !== hashPassword(password)) {
        return { success: false, error: 'Invalid password' }
      }

      // Login user
      currentUser.value = username
      localStorage.setItem(USER_STORAGE_KEY, username)

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  // Logout
  function logout() {
    if (import.meta.server) return

    currentUser.value = null
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  return {
    currentUser,
    isLoggedIn,
    getCurrentUser,
    signup,
    login,
    logout
  }
}
