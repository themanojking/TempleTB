import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaTimes, FaCreditCard, FaMobileAlt, FaUniversity,
  FaCheckCircle, FaLock, FaQrcode, FaSpinner
} from "react-icons/fa";
import { SiRazorpay, SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si";
import { MdAccountBalance } from "react-icons/md";

const PAYMENT_METHODS = [
  { id: "razorpay", label: "Razorpay", icon: SiRazorpay, color: "text-blue-400", desc: "Cards, UPI, Wallets" },
  { id: "upi", label: "UPI / QR", icon: FaQrcode, color: "text-green-400", desc: "PhonePe, GPay, BHIM" },
  { id: "card", label: "Credit / Debit Card", icon: FaCreditCard, color: "text-amber-400", desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: MdAccountBalance, color: "text-purple-400", desc: "All major banks" },
];

const UPI_APPS = [
  { id: "gpay", label: "Google Pay", icon: SiGooglepay, color: "#4285F4" },
  { id: "phonepe", label: "PhonePe", icon: SiPhonepe, color: "#5f259f" },
  { id: "paytm", label: "Paytm", icon: SiPaytm, color: "#00b9f1" },
  { id: "bhim", label: "BHIM UPI", icon: FaMobileAlt, color: "#FF6600" },
];

const BANKS = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank",
  "Kotak Mahindra Bank", "Bank of Baroda", "Punjab National Bank", "Canara Bank",
];

