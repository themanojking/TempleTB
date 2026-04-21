import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt, FaStar, FaTicketAlt } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";

const TempleCard = ({ temple, index = 0 }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={index * 100}
      className="group relative bg-stone-900 border border-amber-900/20 rounded-2xl overflow-hidden hover:border-amber-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/20 hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/temples/${temple.id}`)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={temple.image}
          alt={temple.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/600x400/1c1917/c9880a?text=Temple";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-amber-600/90 backdrop-blur text-stone-950 text-xs font-lato font-bold px-2.5 py-1 rounded-full">
            {temple.category}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Temple Name */}
        <h3 className="font-cinzel text-stone-100 text-lg font-bold leading-tight group-hover:text-amber-400 transition-colors duration-300">
          {temple.name}
        </h3>
        <p className="font-lato text-amber-600/70 text-sm mt-0.5">
          {temple.tamilName}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 mt-2 text-stone-400">
          <FaMapMarkerAlt className="text-amber-600 text-xs flex-shrink-0" />
          <span className="font-lato text-sm">
            {temple.location}, {temple.district}
          </span>
        </div>

        {/* Description */}
        <p className="font-lato text-stone-400 text-sm mt-3 line-clamp-2 leading-relaxed">
          {temple.description}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {temple.highlights.slice(0, 3).map((h) => (
            <span
              key={h}
              className="bg-amber-900/20 border border-amber-800/30 text-amber-400/80 text-xs font-lato px-2 py-0.5 rounded-md"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-amber-900/20">
          <div className="flex items-center gap-1 text-amber-400">
            <MdAccessTime className="text-sm" />
            <span className="font-lato text-xs text-stone-400">
              {temple.timings[0]?.time.split("–")[0].trim()}
            </span>
          </div>
          <button className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-lato font-bold px-3 py-1.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/30">
            <FaTicketAlt className="text-xs" />
            {t("temples.book_ticket")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TempleCard;
