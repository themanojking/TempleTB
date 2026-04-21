import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import TempleCard from "../../components/TempleCard/TempleCard.jsx";
import { temples } from "../../data/temples.js";
import { FaSearch, FaFilter } from "react-icons/fa";
import { MdTempleHindu } from "react-icons/md";

const categories = ["All Categories", "UNESCO Heritage", "Murugan Temple", "Pancha Bhuta Stala", "Sacred Tank"];
const districts = ["All Districts", "Thanjavur"];
const states = ["All States", "Tamil Nadu"];

const Temples = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("All Districts");
  const [state, setState] = useState("All States");
  const [category, setCategory] = useState("All Categories");

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const filtered = temples.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tamilName.includes(search) ||
      t.location.toLowerCase().includes(search.toLowerCase());
    const matchDistrict = district === "All Districts" || t.district === district;
    const matchState = state === "All States" || t.state === state;
    const matchCategory = category === "All Categories" || t.category === category;
    return matchSearch && matchDistrict && matchState && matchCategory;
  });

  const selectClass =
    "bg-stone-900 border border-amber-900/30 text-stone-300 font-lato text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer";

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-b border-amber-900/20 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div
            data-aos="fade-down"
            className="inline-flex items-center gap-2 text-amber-600/80 text-sm font-lato mb-3"
          >
            <MdTempleHindu /> Thanjavur District, Tamil Nadu
          </div>
          <h1
            data-aos="fade-up"
            className="font-cinzel text-stone-100 text-4xl sm:text-5xl font-bold"
          >
            {t("temples.title")}
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="font-lato text-stone-400 mt-3 max-w-xl mx-auto"
          >
            {t("temples.subtitle")}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-30 bg-stone-950/95 backdrop-blur border-b border-amber-900/20 py-4 shadow-lg shadow-stone-950/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("temples.search_placeholder")}
                className="w-full bg-stone-900 border border-amber-900/30 text-stone-200 font-lato text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 transition-all placeholder-stone-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <FaFilter className="text-amber-700 text-sm ml-1" />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={selectClass}
              >
                {districts.map((d) => (
                  <option key={d} value={d} className="bg-stone-900">
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={selectClass}
              >
                {states.map((s) => (
                  <option key={s} value={s} className="bg-stone-900">
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-stone-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Result count */}
            <div className="hidden lg:flex items-center whitespace-nowrap">
              <span className="font-lato text-stone-400 text-sm">
                <span className="text-amber-400 font-semibold">{filtered.length}</span> temples found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <MdTempleHindu className="text-6xl text-amber-900/30" />
            <p className="font-cinzel text-stone-400 text-xl">{t("temples.no_results")}</p>
            <button
              onClick={() => {
                setSearch("");
                setDistrict("All Districts");
                setState("All States");
                setCategory("All Categories");
              }}
              className="font-lato text-amber-600 hover:text-amber-400 text-sm transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((temple, i) => (
              <TempleCard key={temple.id} temple={temple} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Temples;
