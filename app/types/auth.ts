export interface User {
  id: string // username (used as document ID)
  password: string // 4+ digit password (hashed)
  createdAt: Date
}

export interface LoginCredentials {
  username: string
  password: string // 4+ digit plain password
}

export interface SignupCredentials {
  username: string
  password: string // 4+ digit plain password
}
