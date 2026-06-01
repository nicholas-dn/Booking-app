import { createContext, useContext, useState } from 'react'

const BookingContext = createContext(null)

const INITIAL_SERVICES = [
  { id: 1, name: 'Haircut', duration: 30, price: 25, category: 'barber' },
  { id: 2, name: 'Beard Trim', duration: 20, price: 15, category: 'barber' },
  { id: 3, name: 'Shave', duration: 25, price: 20, category: 'barber' },
  { id: 4, name: 'Hair + Beard Combo', duration: 50, price: 35, category: 'barber' },
  { id: 5, name: 'Hair Wash & Style', duration: 60, price: 30, category: 'hairdresser' },
  { id: 6, name: 'Braiding', duration: 120, price: 80, category: 'hairdresser' },
  { id: 7, name: 'Relaxer', duration: 90, price: 60, category: 'hairdresser' },
  { id: 8, name: 'Weave Installation', duration: 150, price: 150, category: 'hairdresser' },
  { id: 9, name: 'Dreadlocks Styling', duration: 90, price: 70, category: 'both' },
  { id: 10, name: 'Kids Haircut', duration: 20, price: 18, category: 'barber' },
]

const INITIAL_TIME_SLOTS = [
  '8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
  '5:00 PM','5:30 PM','6:00 PM',
]

const STAFF_LIST = [
  { id: 2, name: 'James Okafor', specialty: 'Barber', avatar: 'J', rating: 4.8, reviews: 89, bio: 'Expert barber with 8 years experience. Specializes in fades and designs.', services: [1,2,3,4,10], available: true },
  { id: 3, name: 'Amaka Nwosu', specialty: 'Hairdresser', avatar: 'A', rating: 4.9, reviews: 134, bio: 'Master hairdresser. Specializes in natural hair, braiding and styling.', services: [5,6,7,8,9], available: true },
  { id: 4, name: 'Chidi Eze', specialty: 'Barber', avatar: 'C', rating: 4.7, reviews: 56, bio: 'Creative barber known for precision cuts and clean shaves.', services: [1,2,3,4,9,10], available: true },
]

// Days each staff member works (true = working, false = off)
const INITIAL_AVAILABILITY = {
  2: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false },
  3: { Mon: true, Tue: true, Wed: false, Thu: true, Fri: true, Sat: true, Sun: false },
  4: { Mon: false, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false },
}

const DAY_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const INITIAL_BOOKINGS = [
  { id: 1, customerId: 5, customerName: 'Customer One', staffId: 2, staffName: 'James Okafor', service: 'Haircut', price: 25, date: '2026-05-28', time: '10:00 AM', status: 'confirmed', createdAt: '2026-05-25' },
  { id: 2, customerId: 5, customerName: 'Customer One', staffId: 3, staffName: 'Amaka Nwosu', service: 'Braiding', price: 80, date: '2026-06-02', time: '2:00 PM', status: 'pending', createdAt: '2026-05-26' },
  { id: 3, customerId: 5, customerName: 'Customer One', staffId: 2, staffName: 'James Okafor', service: 'Beard Trim', price: 15, date: '2026-05-10', time: '11:00 AM', status: 'completed', createdAt: '2026-05-08', rated: true },
  { id: 4, customerId: 5, customerName: 'Customer One', staffId: 4, staffName: 'Chidi Eze', service: 'Hair + Beard Combo', price: 35, date: '2026-04-20', time: '3:00 PM', status: 'completed', createdAt: '2026-04-18', rated: false },
  { id: 5, customerId: 99, customerName: 'Tunde Bello', staffId: 2, staffName: 'James Okafor', service: 'Haircut', price: 25, date: '2026-05-27', time: '9:00 AM', status: 'confirmed', createdAt: '2026-05-24' },
  { id: 6, customerId: 98, customerName: 'Ngozi Adeyemi', staffId: 3, staffName: 'Amaka Nwosu', service: 'Relaxer', price: 60, date: '2026-05-27', time: '11:00 AM', status: 'confirmed', createdAt: '2026-05-23' },
  { id: 7, customerId: 97, customerName: 'Emeka Obi', staffId: 4, staffName: 'Chidi Eze', service: 'Shave', price: 20, date: '2026-05-26', time: '1:00 PM', status: 'cancelled', createdAt: '2026-05-22' },
]

