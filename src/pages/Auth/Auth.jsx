import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaOm, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import toast from "react-hot-toast";

const Auth = () => {
  const { t } = useTranslation();
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    if (user) navigate("/");
  }, [user]);

  const validate = () => {
    const e = {};
    if (mode === "register" && !form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (mode === "register") {
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
      if (!form.phone.match(/^\+?[6-9]\d{9}$/)) e.phone = "Valid 10-digit phone required";
    }
    return e;
  };

  const handleSubmit = async () => {
  const e = validate();
  if (Object.keys(e).length > 0) {
    setErrors(e);
    return;
  }

  setLoading(true);

  try {
    if (mode === "login") {
      const res = await login(form.email, form.password);
      toast.success(res?.message || "Welcome back! 🙏");
    } else {
      const res = await register(form.name, form.email, form.password, form.phone);
      toast.success(res?.message || "Account created! 🙏");
    }

    navigate("/");
  } catch (err) {
    console.error("Auth Error:", err);

    // 🔥 Improved error handling
    if (err.response) {
      // Backend responded with error
      toast.error(err.response.data?.message || "Server error");
    } else if (err.request) {
      // Request made but no response
      toast.error("Server not responding. Check backend.");
    } else {
      // Something else
      toast.error("Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};
  const inputWrap = "relative";
  const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-sm";
  const inputClass = (field) =>
    `w-full bg-stone-800/80 border ${errors[field] ? "border-red-600/70" : "border-amber-900/30"} text-stone-100 font-lato text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder-stone-500`;

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-900/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10" data-aos="fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-900/20 border border-amber-800/40 rounded-2xl mb-4">
            <FaOm className="text-amber-400 text-3xl" />
          </div>
          <h1 className="font-cinzel text-stone-100 text-2xl font-bold">
            {mode === "login" ? t("auth.login_title") : t("auth.register_title")}
          </h1>
          <p className="font-lato text-stone-400 text-sm mt-1">Thanjai Devasthanams</p>
        </div>

        {/* Card */}
        <div className="bg-stone-900/80 backdrop-blur border border-amber-900/25 rounded-2xl p-8 shadow-2xl shadow-stone-950/50">
          {/* Tab Toggle */}
          <div className="flex bg-stone-800 rounded-xl p-1 mb-7">
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => { navigate(`/auth?mode=${m}`); setErrors({}); setForm({ name: "", email: "", password: "", confirmPassword: "", phone: "" }); }}
                className={`flex-1 font-cinzel text-sm py-2.5 rounded-lg transition-all duration-200 ${
                  mode === m
                    ? "bg-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-600/20"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                {m === "login" ? t("auth.login_btn") : t("auth.register_btn")}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* Name (register only) */}
            {mode === "register" && (
              <div className={inputWrap}>
                <FaUser className={iconClass} />
                <input
                  className={inputClass("name")}
                  placeholder={t("auth.name")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1 font-lato">{errors.name}</p>}
              </div>
            )}

            {/* Email */}
            <div className={inputWrap}>
              <FaEnvelope className={iconClass} />
              <input
                type="email"
                className={inputClass("email")}
                placeholder={t("auth.email")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 font-lato">{errors.email}</p>}
            </div>

            {/* Phone (register only) */}
            {mode === "register" && (
              <div className={inputWrap}>
                <FaPhone className={iconClass} />
                <input
                  type="tel"
                  className={inputClass("phone")}
                  placeholder={t("auth.phone")}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1 font-lato">{errors.phone}</p>}
              </div>
            )}

            {/* Password */}
            <div className={inputWrap}>
              <FaLock className={iconClass} />
              <input
                type={showPass ? "text" : "password"}
                className={`${inputClass("password")} pr-10`}
                placeholder={t("auth.password")}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-400 transition-colors"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && <p className="text-red-400 text-xs mt-1 font-lato">{errors.password}</p>}
            </div>

            {/* Confirm Password (register only) */}
            {mode === "register" && (
              <div className={inputWrap}>
                <FaLock className={iconClass} />
                <input
                  type={showConfirm ? "text" : "password"}
                  className={`${inputClass("confirmPassword")} pr-10`}
                  placeholder={t("auth.confirm_password")}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-400 transition-colors"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1 font-lato">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-cinzel font-bold text-base py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/30 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin" />
                  Please wait...
                </span>
              ) : mode === "login" ? t("auth.login_btn") : t("auth.register_btn")}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-amber-900/20" />
            <span className="font-lato text-stone-600 text-xs">or</span>
            <div className="h-px flex-1 bg-amber-900/20" />
          </div>

          {/* Switch link */}
          <p className="text-center font-lato text-stone-400 text-sm">
            {mode === "login" ? t("auth.no_account") : t("auth.have_account")}{" "}
            <button
              onClick={() => { navigate(`/auth?mode=${mode === "login" ? "register" : "login"}`); setErrors({}); }}
              className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              {mode === "login" ? t("auth.register_link") : t("auth.login_link")}
            </button>
          </p>
        </div>

        {/* Decorative bottom text */}
        <p className="text-center font-lato text-stone-600 text-xs mt-6">
          🙏 Hara Hara Mahadeva · Om Nama Shivaya
        </p>
      </div>
    </div>
  );
};

export default Auth;
