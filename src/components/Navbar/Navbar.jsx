import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext.jsx";
import { useBooking } from "../../context/BookingContext.jsx";
import { FaOm, FaHistory, FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { setHistoryOpen, fetchBookings, bookings } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleHistory = () => {
    if (user) {
      fetchBookings();
      setHistoryOpen(true);
    }
  };

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setLangOpen(false);
  };

  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/temples", label: t("nav.temples") },
    { path: "/team", label: t("nav.team") },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-stone-950/95 backdrop-blur-md shadow-lg shadow-amber-900/20 py-2"
          : "bg-gradient-to-b from-black/60 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <FaOm className="text-amber-400 text-3xl group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 blur-sm bg-amber-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full" />
            </div>
            <div>
              <span className="font-cinzel text-amber-400 text-xl font-bold tracking-widest">
                THANJAI
              </span>
              <span className="font-cinzel text-stone-200 text-xl font-light tracking-widest">
                DEVASTHANAMS
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-lato text-sm tracking-wider uppercase transition-all duration-300 relative group ${
                  location.pathname === link.path
                    ? "text-amber-400"
                    : "text-stone-300 hover:text-amber-400"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-amber-400 transition-all duration-300 ${
                    location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-stone-300 hover:text-amber-400 transition-colors duration-200"
              >
                <MdLanguage className="text-xl" />
                <span className="font-lato text-sm uppercase">
                  {i18n.language === "ta" ? "தமிழ்" : "EN"}
                </span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-8 bg-stone-900 border border-amber-900/40 rounded-lg shadow-xl overflow-hidden min-w-28 z-50">
                  <button
                    onClick={() => switchLanguage("en")}
                    className={`w-full px-4 py-2.5 text-sm font-lato text-left hover:bg-amber-900/30 transition-colors ${
                      i18n.language === "en" ? "text-amber-400" : "text-stone-300"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => switchLanguage("ta")}
                    className={`w-full px-4 py-2.5 text-sm font-lato text-left hover:bg-amber-900/30 transition-colors ${
                      i18n.language === "ta" ? "text-amber-400" : "text-stone-300"
                    }`}
                  >
                    தமிழ்
                  </button>
                </div>
              )}
            </div>

            {/* History Icon */}
            {user && (
              <button
                onClick={handleHistory}
                className="relative p-2 text-stone-300 hover:text-amber-400 transition-colors duration-200 group"
                title={t("nav.history")}
              >
                <FaHistory className="text-xl" />
                {bookings.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {bookings.length > 9 ? "9+" : bookings.length}
                  </span>
                )}
              </button>
            )}

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-amber-900/20 border border-amber-800/40 rounded-full px-3 py-1.5">
                  <FaUser className="text-amber-400 text-xs" />
                  <span className="font-lato text-stone-200 text-sm truncate max-w-20">
                    {user.name?.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-stone-400 hover:text-red-400 transition-colors duration-200"
                  title={t("nav.logout")}
                >
                  <FaSignOutAlt className="text-xl" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth?mode=login"
                  className="font-lato text-sm text-stone-300 hover:text-amber-400 transition-colors duration-200"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="font-lato text-sm bg-amber-600 hover:bg-amber-500 text-stone-950 px-4 py-2 rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/30"
                >
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-4">
            {user && (
              <button onClick={handleHistory} className="relative text-stone-300">
                <FaHistory className="text-xl" />
                {bookings.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {bookings.length}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-stone-300 hover:text-amber-400 transition-colors"
            >
              {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-amber-900/30 pt-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block font-lato text-sm tracking-wider uppercase py-2 ${
                  location.pathname === link.path ? "text-amber-400" : "text-stone-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => switchLanguage("en")}
                className={`text-sm px-3 py-1 rounded-full border ${
                  i18n.language === "en"
                    ? "border-amber-500 text-amber-400"
                    : "border-stone-600 text-stone-400"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLanguage("ta")}
                className={`text-sm px-3 py-1 rounded-full border ${
                  i18n.language === "ta"
                    ? "border-amber-500 text-amber-400"
                    : "border-stone-600 text-stone-400"
                }`}
              >
                தமிழ்
              </button>
            </div>
            {!user && (
              <div className="flex gap-3 pt-2">
                <Link
                  to="/auth?mode=login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-stone-300 hover:text-amber-400"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/auth?mode=register"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm bg-amber-600 text-stone-950 px-4 py-1.5 rounded-full font-semibold"
                >
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
