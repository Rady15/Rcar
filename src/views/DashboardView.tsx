import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Car, BookingDetails } from '../types';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { AdminAnalyticsView } from '../components/dashboard/AdminAnalyticsView';
import { AdminFleetView } from '../components/dashboard/AdminFleetView';
import { AdminBookingsView } from '../components/dashboard/AdminBookingsView';
import { AdminUsersView } from '../components/dashboard/AdminUsersView';
import { AdminBranchesView } from '../components/dashboard/AdminBranchesView';
import { AdminRoadsideView } from '../components/dashboard/AdminRoadsideView';
import { AdminCorporateView } from '../components/dashboard/AdminCorporateView';
import { AdminBlogManagerView } from '../components/dashboard/AdminBlogManagerView';
import { AdminContactView } from '../components/dashboard/AdminContactView';
import { AdminSEOView } from '../components/dashboard/AdminSEOView';
import { AdminAuditLogsView } from '../components/dashboard/AdminAuditLogsView';
import { AdminContentView } from '../components/dashboard/AdminContentView';
import { AdminCategoriesView } from '../components/dashboard/AdminCategoriesView';
import { StaffCounterView } from '../components/dashboard/StaffCounterView';
import { CustomerPortalView } from '../components/dashboard/CustomerPortalView';
import { AdminProfileView } from '../components/dashboard/AdminProfileView';
import { SectionReveal } from '../components/SectionReveal';
import { CarLoader } from '../components/CarLoader';
import { apiGet } from '../lib/api';
import {
  AddCarModal,
  AddUserModal,
  AddBranchModal,
  InvoiceModal,
  InspectionModal
} from '../components/dashboard/Modals';

export const DashboardView: React.FC = () => {
  const { activeRole, language, navigateTo } = useApp();
  const [authChecking, setAuthChecking] = useState(true);

  // Sidebar navigation state
  const [currentTab, setCurrentTab] = useState<string>('analytics');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Modals state
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [invoiceBooking, setInvoiceBooking] = useState<BookingDetails | null>(null);
  const [inspectionBooking, setInspectionBooking] = useState<BookingDetails | null>(null);
  const [inspectionType, setInspectionType] = useState<'pickup' | 'return'>('pickup');

  useEffect(() => {
    let alive=true;
    const t = setTimeout(()=>{ if(alive){ setAuthChecking(false); navigateTo('login'); } }, 7000);
    apiGet('/api/auth/me').then(()=>{ if(alive){ clearTimeout(t); setAuthChecking(false);} }).catch(()=>{ if(alive){ clearTimeout(t); setAuthChecking(false); navigateTo('login'); } });
    return ()=>{alive=false; clearTimeout(t);};
  }, []);
  if(authChecking) return <div className="min-h-[70vh] bg-white flex items-center justify-center"><CarLoader size={72} text={language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading dashboard...'} /></div>;

  // Open Handlers
  const handleOpenAddCar = () => {
    setEditingCar(null);
    setIsAddCarModalOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setIsAddCarModalOpen(true);
  };

  const handleOpenInspection = (booking: BookingDetails, type: 'pickup' | 'return') => {
    setInspectionBooking(booking);
    setInspectionType(type);
  };

  return (
    <div className="dashboard-shell h-screen overflow-hidden bg-[#f8f7fc] text-stone-900 flex antialiased selection:bg-[#5a4bc0] selection:text-white">
      <div className="flex-1 flex overflow-hidden bg-[#f8f7fc] h-screen">
        <DashboardSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area - خلفية بيضاء */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f8f7fc]">
          {/* Modern Top Header Bar */}
          <DashboardHeader
            currentTab={
              activeRole === 'staff'
                ? (currentTab === 'profile' ? 'profile' : 'staff-handover')
                : activeRole === 'user'
                ? (currentTab === 'profile' ? 'profile' : 'user-portal')
                : currentTab
            }
            onSelectTab={setCurrentTab}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onOpenAddCarModal={handleOpenAddCar}
            searchQuery={globalSearchQuery}
            onSearchChange={setGlobalSearchQuery}
          />

          {/* Body Content Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-7 w-full mx-auto space-y-5">
            <SectionReveal>
              {/* Super Admin Tabs */}
              {activeRole === 'admin' && (
                <>
                  {currentTab === 'analytics' && <AdminAnalyticsView onOpenProfile={() => setCurrentTab('profile')} />}
                  {currentTab === 'fleet' && (
                    <AdminFleetView
                      onOpenAddCarModal={handleOpenAddCar}
                      onEditCar={handleEditCar}
                    />
                  )}
                  {currentTab === 'bookings' && (
                    <AdminBookingsView
                      onViewInvoice={setInvoiceBooking}
                      onOpenInspection={handleOpenInspection}
                    />
                  )}
                  {currentTab === 'users' && (
                    <AdminUsersView onOpenAddUserModal={() => setIsAddUserModalOpen(true)} />
                  )}
                  {currentTab === 'branches' && (
                    <AdminBranchesView onOpenAddBranchModal={() => setIsAddBranchModalOpen(true)} />
                  )}
                  {currentTab === 'roadside' && <AdminRoadsideView />}
                  {currentTab === 'corporate' && <AdminCorporateView />}
                  {currentTab === 'contact' && <AdminContactView />}
                  {currentTab === 'blog' && <AdminBlogManagerView />}
                  {currentTab === 'seo' && <AdminSEOView />}
                  {currentTab === 'categories' && <AdminCategoriesView />}
                  {currentTab === 'content' && <AdminContentView />}
                  {currentTab === 'logs' && <AdminAuditLogsView />}
                  {currentTab === 'profile' && <AdminProfileView />}
                </>
              )}

              {/* Branch Staff Tab */}
              {activeRole === 'staff' && (
                currentTab === 'profile' ? (
                  <AdminProfileView />
                ) : (
                  <StaffCounterView
                    onOpenInspection={handleOpenInspection}
                    onViewInvoice={setInvoiceBooking}
                  />
                )
              )}

              {/* Customer Self-Service Portal Tab */}
              {activeRole === 'user' && (
                currentTab === 'profile' ? (
                  <AdminProfileView />
                ) : (
                  <CustomerPortalView onViewInvoice={setInvoiceBooking} />
                )
              )}
            </SectionReveal>
          </main>
        </div>
      </div>

      {/* Unified High-Fidelity Dialog Modals */}
      <AddCarModal
        isOpen={isAddCarModalOpen}
        onClose={() => {
          setIsAddCarModalOpen(false);
          setEditingCar(null);
        }}
        carToEdit={editingCar}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />

      <AddBranchModal
        isOpen={isAddBranchModalOpen}
        onClose={() => setIsAddBranchModalOpen(false)}
      />

      <InvoiceModal
        booking={invoiceBooking}
        onClose={() => setInvoiceBooking(null)}
      />

      <InspectionModal
        booking={inspectionBooking}
        type={inspectionType}
        onClose={() => setInspectionBooking(null)}
      />
    </div>
  );
};

