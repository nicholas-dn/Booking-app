import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@trimbook.com', password: 'admin123', role: 'admin', avatar: 'A' },
  { id: 2, name: 'James Okafor', email: 'james@trimbook.com', password: 'staff123', role: 'staff', specialty: 'Barber', avatar: 'J', rating: 4.8, bookings: 142 },
  { id: 3, name: 'Amaka Nwosu', email: 'amaka@trimbook.com', password: 'staff123', role: 'staff', specialty: 'Hairdresser', avatar: 'A', rating: 4.9, bookings: 198 },
  { id: 4, name: 'Chidi Eze', email: 'chidi@trimbook.com', password: 'staff123', role: 'staff', specialty: 'Barber', avatar: 'C', rating: 4.7, bookings: 89 },
  { id: 5, name: 'Customer One', email: 'user@trimbook.com', password: 'user123', role: 'customer', avatar: 'C' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  function login(email, password) {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      return { success: true, role: found.role }
    }
    return { success: false, message: 'Invalid email or password' }
  }

  function register(name, email, password, role) {
    const exists = MOCK_USERS.find(u => u.email === email)
    if (exists) return { success: false, message: 'Email already registered' }
    const newUser = {
      id: MOCK_USERS.length + 1,
      name, email, password, role,
      avatar: name[0].toUpperCase()
    }
    MOCK_USERS.push(newUser)
    setUser(newUser)
    return { success: true, role }
  }

  function logout() { setUser(null) }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, allUsers: MOCK_USERS }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
