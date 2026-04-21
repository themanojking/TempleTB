import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import { teamMembers } from "../../data/temples.js";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

const Team = () => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-b border-amber-900/20 py-20 text-center">
        <div data-aos="fade-down" className="inline-flex items-center gap-2 text-amber-600/80 text-sm font-lato mb-3">
          <span>✦</span> The Builders <span>✦</span>
        </div>
        <h1 data-aos="fade-up" className="font-cinzel text-stone-100 text-4xl sm:text-5xl font-bold">
          {t("team.title")}
        </h1>
        <p data-aos="fade-up" data-aos-delay="100" className="font-lato text-stone-400 mt-3 max-w-xl mx-auto">
          {t("team.subtitle")}
        </p>
        <div data-aos="fade-up" data-aos-delay="150" className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-600" />
          <div className="w-2 h-2 bg-amber-500 rotate-45" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-600" />
        </div>
      </div>

      {/* Team Grid */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {teamMembers.map((member, i) => (
            <div
              key={member.id}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="group bg-stone-900 border border-amber-900/20 hover:border-amber-700/40 rounded-2xl p-8 flex gap-6 items-start transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/15 hover:-translate-y-1"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-800/40 group-hover:border-amber-600/60 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full  object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = `https://placehold.co/80x80/1c1917/c9880a?text=${member.name[0]}`; }}
                  />
                </div>
                {/* Gold ring on hover */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-500/0 group-hover:ring-amber-500/30 transition-all duration-300" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-cinzel text-stone-100 font-bold text-lg group-hover:text-amber-400 transition-colors leading-tight">
                  {member.name}
                </h3>
                <p className="font-lato text-amber-600/80 text-sm mt-0.5 font-semibold">
                  {member.role}
                </p>
                <p className="font-lato text-stone-400 text-sm mt-3 leading-relaxed">
                  {member.bio}
                </p>

                {/* Social links */}
                <div className="flex gap-3 mt-4">
                  {[
                    { icon: FaLinkedin, href: member.linkedin, label: "LinkedIn", color: "hover:text-blue-400" },
                    { icon: FaGithub, href: member.github, label: "GitHub", color: "hover:text-stone-200" },
                    { icon: FaEnvelope, href: "#", label: "Email", color: "hover:text-amber-400" },
                  ].map(({ icon: Icon, href, label, color }) => (
                    <a
                      key={label}
                      href={href}
                      className={`w-8 h-8 bg-stone-800 border border-amber-900/20 hover:border-amber-700/40 text-stone-500 ${color} rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-stone-700`}
                      title={label}
                    >
                      <Icon className="text-xs" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission statement */}
        <div
          data-aos="fade-up"
          className="mt-20 bg-gradient-to-r from-amber-950/30 via-stone-900 to-amber-950/30 border border-amber-800/30 rounded-3xl p-10 text-center"
        >
          <div className="font-cinzel text-amber-500 text-4xl mb-4 opacity-40">ॐ</div>
          <h3 className="font-cinzel text-stone-100 text-2xl font-bold">Our Mission</h3>
          <p className="font-lato text-stone-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            We are a team of passionate developers and designers from Tamil Nadu who believe
            that technology should serve devotion. Our goal is to make temple visits seamless,
            dignified, and accessible for every devotee — preserving the sanctity of these
            ancient sacred spaces while embracing modern convenience.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600" />
            <div className="w-2 h-2 bg-amber-500 rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
