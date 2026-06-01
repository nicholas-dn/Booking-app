import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@trimbook.com', password: 'admin123', role: 'admin', avatar: 'A', active: true },
  { id: 2, name: 'James Okafor', email: 'james@trimbook.com', password: 'staff123', role: 'staff', specialty: 'Barber', avatar: 'J', rating: 4.8, bookings: 142, active: true },
  { id: 3, name: 'Amaka Nwosu', email: 'amaka@trimbook.com', password: 'staff123', role: 'staff', specialty: 'Hairdresser', avatar: 'A', rating: 4.9, bookings: 198, active: true },
  { id: 4, name: 'Chidi Eze', email: 'chidi@trimbook.com', password: 'staff123', role: 'staff', specialty: 'Barber', avatar: 'C', rating: 4.7, bookings: 89, active: true },
  { id: 5, name: 'Customer One', email: 'user@trimbook.com', password: 'user123', role: 'customer', avatar: 'C', active: true },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(MOCK_USERS)
  const [showTutorial, setShowTutorial] = useState(false)

  function login(email, password) {
    const found = users.find(u => u.email === email && u.password === password)
    if (found) {
      if (!found.active) return { success: false, message: 'This account has been suspended. Please contact support.' }
      setUser(found)
      return { success: true, role: found.role }
    }
    return { success: false, message: 'Invalid email or password' }
  }

  function register(name, email, password, role) {
    const exists = users.find(u => u.email === email)
    if (exists) return { success: false, message: 'Email already registered' }
    const newUser = { id: Date.now(), name, email, password, role, avatar: name[0].toUpperCase(), active: true, isNew: true }
    setUsers(prev => [...prev, newUser])
    setUser(newUser)
    setShowTutorial(true)
    return { success: true, role }
  }

  function logout() {
    setUser(null)
    setShowTutorial(false)
  }

  function dismissTutorial() { setShowTutorial(false) }

  function toggleUserActive(id) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u))
  }

  function getUserById(id) { return users.find(u => u.id === id) }

  const allUsers = users

  return (
    <AuthContext.Provider value={{ user, login, register, logout, allUsers, showTutorial, dismissTutorial, toggleUserActive, getUserById }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
