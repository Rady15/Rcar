import React, { useMemo, useState } from 'react';
import {
  Bell,
  CalendarCheck,
  CalendarDays,
  CheckCheck,
  ChevronDown,
  Mail,
  Menu,
  Plus,
  Search,
  AlertTriangle,
  Building2,
  Users,
  UserRound,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DashboardHeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMobileSidebar: () => void;
  onOpenAddCarModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

interface NotifItem {
  id: string;
  kind: 'booking' | 'contact' | 'roadside' | 'corporate' | 'user';
  icon: typeof Bell;
  title: string;
  subtitle: string;
  time: string;
  tab: string;
  urgent: boolean;
}

const relTime = (iso: string, ar: boolean): string => {
  const ms = Date.now() - new Date(iso).getTime();
  if (isNaN(ms) || ms <= 0) return '';
  const m = Math.floor(ms / 60000);
  if (m < 1) return ar ? 'الآن' : 'now';
  if (m < 60) return ar ? `قبل ${m} دقيقة` : `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return ar ? `قبل ${h} ساعة` : `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return ar ? `قبل ${d} يوم` : `${d}d ago`;
  return new Date(iso).toLocaleDateString(ar ? 'ar-SA' : 'en-US', { day: 'numeric', month: 'short' });
};

const readStorageKey = (userId: string) => `rufqah_notif_read_${userId}`;
const loadReadIds = (userId: string): string[] => {
  try { return JSON.parse(localStorage.getItem(readStorageKey(userId)) || '[]'); } catch { return []; }
};
const persistReadIds = (userId: string, ids: string[]) => {
  try { localStorage.setItem(readStorageKey(userId), JSON.stringify(ids)); } catch { /* noop */ }
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileSidebar,
  onOpenAddCarModal,
  searchQuery,
  onSearchChange,
}) => {
  const { language, activeRole, currentUser, cars, userBookings, contactMessages, roadsideTickets, corporateInquiries, usersList, logout } = useApp() as any;
  const ar = language === 'ar';
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const titles: Record<string, string> = {
    analytics: ar ? 'نظرة عامة' : 'Overview',
    fleet: ar ? 'إدارة الأسطول' : 'Fleet Management',
    bookings: ar ? 'الحجوزات' : 'Bookings',
    users: ar ? 'المستخدمون والعملاء' : 'Users & Customers',
    branches: ar ? 'الفروع' : 'Branches',
    categories: ar ? 'الماركات والتصنيفات' : 'Brands & Categories',
    roadside: ar ? 'الطوارئ والمساندة' : 'Roadside Support',
    corporate: ar ? 'الشركات' : 'Corporate',
    contact: ar ? 'الرسائل' : 'Messages',
    blog: ar ? 'المدونة' : 'Blog',
    seo: ar ? 'SEO والظهور' : 'SEO & Search',
    logs: ar ? 'سجل الأمان' : 'Audit Logs',
    profile: ar ? 'الملف الشخصي' : 'Profile',
    'staff-handover': ar ? 'الفحص والتسليم' : 'Handover & Inspection',
    'user-portal': ar ? 'حجوزاتي وحسابي' : 'My Rentals',
  };
  const title = titles[currentTab] || (ar ? 'لوحة التحكم' : 'Dashboard');

  const notifications: NotifItem[] = useMemo(() => {
    const list: NotifItem[] = [];
    (userBookings || [])
      .filter((b: any) => ['confirmed', 'active', 'return_pending'].includes(b.status))
      .forEach((b: any) => {
        list.push({
          id: `bk:${b.bookingId}`,
          kind: 'booking',
          icon: CalendarCheck,
          title: ar ? `حجز جديد #${b.bookingId}` : `New booking #${b.bookingId}`,
          subtitle: b.customer?.fullName || b.customer?.phone || '',
          time: b.createdAt,
          tab: 'bookings',
          urgent: false
        });
      });
    (contactMessages || [])
      .filter((m: any) => m.status === 'new')
      .forEach((m: any) => {
        list.push({
          id: `co:${m.id}`,
          kind: 'contact',
          icon: Mail,
          title: ar ? `رسالة جديدة من ${m.name}` : `New message from ${m.name}`,
          subtitle: m.subject || m.message || '',
          time: m.createdAt,
          tab: 'contact',
          urgent: true
        });
      });
    (corporateInquiries || [])
      .filter((c: any) => c.status === 'new')
      .forEach((c: any) => {
        list.push({
          id: `cp:${c.id}`,
          kind: 'corporate',
          icon: Building2,
          title: ar ? `طلب تعاقد من ${c.companyName}` : `Corporate inquiry: ${c.companyName}`,
          subtitle: c.contactPerson || '',
          time: c.createdAt,
          tab: 'corporate',
          urgent: false
        });
      });
    (roadsideTickets || [])
      .filter((t: any) => ['pending', 'dispatched', 'in_progress'].includes(t.status))
      .forEach((t: any) => {
        list.push({
          id: `rs:${t.id}`,
          kind: 'roadside',
          icon: AlertTriangle,
          title: ar ? `بلاغ مساندة ${t.ticketNumber}` : `Roadside ticket ${t.ticketNumber}`,
          subtitle: `${t.callerName || ''} · ${t.carModel || ''}`,
          time: t.createdAt,
          tab: 'roadside',
          urgent: t.priority === 'critical' || t.priority === 'high'
        });
      });
    if (activeRole === 'admin') {
      const cutoff = Date.now() - 72 * 3600 * 1000;
      (usersList || [])
        .filter((u: any) => u.role === 'user' && new Date(u.createdAt).getTime() > cutoff)
        .forEach((u: any) => {
          list.push({
            id: `us:${u.id}`,
            kind: 'user',
            icon: Users,
            title: ar ? `عميل جديد: ${u.fullName}` : `New customer: ${u.fullName}`,
            subtitle: u.phone || u.email || '',
            time: u.createdAt,
            tab: 'users',
            urgent: false
          });
        });
    }
    return list
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 14);
  }, [language, activeRole, userBookings, contactMessages, corporateInquiries, roadsideTickets, usersList]);

  const readIds = loadReadIds(currentUser?.id || 'anon');
  const unread = notifications.filter((n) => !readIds.includes(n.id));
  const unreadCount = unread.length;

  const handleMarkAllRead = () => {
    const combined = Array.from(new Set([...readIds, ...notifications.map((n) => n.id)]));
    persistReadIds(currentUser?.id || 'anon', combined);
  };

  const handleOpenNotif = (n: NotifItem) => {
    persistReadIds(currentUser?.id || 'anon', Array.from(new Set([...loadReadIds(currentUser?.id || 'anon'), n.id])));
    setNotifOpen(false);
    onSelectTab(n.tab);
  };

  return (
    <header className="dashboard-header sticky top-0 z-30">
      <div className="dashboard-header-inner">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={onOpenMobileSidebar} className="dashboard-mobile-menu lg:hidden" aria-label="فتح القائمة"><Menu size={20} /></button>
          <div className="hidden sm:block min-w-0">
            <div className="dashboard-header-kicker">{ar ? 'لوحة إدارة الرفقة' : 'Al Rufqah Control Center'}</div>
            <h1 className="dashboard-header-title truncate">{title}</h1>
          </div>
        </div>

        <div className="dashboard-search-wrap">
          <Search size={18} className="text-[#8c87a6] shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={ar ? 'ابحث في لوحة التحكم...' : 'Search dashboard...'}
            aria-label={ar ? 'بحث' : 'Search'}
          />
          <kbd>⌘ K</kbd>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {activeRole === 'admin' && (
            <button type="button" onClick={onOpenAddCarModal} className="dashboard-primary-action">
              <Plus size={17} />
              <span className="hidden md:inline">{ar ? 'إضافة سيارة' : 'Add car'}</span>
            </button>
          )}
          <button type="button" className="dashboard-header-icon"><CalendarDays size={18} /></button>

          <div className="relative">
            <button
              type="button"
              className="dashboard-header-icon relative"
              onClick={() => setNotifOpen((v) => !v)}
              aria-label={ar ? 'الإشعارات' : 'Notifications'}
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="dashboard-notification-dot">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
            {notifOpen && (
              <div className="absolute end-0 top-[calc(100%+10px)] w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-[#ece9f7] overflow-hidden z-[50]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#ece9f7]">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-black text-[#252047]">{ar ? 'الإشعارات' : 'Notifications'}</strong>
                    {unreadCount > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-black">{unreadCount}</span>}
                  </div>
                  {unreadCount > 0 && (
                    <button type="button" onClick={handleMarkAllRead} className="flex items-center gap-1 text-[10px] font-black text-[#42339b] hover:underline">
                      <CheckCheck size={13} />
                      {ar ? 'قراءة الكل' : 'Read all'}
                    </button>
                  )}
                </div>
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-[#8c87a6]">
                      {ar ? 'لا توجد إشعارات حالياً' : 'No notifications yet'}
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const Icon = n.icon;
                      const isRead = readIds.includes(n.id);
                      return (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => handleOpenNotif(n)}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-start transition-colors hover:bg-[#f8f7fc] ${isRead ? 'opacity-60' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.urgent ? 'bg-rose-500/10 text-rose-600' : n.kind === 'booking' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-[#42339b]/10 text-[#42339b]'}`}>
                            <Icon size={15} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-black text-[#252047] truncate">{n.title}</div>
                            <div className="text-[11px] text-[#8c87a6] truncate">{n.subtitle}</div>
                            <div className="text-[10px] text-[#b4afc8] mt-0.5">{relTime(n.time, ar)}</div>
                          </div>
                          {!isRead && <span className="w-2 h-2 rounded-full bg-[#42339b] mt-1.5 shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="dashboard-profile-wrap">
            <button type="button" className="dashboard-profile" onClick={() => setProfileOpen((v) => !v)}>
              <div className="dashboard-profile-avatar">{(currentUser?.fullName || 'U').charAt(0)}</div>
              <div className="hidden md:block text-start min-w-0">
                <div className="text-xs font-black text-[#252047] truncate">{currentUser?.fullName || 'User'}</div>
                <div className="text-[10px] text-[#8c87a6]">{activeRole === 'admin' ? (ar ? 'مدير النظام' : 'Administrator') : activeRole}</div>
              </div>
              <ChevronDown size={15} className="text-[#77718f]" />
            </button>
            {profileOpen && (
              <div className="dashboard-profile-menu">
                <div className="px-3 py-2 border-b border-[#ece9f7]"><div className="text-xs font-black">{currentUser?.fullName}</div><div className="text-[10px] text-[#8c87a6] mt-1">{currentUser?.email}</div></div>
                <div className="px-3 py-2 text-xs text-[#6d6887]">{ar ? `${cars.length} سيارة • ${userBookings.length} حجز` : `${cars.length} cars • ${userBookings.length} bookings`}</div>
                <button type="button" onClick={() => { setProfileOpen(false); onSelectTab('profile'); }} className="dashboard-profile-menu-btn">
                  <UserRound size={14} />
                  {ar ? 'عرض الملف الشخصي' : 'View profile'}
                </button>
                <button type="button" onClick={logout} className="dashboard-profile-menu-btn text-rose-600">
                  <LogOut size={14} />
                  {ar ? 'تسجيل الخروج' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};