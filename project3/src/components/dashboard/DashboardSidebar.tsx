import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Building2,
  CalendarCheck,
  Car,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings2,
  ShieldCheck,
  Tag,
  Users,
  UserRound,
  Wrench,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/arafgha-logo.png';

interface DashboardSidebarProps {
  currentTab: string;
  onSelectTab: (tab: any) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const {
    language,
    activeRole,
    currentUser,
    cars,
    userBookings,
    roadsideTickets,
    corporateInquiries,
    contactMessages,
    usersList,
    branches,
    blogPosts,
    categories,
    navigateTo,
    logout,
  } = useApp() as any;

  const isRtl = language === 'ar';
  const pendingRoadside = roadsideTickets.filter((t: any) => t.status === 'pending' || t.status === 'dispatched').length;
  const pendingContact = (contactMessages as any[])?.filter((m: any) => m.status === 'new').length || 0;

  const groups = activeRole === 'admin'
    ? [
        {
          title: language === 'ar' ? 'الرئيسية' : 'Overview',
          items: [
            { id: 'analytics', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: LayoutDashboard },
            { id: 'fleet', label: language === 'ar' ? 'السيارات' : 'Fleet', icon: Car, count: cars.length },
            { id: 'bookings', label: language === 'ar' ? 'الحجوزات' : 'Bookings', icon: CalendarCheck, count: userBookings.length },
            { id: 'branches', label: language === 'ar' ? 'الفروع' : 'Branches', icon: Building2, count: branches.length },
            { id: 'profile', label: language === 'ar' ? 'الملف الشخصي' : 'Profile', icon: UserRound },
          ],
        },
        {
          title: language === 'ar' ? 'الإدارة' : 'Management',
          items: [
            { id: 'users', label: language === 'ar' ? 'العملاء والمستخدمون' : 'Users & Customers', icon: Users, count: usersList.length },
            { id: 'categories', label: language === 'ar' ? 'الماركات والتصنيفات' : 'Brands & Categories', icon: Tag, count: categories?.length },
            { id: 'corporate', label: language === 'ar' ? 'الشركات' : 'Corporate', icon: Award, count: corporateInquiries.length },
            { id: 'roadside', label: language === 'ar' ? 'الطوارئ والمساندة' : 'Roadside Support', icon: AlertTriangle, count: pendingRoadside, urgent: pendingRoadside > 0 },
          ],
        },
        {
          title: language === 'ar' ? 'المحتوى والنظام' : 'Content & System',
          items: [
            { id: 'blog', label: language === 'ar' ? 'المدونة' : 'Blog', icon: FileText, count: blogPosts.length },
            { id: 'contact', label: language === 'ar' ? 'الرسائل' : 'Messages', icon: Mail, count: pendingContact, urgent: pendingContact > 0 },
            { id: 'seo', label: language === 'ar' ? 'SEO والظهور' : 'SEO & Search', icon: Globe, badge: 'SEO' },
            { id: 'content', label: language === 'ar' ? 'محتوى الموقع' : 'Website Content', icon: FileText },
            { id: 'logs', label: language === 'ar' ? 'سجل الأمان' : 'Audit Logs', icon: ShieldCheck },
          ],
        },
      ]
    : activeRole === 'staff'
      ? [{ title: language === 'ar' ? 'عمليات الفرع' : 'Branch Operations', items: [{ id: 'staff-handover', label: language === 'ar' ? 'الفحص والتسليم' : 'Handover & Inspection', icon: Wrench }, { id: 'profile', label: language === 'ar' ? 'الملف الشخصي' : 'Profile', icon: UserRound }] }]
      : [{ title: language === 'ar' ? 'حسابي' : 'My Account', items: [{ id: 'user-portal', label: language === 'ar' ? 'حجوزاتي وحسابي' : 'My Rentals & Account', icon: CalendarCheck }, { id: 'profile', label: language === 'ar' ? 'الملف الشخصي' : 'Profile', icon: UserRound }] }];

