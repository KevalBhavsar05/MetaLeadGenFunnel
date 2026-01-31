import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AffiliateMarketingLandingPage from "./pages/AffiliateMarketingLandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import Meeting from "./pages/Meeting";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./routes/ProtectedRoute";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Protected routes */}
        <Route path="admin" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
        {/* Public routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/" element={<AffiliateMarketingLandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/term-of-service" element={<TermsOfService />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
