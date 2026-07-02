import React, { useState, useEffect } from "react";
import { PageType, User } from "./types";
import ParticleBackground from "./components/ParticleBackground";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Confetti from "./components/Confetti";
import LandingPage from "./components/LandingPage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import ThankYouPage from "./components/ThankYouPage";
import DashboardPage from "./components/DashboardPage";
import { LegalPages } from "./components/LegalPages";
import { AboutContactPages } from "./components/AboutContactPages";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("LANDING");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Load saved user state from server using token in LocalStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("gamevault_token");
    if (token) {
      setIsVerifying(true);
      fetch("/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Session expired");
      })
      .then(data => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
          setCurrentPage("DASHBOARD");
        } else {
          handleLogout();
        }
      })
      .catch(err => {
        console.error("Token verification failed:", err);
        handleLogout();
      })
      .finally(() => {
        setIsVerifying(false);
      });
    }
  }, []);

  const handleLoginSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    localStorage.setItem("gamevault_token", token);
    setCurrentPage("DASHBOARD");
  };

  const handleUpdateUser = (updatedUser: User | null) => {
    setCurrentUser(updatedUser);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("gamevault_token");
    setCurrentPage("LANDING");
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => {
      setConfettiActive(false);
    }, 6000);
  };

  // Keep scroll focused at the top on route transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Support direct page transition helper from navbar
  const handleSetCurrentPage = (page: PageType) => {
    if (page === "CLAIM_PRIZES") {
      if (currentUser) {
        setCurrentPage("DASHBOARD");
        // Force tab redirection internally inside Dashboard component by tricking state slightly
        // We will make DashboardPage look for activeTab if we pass or update something, but let's
        // just set page to "DASHBOARD" and have Dashboard check or defaults to Spin, 
        // actually let's implement a clean redirection state or directly route!
        setTimeout(() => {
          const tabBtn = document.querySelector('[data-tab-wallet]') as HTMLButtonElement;
          if (tabBtn) tabBtn.click();
        }, 150);
      } else {
        setCurrentPage("LOGIN");
      }
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative font-sans select-none antialiased overflow-x-hidden">
      
      {/* 3D Cosmic Particle Background */}
      <ParticleBackground />

      {/* Confetti celebration layers */}
      <Confetti active={confettiActive} />

      {/* Futuristic Game Header Navigation */}
      <Navigation
        currentPage={currentPage}
        setCurrentPage={handleSetCurrentPage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main content body view */}
      <main className="flex-grow flex flex-col justify-center py-6">
        
        {currentPage === "LANDING" && (
          <LandingPage 
            setCurrentPage={handleSetCurrentPage} 
            currentUser={currentUser}
          />
        )}

        {currentPage === "REGISTER" && (
          <RegisterPage
            setCurrentPage={handleSetCurrentPage}
            onRegisterSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === "LOGIN" && (
          <LoginPage
            setCurrentPage={handleSetCurrentPage}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === "THANK_YOU" && (
          <ThankYouPage
            setCurrentPage={handleSetCurrentPage}
            currentUser={currentUser}
          />
        )}

        {currentPage === "DASHBOARD" && (
          <DashboardPage
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            setCurrentPage={handleSetCurrentPage}
            triggerConfetti={triggerConfetti}
          />
        )}

        {(currentPage === "PRIVACY" || currentPage === "TERMS") && (
          <LegalPages 
            type={currentPage} 
            setCurrentPage={handleSetCurrentPage} 
          />
        )}

        {(currentPage === "ABOUT" || currentPage === "CONTACT") && (
          <AboutContactPages
            type={currentPage}
            setCurrentPage={handleSetCurrentPage}
          />
        )}

      </main>

      {/* Compliant Dark Footer */}
      <Footer setCurrentPage={handleSetCurrentPage} />

    </div>
  );
}
