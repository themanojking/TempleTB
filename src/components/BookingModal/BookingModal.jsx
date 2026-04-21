import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext.jsx";
import { useBooking } from "../../context/BookingContext.jsx";
import { generateTicketPDF, generatePaymentReceipt, generateUPIQRReceipt, sendWhatsAppTicket } from "../../utils/pdfGenerator.js";
import PaymentModal from "../PaymentModal/PaymentModal.jsx";
import { FaTimes, FaDownload, FaWhatsapp, FaCheckCircle, FaArrowRight, FaReceipt, FaQrcode } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BookingModal = ({ temple, slot, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { createBooking } = useBooking();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", date: "", visitors: 1 });
  const [errors, setErrors] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const total = slot.price * form.visitors;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.match(/^\+?[6-9]\d{9}$/)) e.phone = "Valid 10-digit number required";
    if (!form.date) e.date = "Date is required";
    if (form.date < today) e.date = "Date cannot be in the past";
    if (form.visitors < 1 || form.visitors > 10) e.visitors = "1 to 10 visitors allowed";
    return e;
  };

  const handleProceedToPayment = () => {
    if (!user) { navigate("/auth?mode=login"); return; }
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const booking = await createBooking({
        templeId: temple.id, templeName: temple.name, slot: slot.slot,
        slotTime: slot.time, visitDate: form.date, visitors: form.visitors,
        totalAmount: total, visitorName: form.name, email: form.email,
        phone: form.phone, status: "confirmed",
        paymentId: paymentData.paymentId, paymentMethod: paymentData.paymentMethod,
      });
      setShowPayment(false);
      setConfirmedBooking(booking);
    } catch (err) { console.error("Booking failed after payment:", err); }
  };

  const ic = (f) => `w-full bg-stone-800 border ${errors[f] ? "border-red-600/60" : "border-amber-900/30"} text-stone-100 font-lato text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder-stone-500`;

  // ── CONFIRMED SCREEN ──────────────────────────────────────────────────────
  if (confirmedBooking) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-amber-700/40 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-amber-900/30">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-600/50">
              <FaCheckCircle className="text-4xl text-green-400" />
            </div>
            <h2 className="font-cinzel text-amber-400 text-2xl font-bold">{t("booking.success")}</h2>
            <p className="font-lato text-stone-300 text-sm mt-1 font-semibold">{temple.name}</p>
            <p className="font-lato text-stone-400 text-sm">{confirmedBooking.slot} · {new Date(confirmedBooking.visitDate).toLocaleDateString("en-IN")}</p>
            <p className="font-lato text-stone-400 text-sm">{confirmedBooking.visitors} visitor{confirmedBooking.visitors > 1 ? "s" : ""}</p>
            <p className="font-cinzel text-amber-500 text-2xl font-bold mt-2">₹{confirmedBooking.totalAmount}</p>
          </div>

          {/* 4 download/send buttons */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <button
              onClick={() => generateTicketPDF(confirmedBooking)}
              className="flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-lato font-bold text-sm px-3 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-600/30"
            >
              <FaDownload className="text-sm" /> Darshan Ticket
            </button>
            <button
              onClick={() => generatePaymentReceipt(confirmedBooking)}
              className="flex items-center justify-center gap-1.5 bg-blue-700 hover:bg-blue-600 text-white font-lato font-bold text-sm px-3 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-700/30"
            >
              <FaReceipt className="text-sm" /> Payment Receipt
            </button>
            <button
              onClick={() => generateUPIQRReceipt(confirmedBooking)}
              className="flex items-center justify-center gap-1.5 bg-purple-700 hover:bg-purple-600 text-white font-lato font-bold text-sm px-3 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-purple-700/30"
            >
              <FaQrcode className="text-sm" /> UPI QR Receipt
            </button>
            <button
              onClick={() => sendWhatsAppTicket(confirmedBooking)}
              className="flex items-center justify-center gap-1.5 bg-green-700 hover:bg-green-600 text-white font-lato font-bold text-sm px-3 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-green-700/30"
            >
              <FaWhatsapp className="text-sm" /> WhatsApp
            </button>
          </div>

          <button onClick={onClose} className="w-full font-lato text-stone-400 hover:text-stone-200 text-sm transition-colors py-1">
            Close
          </button>
        </div>
      </div>
    );
  }

  const bookingPayload = {
    templeId: temple.id, templeName: temple.name, slot: slot.slot, slotTime: slot.time,
    visitDate: form.date, visitors: form.visitors, totalAmount: total,
    visitorName: form.name, email: form.email, phone: form.phone,
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-amber-900/30 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-amber-900/20 sticky top-0 bg-stone-900/95 backdrop-blur">
            <div>
              <h2 className="font-cinzel text-amber-400 text-xl font-bold">{t("booking.title")}</h2>
              <p className="font-lato text-stone-400 text-sm mt-0.5">{temple.name} · {slot.slot}</p>
            </div>
            <button onClick={onClose} className="p-2 text-stone-400 hover:text-amber-400 hover:bg-amber-900/20 rounded-full transition-all"><FaTimes /></button>
          </div>
          <div className="p-6 space-y-4">
            {/* Slot summary */}
            <div className="bg-amber-900/10 border border-amber-800/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-cinzel text-stone-200 font-bold text-sm">{slot.slot}</p>
                <p className="font-lato text-stone-400 text-xs mt-0.5">{slot.time}</p>
                <p className="font-lato text-stone-500 text-xs">₹{slot.price} per person</p>
              </div>
              <div className="text-right">
                <p className="font-lato text-stone-400 text-xs">Total</p>
                <p className="font-cinzel text-amber-400 text-2xl font-bold">₹{total}</p>
              </div>
            </div>
            <div>
              <label className="font-lato text-stone-400 text-xs uppercase tracking-wider mb-1.5 block">{t("booking.name")}</label>
              <input className={ic("name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ramesh Kumar" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="font-lato text-stone-400 text-xs uppercase tracking-wider mb-1.5 block">{t("booking.email")}</label>
              <input type="email" className={ic("email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ramesh@email.com" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="font-lato text-stone-400 text-xs uppercase tracking-wider mb-1.5 block">{t("booking.phone")}</label>
              <input type="tel" className={ic("phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-lato text-stone-400 text-xs uppercase tracking-wider mb-1.5 block">{t("booking.date")}</label>
                <input type="date" min={today} className={ic("date")} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="font-lato text-stone-400 text-xs uppercase tracking-wider mb-1.5 block">{t("booking.visitors")}</label>
                <input type="number" min={1} max={10} className={ic("visitors")} value={form.visitors} onChange={(e) => setForm({ ...form, visitors: parseInt(e.target.value) || 1 })} />
                {errors.visitors && <p className="text-red-400 text-xs mt-1">{errors.visitors}</p>}
              </div>
            </div>
            <button
              onClick={handleProceedToPayment}
              className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-cinzel font-bold text-base py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-600/30 flex items-center justify-center gap-2 mt-2"
            >
              Proceed to Payment <FaArrowRight className="text-sm" />
            </button>
            {!user && <p className="font-lato text-amber-600/70 text-xs text-center">You need to login to book tickets</p>}
          </div>
        </div>
      </div>
      {showPayment && <PaymentModal booking={bookingPayload} onSuccess={handlePaymentSuccess} onClose={() => setShowPayment(false)} />}
    </>
  );
};

export default BookingModal;
