import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import TempleCard from "../../components/TempleCard/TempleCard.jsx";
import { temples } from "../../data/temples.js";
import {
  FaTicketAlt, FaShieldAlt, FaFileDownload, FaClock,
  FaArrowRight, FaChevronDown
} from "react-icons/fa";
import { MdTempleHindu } from "react-icons/md";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }, []);

  const stats = [
    { value: "50+", label: t("home.stats_temples") },
    { value: "1000+", label: t("home.stats_years") },
    { value: "2L+", label: t("home.stats_visitors") },
    { value: "3", label: t("home.stats_heritage") },
  ];

  const whyUs = [
    { icon: FaTicketAlt, title: t("home.why_1_title"), desc: t("home.why_1_desc"), color: "amber" },
    { icon: FaShieldAlt, title: t("home.why_2_title"), desc: t("home.why_2_desc"), color: "green" },
    { icon: FaFileDownload, title: t("home.why_3_title"), desc: t("home.why_3_desc"), color: "blue" },
    { icon: FaClock, title: t("home.why_4_title"), desc: t("home.why_4_desc"), color: "purple" },
  ];

  const colorMap = {
    amber: "bg-amber-900/20 border-amber-800/30 text-amber-400",
    green: "bg-green-900/20 border-green-800/30 text-green-400",
    blue: "bg-blue-900/20 border-blue-800/30 text-blue-400",
    purple: "bg-purple-900/20 border-purple-800/30 text-purple-400",
  };

  return (
    <div className="bg-stone-950 min-h-screen">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/temples/thanjavur-brihadeeshwara.jpg"
            alt="Brihadeeswarar Temple"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-transparent to-stone-950/60" />
        </div>

        {/* Animated decorative elements */}
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-amber-500/40 rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
        <div className="absolute top-1/3 right-20 w-1.5 h-1.5 bg-amber-400/30 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-amber-600/40 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div
            data-aos="fade-down"
            className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-700/30 text-amber-400 text-sm font-lato px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
          >
            <MdTempleHindu className="text-lg" />
            Thanjavur District · Tamil Nadu
          </div>

          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="font-cinzel text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-100 leading-tight"
          >
            {t("home.hero_title")}
          </h1>
          <h2
            data-aos="fade-up"
            data-aos-delay="200"
            className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-light text-amber-400 mt-2"
          >
            {t("home.hero_subtitle")}
          </h2>

          <p
            data-aos="fade-up"
            data-aos-delay="300"
            className="font-lato text-stone-300 text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            {t("home.hero_description")}
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <button
              onClick={() => navigate("/temples")}
              className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-cinzel font-bold text-base px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-amber-600/30 group"
            >
              <FaTicketAlt />
              {t("home.book_now")}
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/temples")}
              className="flex items-center justify-center gap-2 bg-transparent border border-amber-700/50 hover:border-amber-500 text-amber-400 hover:text-amber-300 font-cinzel font-bold text-base px-8 py-4 rounded-full transition-all duration-300 hover:bg-amber-900/20 backdrop-blur-sm"
            >
              {t("home.explore_temples")}
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400">
          <span className="font-lato text-xs tracking-widest uppercase opacity-60">Scroll</span>
          <FaChevronDown className="animate-bounce text-amber-600/60" />
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-16 bg-gradient-to-r from-amber-950/20 via-stone-900 to-amber-950/20 border-y border-amber-900/20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                data-aos="zoom-in"
                data-aos-delay={i * 100}
                className="text-center"
              >
                <p className="font-cinzel text-4xl font-bold text-amber-400">{stat.value}</p>
                <p className="font-lato text-stone-400 text-sm mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TEMPLES */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="font-lato text-amber-600 text-sm uppercase tracking-widest">Sacred Sites</span>
            <h2 className="font-cinzel text-stone-100 text-4xl font-bold mt-2">
              {t("home.featured_temples")}
            </h2>
            <p className="font-lato text-stone-400 mt-3 max-w-xl mx-auto">
              {t("home.featured_subtitle")}
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-600" />
              <div className="w-2 h-2 bg-amber-500 rotate-45" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {temples.slice(0, 6).map((temple, i) => (
              <TempleCard key={temple.id} temple={temple} index={i} />
            ))}
          </div>

          <div className="text-center mt-10" data-aos="fade-up">
            <button
              onClick={() => navigate("/temples")}
              className="inline-flex items-center gap-2 border border-amber-700/50 hover:border-amber-500 text-amber-400 hover:text-amber-300 font-cinzel font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-amber-900/20"
            >
              View All Temples
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 px-4 bg-stone-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="font-lato text-amber-600 text-sm uppercase tracking-widest">Our Promise</span>
            <h2 className="font-cinzel text-stone-100 text-4xl font-bold mt-2">
              {t("home.why_title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="bg-stone-900 border border-amber-900/20 rounded-2xl p-6 hover:border-amber-700/40 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${colorMap[item.color]}`}
                >
                  <item.icon className="text-xl" />
                </div>
                <h3 className="font-cinzel text-stone-100 font-bold text-base group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="font-lato text-stone-400 text-sm mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div
          data-aos="fade-up"
          className="max-w-4xl mx-auto bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border border-amber-800/30 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 text-8xl text-amber-400 font-cinzel">ॐ</div>
            <div className="absolute bottom-4 right-4 text-8xl text-amber-400 font-cinzel">ॐ</div>
          </div>
          <h2 className="font-cinzel text-stone-100 text-3xl font-bold relative z-10">
            Begin Your Sacred Journey
          </h2>
          <p className="font-lato text-stone-400 mt-3 max-w-lg mx-auto relative z-10">
            Join thousands of devotees who book their darshan tickets with us every month.
          </p>
          <button
            onClick={() => navigate("/temples")}
            className="mt-8 inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-cinzel font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-amber-600/30 relative z-10"
          >
            <FaTicketAlt /> Book Your Darshan
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
