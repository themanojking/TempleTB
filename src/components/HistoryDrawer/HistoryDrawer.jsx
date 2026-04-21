import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useBooking } from "../../context/BookingContext.jsx";
import { FaTimes, FaDownload, FaWhatsapp, FaTicketAlt, FaCalendar, FaUsers, FaQrcode, FaReceipt } from "react-icons/fa";
import { generateTicketPDF, generatePaymentReceipt, generateUPIQRReceipt, sendWhatsAppTicket } from "../../utils/pdfGenerator.js";

const HistoryDrawer = () => {
  const { t } = useTranslation();
  const { historyOpen, setHistoryOpen, bookings, loadingBookings } = useBooking();

  useEffect(() => {
    document.body.style.overflow = historyOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [historyOpen]);

  if (!historyOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setHistoryOpen(false)} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-stone-950 z-50 shadow-2xl shadow-amber-900/20 border-l border-amber-900/30 overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-stone-950/95 backdrop-blur border-b border-amber-900/30 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-cinzel text-amber-400 text-xl font-bold tracking-wider">{t("history.title")}</h2>
            <p className="font-lato text-stone-400 text-sm mt-0.5">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setHistoryOpen(false)} className="p-2 text-stone-400 hover:text-amber-400 hover:bg-amber-900/20 rounded-full transition-all">
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {loadingBookings ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              <p className="font-lato text-stone-400 text-sm">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <FaTicketAlt className="text-5xl text-amber-900/30" />
              <p className="font-cinzel text-stone-400 text-lg">{t("history.no_bookings")}</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="bg-stone-900 border border-amber-900/25 rounded-2xl p-4 hover:border-amber-700/45 transition-all duration-200">
                {/* Temple + status */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-cinzel text-stone-100 font-semibold text-base leading-tight">{booking.templeName}</h3>
                    <p className="font-lato text-stone-400 text-xs mt-0.5">#{booking._id?.toString().slice(-8).toUpperCase()}</p>
                  </div>
                  <span className={`text-xs font-lato font-semibold px-2.5 py-1 rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-900/40 text-green-400 border border-green-800/40"
                      : "bg-red-900/40 text-red-400 border border-red-800/40"
                  }`}>
                    {booking.status === "confirmed" ? t("history.confirmed") : t("history.cancelled")}
                  </span>
                </div>

                {/* Details row */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-2 text-stone-400">
                    <FaCalendar className="text-amber-600 text-xs flex-shrink-0" />
                    <span className="font-lato text-xs">{new Date(booking.visitDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-400">
                    <FaUsers className="text-amber-600 text-xs flex-shrink-0" />
                    <span className="font-lato text-xs">{booking.visitors} visitors</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-stone-400">
                    <FaTicketAlt className="text-amber-600 text-xs flex-shrink-0" />
                    <span className="font-lato text-xs">{booking.slot}</span>
                  </div>
                  {booking.paymentMethod && (
                    <div className="col-span-2 flex items-center gap-2 text-stone-400">
                      <FaReceipt className="text-amber-600 text-xs flex-shrink-0" />
                      <span className="font-lato text-xs">{booking.paymentMethod}</span>
                    </div>
                  )}
                </div>

                {/* Amount + action buttons */}
                <div className="pt-3 border-t border-amber-900/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cinzel text-amber-400 text-lg font-bold">₹{booking.totalAmount}</span>
                    <span className="font-lato text-stone-500 text-xs">Rs. {Math.round(booking.totalAmount / (booking.visitors || 1))} × {booking.visitors}</span>
                  </div>

                  {booking.status === "confirmed" && (
                    <div className="grid grid-cols-2 gap-2">
                      {/* Row 1 */}
                      <button
                        onClick={() => generateTicketPDF(booking)}
                        className="flex items-center justify-center gap-1.5 bg-amber-600/15 hover:bg-amber-600/30 text-amber-400 border border-amber-700/35 text-xs font-lato px-2 py-2 rounded-lg transition-all"
                      >
                        <FaDownload className="text-xs" /> Darshan Ticket
                      </button>
                      <button
                        onClick={() => generatePaymentReceipt(booking)}
                        className="flex items-center justify-center gap-1.5 bg-blue-900/15 hover:bg-blue-800/30 text-blue-400 border border-blue-800/35 text-xs font-lato px-2 py-2 rounded-lg transition-all"
                      >
                        <FaReceipt className="text-xs" /> Payment Receipt
                      </button>
                      {/* Row 2 */}
                      <button
                        onClick={() => generateUPIQRReceipt(booking)}
                        className="flex items-center justify-center gap-1.5 bg-purple-900/15 hover:bg-purple-800/30 text-purple-400 border border-purple-800/35 text-xs font-lato px-2 py-2 rounded-lg transition-all"
                      >
                        <FaQrcode className="text-xs" /> UPI QR
                      </button>
                      <button
                        onClick={() => sendWhatsAppTicket(booking)}
                        className="flex items-center justify-center gap-1.5 bg-green-900/15 hover:bg-green-800/30 text-green-400 border border-green-800/35 text-xs font-lato px-2 py-2 rounded-lg transition-all"
                      >
                        <FaWhatsapp className="text-xs" /> WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryDrawer;
