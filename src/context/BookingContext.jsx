import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/my`
      );
      setBookings(res.data.bookings);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  const createBooking = async (bookingData) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/bookings`,
      bookingData
    );
    setBookings((prev) => [res.data.booking, ...prev]);
    return res.data.booking;
  };

  const cancelBooking = async (bookingId) => {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/cancel`
    );
    setBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId ? { ...b, status: "cancelled" } : b
      )
    );
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        historyOpen,
        loadingBookings,
        setHistoryOpen,
        fetchBookings,
        createBooking,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
