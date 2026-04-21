import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import HistoryDrawer from "./components/HistoryDrawer/HistoryDrawer.jsx";
import Home from "./pages/Home/Home.jsx";
import Temples from "./pages/Temples/Temples.jsx";
import TempleDetail from "./pages/TempleDetail/TempleDetail.jsx";
import Team from "./pages/Team/Team.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import "./i18n/i18n.js";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <div className="flex flex-col min-h-screen bg-stone-950">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/temples" element={<Temples />} />
                <Route path="/temples/:id" element={<TempleDetail />} />
                <Route path="/team" element={<Team />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <HistoryDrawer />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1c1917",
                color: "#e7e5e4",
                border: "1px solid rgba(201,136,10,0.3)",
                fontFamily: "Lato, sans-serif",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#c9880a", secondary: "#1c1917" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#1c1917" } },
            }}
          />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
