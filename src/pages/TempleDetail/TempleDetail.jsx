import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import { temples } from "../../data/temples.js";
import BookingModal from "../../components/BookingModal/BookingModal.jsx";
import {
  FaMapMarkerAlt, FaTicketAlt, FaArrowLeft, FaHistory,
  FaClock, FaStar, FaUsers
} from "react-icons/fa";
import { MdTempleHindu } from "react-icons/md";

const TABS = ["history", "timings", "map"];

const TempleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("history");
  const [bookingSlot, setBookingSlot] = useState(null);

  const temple = temples.find((t) => t.id === parseInt(id));

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    window.scrollTo(0, 0);
  }, [id]);

  if (!temple) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <MdTempleHindu className="text-6xl text-amber-900/30 mx-auto mb-4" />
          <p className="font-cinzel text-stone-400 text-xl">Temple not found</p>
          <button onClick={() => navigate("/temples")} className="mt-4 font-lato text-amber-600 hover:text-amber-400">
            ← Back to Temples
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-950 min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[60vh] min-h-80 overflow-hidden">
        <img
          src={temple.image}
          alt={temple.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "/images/temples/brihadeeswarar.jpg"}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate("/temples")}
          className="absolute top-24 left-6 flex items-center gap-2 bg-stone-950/60 backdrop-blur border border-amber-900/30 text-stone-300 hover:text-amber-400 font-lato text-sm px-4 py-2 rounded-full transition-all duration-200"
        >
          <FaArrowLeft className="text-xs" /> Back
        </button>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-5xl mx-auto">
            <span className="bg-amber-600/90 text-stone-950 text-xs font-lato font-bold px-3 py-1 rounded-full mb-3 inline-block">
              {temple.category}
            </span>
            <h1 className="font-cinzel text-stone-100 text-4xl sm:text-5xl font-bold leading-tight" data-aos="fade-up">
              {temple.name}
            </h1>
            <p className="font-cinzel text-amber-400 text-xl mt-1" data-aos="fade-up" data-aos-delay="100">
              {temple.tamilName}
            </p>
            <div className="flex items-center gap-2 mt-3 text-stone-400" data-aos="fade-up" data-aos-delay="150">
              <FaMapMarkerAlt className="text-amber-600 text-sm" />
              <span className="font-lato text-sm">{temple.location}, {temple.district}, {temple.state}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Highlights */}
        <div data-aos="fade-up" className="flex flex-wrap gap-2 mb-8">
          {temple.highlights.map((h) => (
            <span key={h} className="bg-amber-900/20 border border-amber-800/30 text-amber-300 text-sm font-lato px-3 py-1 rounded-lg">
              ⭐ {h}
            </span>
          ))}
        </div>

        {/* Description */}
        <p data-aos="fade-up" className="font-lato text-stone-300 text-base leading-relaxed mb-10">
          {temple.description}
        </p>

        {/* Tabs */}
        <div data-aos="fade-up" className="border-b border-amber-900/20 mb-8">
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-cinzel text-sm tracking-wider uppercase px-6 py-3.5 transition-all duration-200 border-b-2 ${
                  activeTab === tab
                    ? "text-amber-400 border-amber-500"
                    : "text-stone-400 border-transparent hover:text-stone-200 hover:border-amber-800/40"
                }`}
              >
                {tab === "history" && <FaHistory className="inline mr-2 text-xs" />}
                {tab === "timings" && <FaClock className="inline mr-2 text-xs" />}
                {tab === "map" && <FaMapMarkerAlt className="inline mr-2 text-xs" />}
                {t(`temple_detail.${tab}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div data-aos="fade-in">
          {activeTab === "history" && (
            <div className="bg-stone-900/60 border border-amber-900/20 rounded-2xl p-8">
              <h3 className="font-cinzel text-amber-400 text-xl font-bold mb-4">
                {t("temple_detail.history")}
              </h3>
              <p className="font-lato text-stone-300 text-base leading-loose">
                {temple.history}
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: FaStar, label: "Category", value: temple.category },
                  { icon: MdTempleHindu, label: "Deity", value: temple.deity },
                  { icon: FaMapMarkerAlt, label: "Location", value: temple.location },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-stone-800 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-900/30 border border-amber-800/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="text-amber-500" />
                    </div>
                    <div>
                      <p className="font-lato text-stone-400 text-xs uppercase tracking-wider">{label}</p>
                      <p className="font-lato text-stone-200 text-sm mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "timings" && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-amber-400 text-xl font-bold mb-6">
                {t("temple_detail.timings")}
              </h3>
              {temple.timings.map((slot, i) => (
                <div
                  key={i}
                  className="bg-stone-900 border border-amber-900/20 hover:border-amber-700/40 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-900/20 border border-amber-800/30 rounded-xl flex items-center justify-center">
                      <FaClock className="text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-cinzel text-stone-100 font-bold">{slot.slot}</h4>
                      <p className="font-lato text-stone-400 text-sm mt-0.5">{slot.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="font-lato text-stone-400 text-xs uppercase tracking-wider">Per person</p>
                      <p className="font-cinzel text-amber-400 text-2xl font-bold">₹{slot.price}</p>
                    </div>
                    <button
                      onClick={() => setBookingSlot(slot)}
                      className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-cinzel font-bold text-sm px-5 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/30 whitespace-nowrap"
                    >
                      <FaTicketAlt />
                      {t("temple_detail.book_slot")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "map" && (
            <div>
              <h3 className="font-cinzel text-amber-400 text-xl font-bold mb-6">
                {t("temple_detail.map")}
              </h3>
              <div className="bg-stone-900 border border-amber-900/20 rounded-2xl overflow-hidden h-80">
                <iframe
                  title={`Map of ${temple.name}`}
                  src={`https://maps.google.com/maps?q=${temple.lat},${temple.lng}&z=15&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-stone-400">
                <FaMapMarkerAlt className="text-amber-600" />
                <span className="font-lato text-sm">
                  {temple.location}, {temple.district}, {temple.state}
                </span>
                <a
                  href={`https://maps.google.com/?q=${temple.lat},${temple.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto font-lato text-sm text-amber-600 hover:text-amber-400 transition-colors"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Book CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setBookingSlot(temple.timings[0])}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-cinzel font-bold text-base px-8 py-4 rounded-full shadow-2xl shadow-amber-600/40 hover:shadow-amber-500/50 transition-all duration-300 hover:-translate-y-0.5"
        >
          <FaTicketAlt />
          Book Darshan Ticket
        </button>
      </div>

      {/* Booking Modal */}
      {bookingSlot && (
        <BookingModal
          temple={temple}
          slot={bookingSlot}
          onClose={() => setBookingSlot(null)}
        />
      )}
    </div>
  );
};

export default TempleDetail;