const PaymentModal = ({ booking, onSuccess, onClose }) => {
  const { t } = useTranslation();
  const [method, setMethod] = useState("razorpay");
  const [upiId, setUpiId] = useState("");
  const [upiApp, setUpiApp] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [cardErrors, setCardErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState("select"); // select | confirm | processing | success

  const formatCardNumber = (val) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    if (clean.length >= 3) return clean.slice(0, 2) + "/" + clean.slice(2);
    return clean;
  };

  const validateCard = () => {
    const e = {};
    if (card.number.replace(/\s/g, "").length < 16) e.number = "Enter valid 16-digit card number";
    if (!card.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "Enter valid expiry MM/YY";
    if (card.cvv.length < 3) e.cvv = "Enter valid CVV";
    if (!card.name.trim()) e.name = "Enter cardholder name";
    return e;
  };

  const handleProceed = () => {
    if (method === "card") {
      const e = validateCard();
      if (Object.keys(e).length > 0) { setCardErrors(e); return; }
    }
    if (method === "upi" && !upiApp && !upiId.match(/^[\w.-]+@[\w]+$/)) {
      return; // need UPI selection
    }
    if (method === "netbanking" && !selectedBank) return;
    setStep("confirm");
  };

  const handlePay = async () => {
    setStep("processing");
    setProcessing(true);

    if (method === "razorpay") {
      // Load Razorpay SDK and open checkout
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YourKeyHere",
          amount: booking.totalAmount * 100, // in paise
          currency: "INR",
          name: "Thanjai Devasthanams",
          description: `${booking.templeName} - ${booking.slot}`,
          image: "/images/temples/brihadeeswarar.jpg",
          prefill: {
            name: booking.visitorName,
            email: booking.email,
            contact: booking.phone,
          },
          notes: {
            temple: booking.templeName,
            slot: booking.slot,
            visit_date: booking.visitDate,
            visitors: booking.visitors,
          },
          theme: { color: "#c9880a" },
          modal: { ondismiss: () => { setStep("select"); setProcessing(false); } },
          handler: (response) => {
            // Payment success
            const completedBooking = {
              ...booking,
              paymentId: response.razorpay_payment_id,
              paymentMethod: "Razorpay",
              paymentStatus: "paid",
            };
            setProcessing(false);
            setStep("success");
            setTimeout(() => onSuccess(completedBooking), 1500);
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => {
          setStep("select");
          setProcessing(false);
        });
        rzp.open();
      };
      document.body.appendChild(script);
      return;
    }

    // Simulate other payment methods
    await new Promise((r) => setTimeout(r, 2500));
    const completedBooking = {
      ...booking,
      paymentId: `PAY${Date.now()}`,
      paymentMethod: method.toUpperCase(),
      paymentStatus: "paid",
    };
    setProcessing(false);
    setStep("success");
    setTimeout(() => onSuccess(completedBooking), 1500);
  };

  const inputCls = (err) =>
    `w-full bg-stone-800 border ${err ? "border-red-500/60" : "border-amber-900/30"} text-stone-100 font-lato text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder-stone-500`;

  // ── SUCCESS SCREEN ──
  if (step === "success") {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-green-700/40 rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-green-600/60">
            <FaCheckCircle className="text-4xl text-green-400" />
          </div>
          <h2 className="font-cinzel text-green-400 text-2xl font-bold">Payment Successful!</h2>
          <p className="font-lato text-stone-400 text-sm mt-3">
            ₹{booking.totalAmount} paid via {method === "razorpay" ? "Razorpay" : method.toUpperCase()}
          </p>
          <div className="mt-3 font-lato text-stone-300 text-sm space-y-1">
            <p><span className="text-stone-500">Temple:</span> {booking.templeName}</p>
            <p><span className="text-stone-500">Slot:</span> {booking.slot}</p>
            <p><span className="text-stone-500">Visitors:</span> {booking.visitors}</p>
          </div>
          <div className="mt-4 h-1 w-full bg-stone-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-[grow_1.2s_ease-out_forwards] w-0 rounded-full" style={{ animation: "none", width: "100%", transition: "width 1.2s ease-out" }} />
          </div>
          <p className="font-lato text-stone-500 text-xs mt-3">Generating your ticket...</p>
        </div>
      </div>
    );
  }

  // ── PROCESSING SCREEN ──
  if (step === "processing") {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-amber-900/30 rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-amber-700/40">
            <FaSpinner className="text-4xl text-amber-400 animate-spin" />
          </div>
          <h2 className="font-cinzel text-amber-400 text-xl font-bold">Processing Payment</h2>
          <p className="font-lato text-stone-400 text-sm mt-3">
            Please do not close or refresh this page...
          </p>
          <div className="mt-6 flex justify-center gap-2">
            {[0, 0.2, 0.4].map((delay, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── CONFIRM SCREEN ──
  if (step === "confirm") {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-amber-900/30 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-amber-900/20">
            <h2 className="font-cinzel text-amber-400 text-xl font-bold">Confirm Payment</h2>
            <button onClick={() => setStep("select")} className="p-2 text-stone-400 hover:text-amber-400 rounded-full transition-all">
              <FaTimes />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {/* Summary card */}
            <div className="bg-amber-900/10 border border-amber-800/30 rounded-xl p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-cinzel text-stone-100 font-bold text-base">{booking.templeName}</p>
                  <p className="font-lato text-stone-400 text-sm mt-0.5">{booking.slot} · {new Date(booking.visitDate).toLocaleDateString("en-IN")}</p>
                  <p className="font-lato text-stone-400 text-sm">{booking.visitors} visitor{booking.visitors > 1 ? "s" : ""}</p>
                </div>
                <div className="text-right">
                  <p className="font-cinzel text-amber-400 text-2xl font-bold">₹{booking.totalAmount}</p>
                  <p className="font-lato text-stone-500 text-xs mt-0.5">incl. all taxes</p>
                </div>
              </div>
              <div className="border-t border-amber-900/20 pt-3 flex items-center gap-2">
                <span className="font-lato text-stone-400 text-xs">Payment via:</span>
                <span className="font-lato text-amber-400 text-xs font-semibold capitalize">
                  {method === "razorpay" ? "Razorpay Gateway" :
                   method === "upi" ? `UPI${upiApp ? ` (${upiApp})` : ""}${upiId ? ` · ${upiId}` : ""}` :
                   method === "card" ? `Card ····${card.number.replace(/\s/g, "").slice(-4)}` :
                   `Net Banking (${selectedBank})`}
                </span>
              </div>
            </div>

            {/* Security notice */}
            <div className="flex items-center gap-2 bg-green-900/10 border border-green-800/20 rounded-lg px-4 py-3">
              <FaLock className="text-green-500 text-xs flex-shrink-0" />
              <p className="font-lato text-green-400/80 text-xs">
                256-bit SSL encrypted · Your payment is 100% secure
              </p>
            </div>

            <button
              onClick={handlePay}
              className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-cinzel font-bold text-base py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/30 flex items-center justify-center gap-2"
            >
              <FaLock className="text-sm" />
              Pay ₹{booking.totalAmount} Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SELECT METHOD SCREEN ──
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-amber-900/30 rounded-2xl w-full max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-900/20 sticky top-0 bg-stone-900/95 backdrop-blur z-10">
          <div>
            <h2 className="font-cinzel text-amber-400 text-xl font-bold">Choose Payment</h2>
            <p className="font-lato text-stone-400 text-sm mt-0.5">
              {booking.templeName} · <span className="text-amber-500 font-semibold">₹{booking.totalAmount}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-amber-400 hover:bg-amber-900/20 rounded-full transition-all">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment method tabs */}
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left ${
                  method === m.id
                    ? "border-amber-600/60 bg-amber-900/20 shadow-md shadow-amber-900/20"
                    : "border-amber-900/20 hover:border-amber-800/40 bg-stone-800/50"
                }`}
              >
                <m.icon className={`text-xl flex-shrink-0 ${m.color}`} />
                <div className="min-w-0">
                  <p className={`font-lato text-xs font-bold truncate ${method === m.id ? "text-amber-400" : "text-stone-300"}`}>
                    {m.label}
                  </p>
                  <p className="font-lato text-stone-500 text-xs truncate">{m.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* ── RAZORPAY ── */}
          {method === "razorpay" && (
            <div className="bg-stone-800/60 border border-blue-900/30 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <SiRazorpay className="text-blue-400 text-2xl" />
                <div>
                  <p className="font-cinzel text-stone-100 font-bold text-sm">Razorpay Secure Checkout</p>
                  <p className="font-lato text-stone-400 text-xs">Cards · UPI · Wallets · EMI · Net Banking</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Visa", "Mastercard", "RuPay", "UPI", "Paytm", "PhonePe"].map((b) => (
                  <div key={b} className="bg-stone-700 rounded-lg px-3 py-2 text-center">
                    <span className="font-lato text-stone-300 text-xs">{b}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <FaLock className="text-green-500 text-xs" />
                <p className="font-lato text-green-400/70 text-xs">Powered by Razorpay · PCI DSS Compliant</p>
              </div>
            </div>
          )}

          {/* ── UPI ── */}
          {method === "upi" && (
            <div className="space-y-4">
              {/* UPI Apps */}
              <div>
                <p className="font-lato text-stone-400 text-xs uppercase tracking-wider mb-3">
                  Pay via UPI App
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => { setUpiApp(app.id); setUpiId(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                        upiApp === app.id
                          ? "border-amber-600/60 bg-amber-900/20"
                          : "border-amber-900/20 hover:border-amber-800/40 bg-stone-800/50"
                      }`}
                    >
                      <app.icon className="text-2xl" style={{ color: app.color }} />
                      <span className="font-lato text-stone-300 text-xs text-center leading-tight">{app.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-amber-900/20" />
                <span className="font-lato text-stone-500 text-xs">or enter UPI ID</span>
                <div className="h-px flex-1 bg-amber-900/20" />
              </div>

              {/* Manual UPI ID */}
              <div>
                <label className="font-lato text-stone-400 text-xs uppercase tracking-wider mb-1.5 block">
                  UPI ID
                </label>
                <div className="relative">
                  <FaMobileAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-sm" />
                  <input
                    type="text"
                    className={`w-full bg-stone-800 border ${
                      upiId && !upiId.match(/^[\w.-]+@[\w]+$/)
                        ? "border-red-500/60" : "border-amber-900/30"
                    } text-stone-100 font-lato text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 transition-all placeholder-stone-500`}
                    placeholder="yourname@upi  /  9876543210@paytm"
                    value={upiId}
                    onChange={(e) => { setUpiId(e.target.value); setUpiApp(""); }}
                  />
                </div>
                {upiId && !upiId.match(/^[\w.-]+@[\w]+$/) && (
                  <p className="text-red-400 text-xs mt-1 font-lato">Enter valid UPI ID (e.g. name@upi)</p>
                )}
                <p className="font-lato text-stone-500 text-xs mt-1.5">
                  Supports BHIM, GPay, PhonePe, Paytm, and all UPI apps
                </p>
              </div>
            </div>
          )}

          {/* ── CARD ── */}
          {method === "card" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                {["Visa", "Mastercard", "RuPay", "Amex"].map((c) => (
                  <span key={c} className="bg-stone-800 border border-amber-900/20 text-stone-400 text-xs px-2.5 py-1 rounded-lg font-lato">
                    {c}
                  </span>
                ))}
              </div>

              <div>
                <label className="font-lato text-stone-400 text-xs uppercase tracking-wider mb-1.5 block">Card Number</label>
                <div className="relative">
                  <FaCreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-sm" />
                  <input
                    className={`${inputCls(cardErrors.number)} pl-10`}
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    maxLength={19}
                  />
                </div>
                {cardErrors.number && <p className="text-red-400 text-xs mt-1 font-lato">{cardErrors.number}</p>}
              </div>

              <div>
                <label className="font-lato text-stone-400 text-xs uppercase tracking-wider mb-1.5 block">Cardholder Name</label>
                <input
                  className={inputCls(cardErrors.name)}
                  placeholder="As on card"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                />
                {cardErrors.name && <p className="text-red-400 text-xs mt-1 font-lato">{cardErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-lato text-stone-400 text-xs uppercase tracking-wider mb-1.5 block">Expiry (MM/YY)</label>
                  <input
                    className={inputCls(cardErrors.expiry)}
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                    maxLength={5}
                  />
                  {cardErrors.expiry && <p className="text-red-400 text-xs mt-1 font-lato">{cardErrors.expiry}</p>}
                </div>
                <div>
                  <label className="font-lato text-stone-400 text-xs uppercase tracking-wider mb-1.5 block">CVV</label>
                  <input
                    type="password"
                    className={inputCls(cardErrors.cvv)}
                    placeholder="•••"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    maxLength={4}
                  />
                  {cardErrors.cvv && <p className="text-red-400 text-xs mt-1 font-lato">{cardErrors.cvv}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-green-900/10 border border-green-800/20 rounded-lg px-4 py-2.5">
                <FaLock className="text-green-500 text-xs flex-shrink-0" />
                <p className="font-lato text-green-400/70 text-xs">Your card details are encrypted and secure</p>
              </div>
            </div>
          )}

          {/* ── NET BANKING ── */}
          {method === "netbanking" && (
            <div className="space-y-4">
              <p className="font-lato text-stone-400 text-xs uppercase tracking-wider">Select Your Bank</p>
              <div className="grid grid-cols-2 gap-2">
                {BANKS.map((bank) => (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(bank)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      selectedBank === bank
                        ? "border-amber-600/60 bg-amber-900/20"
                        : "border-amber-900/20 hover:border-amber-800/40 bg-stone-800/50"
                    }`}
                  >
                    <FaUniversity className={`text-sm flex-shrink-0 ${selectedBank === bank ? "text-amber-400" : "text-stone-500"}`} />
                    <span className={`font-lato text-xs leading-tight ${selectedBank === bank ? "text-amber-300" : "text-stone-400"}`}>
                      {bank}
                    </span>
                  </button>
                ))}
              </div>
              <p className="font-lato text-stone-500 text-xs">
                You will be redirected to your bank's secure page to complete payment.
              </p>
            </div>
          )}

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={
              (method === "upi" && !upiApp && !upiId.match(/^[\w.-]+@[\w]+$/)) ||
              (method === "netbanking" && !selectedBank)
            }
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:cursor-not-allowed disabled:text-stone-500 text-stone-950 font-cinzel font-bold text-base py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/30 flex items-center justify-center gap-2"
          >
            <FaLock className="text-sm" />
            Proceed to Pay ₹{booking.totalAmount}
          </button>

          {/* Footer */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-stone-600">
              <FaLock className="text-xs" />
              <span className="font-lato text-xs">SSL Secured</span>
            </div>
            <div className="w-px h-3 bg-stone-700" />
            <span className="font-lato text-stone-600 text-xs">PCI DSS Compliant</span>
            <div className="w-px h-3 bg-stone-700" />
            <span className="font-lato text-stone-600 text-xs">100% Safe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
