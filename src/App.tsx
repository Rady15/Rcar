import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CarDetailModal } from './components/CarDetailModal';
import { BookingWizard } from './components/BookingWizard';
import { RoadsideAssistanceModal } from './components/RoadsideAssistanceModal';
import { LiveChatWidget, ToastContainer } from './components/LiveChatWidget';
import { SeoHead } from './components/SeoHead';
import { PageTransition } from './components/PageTransition';
import { CarLoader } from './components/CarLoader';

// Views
import { HomeView } from './views/HomeView';
import { FleetView } from './views/FleetView';
import { BranchesView } from './views/BranchesView';
import { OffersView } from './views/OffersView';
import { CorporateView } from './views/CorporateView';
import { SubscriptionView } from './views/SubscriptionView';
import { UsedCarsView } from './views/UsedCarsView';
import { LoyaltyView } from './views/LoyaltyView';
import { ManageBookingView } from './views/ManageBookingView';
import { AboutView } from './views/AboutView';
import { FaqView } from './views/FaqView';
import { ContactView } from './views/ContactView';
import { BlogView } from './views/BlogView';
import { DashboardView } from './views/DashboardView';
import { LoginView } from './views/LoginView';

const AppContent: React.FC = () => {
  const { currentPage, authLoading, isAuthenticated, navigateTo, language } = useApp();
  React.useEffect(() => {
    if (!authLoading && currentPage === 'dashboard' && !isAuthenticated) navigateTo('login');
  }, [authLoading, currentPage, isAuthenticated, navigateTo]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-stone-900 selection:bg-[#C9922C] selection:text-white">
      {/* Global Dynamic SEO Head & Schema Injector */}
      <SeoHead />

      {/* Top Sticky Header */}
      {currentPage !== 'dashboard' && currentPage !== 'login' && <Navbar />}

      {/* Main Page Content Body */}
      <PageTransition pageKey={currentPage} className="flex-1">
        {currentPage === 'login' && <LoginView />}
        {currentPage === 'home' && <HomeView />}
        {currentPage === 'fleet' && <FleetView />}
        {currentPage === 'branches' && <BranchesView />}
        {currentPage === 'offers' && <OffersView />}
        {currentPage === 'corporate' && <CorporateView />}
        {currentPage === 'subscription' && <SubscriptionView />}
        {currentPage === 'used-cars' && <UsedCarsView />}
        {currentPage === 'loyalty' && <LoyaltyView />}
        {currentPage === 'manage-booking' && <ManageBookingView />}
        {currentPage === 'about' && <AboutView />}
        {currentPage === 'faq' && <FaqView />}
        {currentPage === 'contact' && <ContactView />}
        {currentPage === 'blog' && <BlogView />}
        {currentPage === 'dashboard' && (authLoading ? <CarLoader size={78} text={language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading dashboard...'} /> : isAuthenticated ? <DashboardView /> : <LoginView />)}
      </PageTransition>

      {/* Global Footer */}
      {currentPage !== 'dashboard' && currentPage !== 'login' && <Footer />}

      {/* Interactive Global Overlays & Modals */}
      <CarDetailModal />
      <BookingWizard />
      <RoadsideAssistanceModal />
      <LiveChatWidget />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
