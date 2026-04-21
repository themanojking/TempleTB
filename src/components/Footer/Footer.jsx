import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaOm, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-stone-950 border-t border-amber-900/20 pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <FaOm className="text-amber-400 text-3xl" />
              <div>
                <span className="font-cinzel text-amber-400 text-xl font-bold tracking-widest block leading-none">
                  THANJAI
                </span>
                <span className="font-cinzel text-stone-300 text-lg tracking-widest block leading-none">
                  DEVASTHANAMS
                </span>
              </div>
            </div>
            <p className="font-lato text-stone-400 text-sm leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-4 mt-5">
              {[FaFacebook, FaInstagram, FaYoutube, FaTwitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-stone-800 hover:bg-amber-900/50 border border-amber-900/20 hover:border-amber-700/50 text-stone-400 hover:text-amber-400 rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-amber-400 font-bold tracking-wider text-sm mb-4 uppercase">
              {t("footer.quick_links")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: t("nav.home") },
                { to: "/temples", label: t("nav.temples") },
                { to: "/team", label: t("nav.team") },
                { to: "/auth?mode=login", label: t("nav.login") },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-lato text-stone-400 hover:text-amber-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-amber-600/40 group-hover:bg-amber-500 rounded-full transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cinzel text-amber-400 font-bold tracking-wider text-sm mb-4 uppercase">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3">
              {[
                { Icon: FaMapMarkerAlt, text: "Thanjavur, Tamil Nadu 613001" },
                { Icon: FaPhone, text: "+91 93442 45993" },
                { Icon: FaEnvelope, text: "team@gmail.com" },
              ].map(({ Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3 text-stone-400">
                  <Icon className="text-amber-600 mt-0.5 flex-shrink-0 text-sm" />
                  <span className="font-lato text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-amber-900/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-lato text-stone-500 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Thanjai Devasthanams. {t("footer.rights")}.
          </p>
          <p className="font-lato text-stone-600 text-xs">
            Built with ❤️ for the devotees of Tamil Nadu
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