const INITIAL_RATINGS = [
  { id: 1, bookingId: 3, staffId: 2, customerId: 5, customerName: 'Customer One', rating: 5, comment: 'Brilliant fade, exactly what I asked for. James is the best!', date: '2026-05-11', approved: true, showOnLanding: true },
  { id: 2, bookingId: 99, staffId: 3, customerId: 99, customerName: 'Tunde B.', rating: 5, comment: 'Amaka did an amazing job on my braids. Very professional and quick.', date: '2026-05-20', approved: true, showOnLanding: true },
  { id: 3, bookingId: 100, staffId: 4, customerId: 98, customerName: 'Ngozi A.', rating: 4, comment: 'Great experience overall. Chidi was friendly and skilled.', date: '2026-05-15', approved: true, showOnLanding: false },
]

// Suspended users/staff IDs
const INITIAL_SUSPENDED = []

export function BookingProvider({ children }) {
  const [services, setServices] = useState(INITIAL_SERVICES)
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS)
  const [staffAvailability, setStaffAvailability] = useState(INITIAL_AVAILABILITY)
  const [ratings, setRatings] = useState(INITIAL_RATINGS)
  const [timeSlots, setTimeSlots] = useState(INITIAL_TIME_SLOTS)
  const [suspendedIds, setSuspendedIds] = useState(INITIAL_SUSPENDED)

  function createBooking(data) {
    const newBooking = { id: bookings.length + Date.now(), ...data, status: 'pending', createdAt: new Date().toISOString().split('T')[0], rated: false }
    setBookings(prev => [...prev, newBooking])
    return newBooking
  }

  function updateBookingStatus(id, status) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  function getBookingsByCustomer(customerId) {
    return bookings.filter(b => b.customerId === customerId)
  }

  function getBookingsByStaff(staffId) {
    return bookings.filter(b => b.staffId === staffId)
  }

  function isStaffAvailableOnDate(staffId, dateStr) {
    const date = new Date(dateStr + 'T12:00:00')
    const dayName = DAY_MAP[date.getDay()]
    const avail = staffAvailability[staffId]
    if (!avail) return true
    return avail[dayName] !== false
  }

  function getUnavailableDayName(staffId, dateStr) {
    const date = new Date(dateStr + 'T12:00:00')
    return DAY_MAP[date.getDay()]
  }

  function updateStaffAvailability(staffId, days) {
    setStaffAvailability(prev => ({ ...prev, [staffId]: days }))
  }

  function addRating(data) {
    const newRating = { id: Date.now(), ...data, date: new Date().toISOString().split('T')[0], approved: false, showOnLanding: false }
    setRatings(prev => [...prev, newRating])
    setBookings(prev => prev.map(b => b.id === data.bookingId ? { ...b, rated: true } : b))
  }

  function approveRating(id) {
    setRatings(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r))
  }

  function toggleShowOnLanding(id) {
    setRatings(prev => prev.map(r => r.id === id ? { ...r, showOnLanding: !r.showOnLanding } : r))
  }

  function removeRating(id) {
    setRatings(prev => prev.filter(r => r.id !== id))
  }

  function getRatingsByStaff(staffId) {
    return ratings.filter(r => r.staffId === staffId && r.approved)
  }

  function getLandingTestimonials() {
    return ratings.filter(r => r.approved && r.showOnLanding)
  }

  function updateService(id, updates) {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  function updateTimeSlots(newSlots) {
    setTimeSlots(newSlots)
  }

  function toggleSuspend(id) {
    setSuspendedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function isSuspended(id) {
    return suspendedIds.includes(id)
  }

  return (
    <BookingContext.Provider value={{
      bookings, services, staffList: STAFF_LIST, timeSlots,
      staffAvailability, ratings, suspendedIds,
      createBooking, updateBookingStatus, getBookingsByCustomer, getBookingsByStaff,
      isStaffAvailableOnDate, getUnavailableDayName, updateStaffAvailability,
      addRating, approveRating, toggleShowOnLanding, removeRating, getRatingsByStaff, getLandingTestimonials,
      updateService, updateTimeSlots,
      toggleSuspend, isSuspended,
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() { return useContext(BookingContext) }
