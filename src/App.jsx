import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./components/AuthContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ViewDetails from "./pages/ViewDetails";
import Homepage from "./pages/Homepage";
import Newspage from "./pages/Newspage";
import EducationList from "./pages/Education";
import OurCustomers from "./pages/OurCustomers";
import Games from "./components/Games";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobsPage from "./pages/JobsPage";
import RadioPage from "./pages/RadioPage";
import Education from "./pages/Education";
import BuyandSale from "./pages/BuyandSale";
import QuickLinks from "./pages/QuickLinks";
import TuljapurHome from "./pages/TuljapurHome";
import PandharpurHome from "./pages/PandharpurHome";
import AkkalkotHome from "./pages/AkkalkotHome";
import UserProfile from "./pages/UserProfile";
import FirmAdd from "./pages/FirmAdd";
import FeedbackFormPage from "./pages/FeedbackForm";
import SearchBar from "./pages/SearchBar";
import CategoryDetails from "./pages/CategoryDetails";
import FirmDetails from "./pages/FirmDetails";
import SearchResults from "./pages/SearchResult";

const App = () => {
  return (
    <BrowserRouter >
      <AuthProvider>
        <Navbar />

        {/* Responsive layout */}
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
          {/* Main content takes full width on mobile, shares space on desktop */}
          <main className="flex-1 md:w-3/4">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/tuljapur" element={<TuljapurHome />} />
              <Route path="/pandharpur" element={<PandharpurHome />} />
              <Route path="/akkalkot" element={<AkkalkotHome />} />
              <Route path="/news" element={<Newspage />} />

              {/* Use /search for SearchBar component */}
              <Route path="/search" element={<SearchResults  />} />
              
              {/* If you want a dedicated page for search results */}
              <Route path="/search-results" element={<SearchResults />} />

              {/* Education page — did you mean to reuse SearchBar? If so, okay */}
              <Route path="/education" element={<Education/>} />

              <Route path="/feedback" element={<FeedbackFormPage />} />
              <Route path="/our-customer" element={<OurCustomers />} />
              <Route path="/category-details" element={<CategoryDetails />} />
              <Route path="/onlinegames" element={<Games />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/view/:firmId" element={<ViewDetails />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/onlineradio" element={<RadioPage />} />
              <Route path="/firmadd" element={<FirmAdd />} />
              <Route path="/firm/:firmId" element={<FirmDetails />} />
              {/* Double-check if this is intended */}
              <Route path="/jobs/:id" element={<FirmDetails />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/buysandsales" element={<BuyandSale />} />
            </Routes>
          </main>

          {/* Sidebar - visible only on medium screens and up */}
          <div className="hidden md:block w-1/4">
            <Sidebar />
          </div>
        </div>

        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