  const select = (id: string) => {
    onSelectTab(id);
    if (isMobileOpen) onCloseMobile();
  };

  const content = (
    <div className="dashboard-sidebar h-full flex flex-col text-white">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="dashboard-logo-wrap">
            <img src={logoImg} alt="الرفقة" className="dashboard-logo" draggable={false} />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="min-w-0">
              <div className="text-[15px] font-black leading-none">الرفقة</div>
              <div className="text-[10px] text-white/55 mt-1">تأجير السيارات</div>
            </div>
          )}
          <button type="button" onClick={onCloseMobile} className="lg:hidden ms-auto dashboard-icon-btn" aria-label="إغلاق القائمة">
            <X size={18} />
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex dashboard-collapse-btn"
          title={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
        >
          {isCollapsed ? (isRtl ? <ChevronLeft size={15} /> : <ChevronRight size={15} />) : (isRtl ? <ChevronRight size={15} /> : <ChevronLeft size={15} />)}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 dashboard-scrollbar">
        {groups.map((group, gi) => (
          <div key={gi} className="mb-5">
            {(!isCollapsed || isMobileOpen) && <div className="dashboard-nav-label">{group.title}</div>}
            <div className="space-y-1.5">
              {group.items.map((item: any) => {
                const Icon = item.icon;
                const active = currentTab === item.id || (activeRole === 'staff' && item.id === 'staff-handover' && currentTab === 'analytics');
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => select(item.id)}
                    title={isCollapsed && !isMobileOpen ? item.label : undefined}
                    className={`dashboard-nav-item ${active ? 'is-active' : ''}`}
                  >
                    <span className="dashboard-nav-icon"><Icon size={18} strokeWidth={active ? 2.4 : 2} /></span>
                    {(!isCollapsed || isMobileOpen) && <span className="truncate flex-1 text-start">{item.label}</span>}
                    {(!isCollapsed || isMobileOpen) && item.badge && <span className="dashboard-nav-badge">{item.badge}</span>}
                    {(!isCollapsed || isMobileOpen) && item.count !== undefined && <span className={`dashboard-nav-count ${item.urgent ? 'urgent' : ''}`}>{item.count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-4 space-y-2">
        <button type="button" onClick={() => navigateTo('home')} className="dashboard-bottom-btn">
          {isRtl ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
          {(!isCollapsed || isMobileOpen) && <span>{language === 'ar' ? 'الواجهة العامة' : 'Website'}</span>}
        </button>
        <button
          type="button"
          onClick={async () => { await logout(); navigateTo('home'); }}
          className="dashboard-bottom-btn dashboard-logout"
        >
          <LogOut size={17} />
          {(!isCollapsed || isMobileOpen) && <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign out'}</span>}
        </button>

        <div className="dashboard-user-mini">
          <div className="dashboard-avatar">{(currentUser?.fullName || 'U').charAt(0)}</div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-extrabold truncate">{currentUser?.fullName || 'User'}</div>
              <div className="text-[10px] text-white/45 truncate">{currentUser?.email || ''}</div>
            </div>
          )}
          {(!isCollapsed || isMobileOpen) && <Settings2 size={15} className="text-white/35" />}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className={`dashboard-sidebar-host hidden lg:flex fixed top-0 bottom-0 ${isRtl ? 'right-0' : 'left-0'} z-40 flex-col ${isCollapsed ? 'w-[92px]' : 'w-[276px]'}`}>
        {content}
      </aside>
      <div className={`hidden lg:block shrink-0 ${isCollapsed ? 'w-[92px]' : 'w-[276px]'}`} aria-hidden />
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button type="button" className="absolute inset-0 bg-[#19134b]/55 backdrop-blur-sm" onClick={onCloseMobile} aria-label="إغلاق القائمة" />
          <aside className={`absolute top-0 bottom-0 ${isRtl ? 'right-0' : 'left-0'} w-[290px] max-w-[88vw] shadow-2xl`}>
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
