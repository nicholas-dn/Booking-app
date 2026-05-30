import { createContext, useContext, useState } from 'react'

const BookingContext = createContext(null)

const SERVICES = [
  { id: 1, name: 'Haircut', duration: 30, price: 2500, category: 'barber' },
  { id: 2, name: 'Beard Trim', duration: 20, price: 1500, category: 'barber' },
  { id: 3, name: 'Shave', duration: 25, price: 2000, category: 'barber' },
  { id: 4, name: 'Hair + Beard Combo', duration: 50, price: 3500, category: 'barber' },
  { id: 5, name: 'Hair Wash & Style', duration: 60, price: 3000, category: 'hairdresser' },
  { id: 6, name: 'Braiding', duration: 120, price: 8000, category: 'hairdresser' },
  { id: 7, name: 'Relaxer', duration: 90, price: 6000, category: 'hairdresser' },
  { id: 8, name: 'Weave Installation', duration: 150, price: 15000, category: 'hairdresser' },
  { id: 9, name: 'Dreadlocks Styling', duration: 90, price: 7000, category: 'both' },
  { id: 10, name: 'Kids Haircut', duration: 20, price: 1800, category: 'barber' },
]

const TIME_SLOTS = [
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

const INITIAL_BOOKINGS = [
  { id: 1, customerId: 5, customerName: 'Customer One', staffId: 2, staffName: 'James Okafor', service: 'Haircut', price: 2500, date: '2026-05-28', time: '10:00 AM', status: 'confirmed', createdAt: '2026-05-25' },
  { id: 2, customerId: 5, customerName: 'Customer One', staffId: 3, staffName: 'Amaka Nwosu', service: 'Braiding', price: 8000, date: '2026-06-02', time: '2:00 PM', status: 'pending', createdAt: '2026-05-26' },
  { id: 3, customerId: 5, customerName: 'Customer One', staffId: 2, staffName: 'James Okafor', service: 'Beard Trim', price: 1500, date: '2026-05-10', time: '11:00 AM', status: 'completed', createdAt: '2026-05-08' },
  { id: 4, customerId: 5, customerName: 'Customer One', staffId: 4, staffName: 'Chidi Eze', service: 'Hair + Beard Combo', price: 3500, date: '2026-04-20', time: '3:00 PM', status: 'completed', createdAt: '2026-04-18' },
  { id: 5, customerId: 99, customerName: 'Tunde Bello', staffId: 2, staffName: 'James Okafor', service: 'Haircut', price: 2500, date: '2026-05-27', time: '9:00 AM', status: 'confirmed', createdAt: '2026-05-24' },
  { id: 6, customerId: 98, customerName: 'Ngozi Adeyemi', staffId: 3, staffName: 'Amaka Nwosu', service: 'Relaxer', price: 6000, date: '2026-05-27', time: '11:00 AM', status: 'confirmed', createdAt: '2026-05-23' },
  { id: 7, customerId: 97, customerName: 'Emeka Obi', staffId: 4, staffName: 'Chidi Eze', service: 'Shave', price: 2000, date: '2026-05-26', time: '1:00 PM', status: 'cancelled', createdAt: '2026-05-22' },
]

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS)

  function createBooking(data) {
    const newBooking = {
      id: bookings.length + 1,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    }
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

  return (
    <BookingContext.Provider value={{
      bookings, services: SERVICES, staffList: STAFF_LIST, timeSlots: TIME_SLOTS,
      createBooking, updateBookingStatus, getBookingsByCustomer, getBookingsByStaff,
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() { return useContext(BookingContext) }
