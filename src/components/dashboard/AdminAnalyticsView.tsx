import React, { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BellRing,
  Building2,
  CalendarCheck,
  Car,
  CheckCircle2,
  Clock3,
  DollarSign,
  MoreHorizontal,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { apiGet } from '../../lib/api';

const formatMoney = (value: number, ar: boolean) => `${value.toLocaleString(ar ? 'ar-SA' : 'en-US', { maximumFractionDigits: 0 })} ${ar ? 'ر.س' : 'SAR'}`;

interface AdminAnalyticsViewProps {
  onOpenProfile?: () => void;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ onOpenProfile }) => {
  const { language, cars, userBookings, branches, roadsideTickets, usersList, currentUser, auditLogs } = useApp();
  const ar = language === 'ar';
  const [stats, setStats] = useState<any | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiGet<any>('/api/stats').then(data => { if (active) { setStats(data); setStatsError(null); } }).catch(err => { if (active) setStatsError(err?.message || 'Unable to load analytics'); });
    return () => { active = false; };
  }, []);

  const totalRevenue = Number(stats?.totalRevenue ?? 0);
  const activeRentals = Number(stats?.activeRentals ?? 0);
  const availableCars = Number(stats?.fleetStatusBreakdown?.find((x:any) => x.name === 'available')?.value ?? 0);
  const utilization = Number(stats?.occupancyRate ?? 0);
  const pendingSos = roadsideTickets.filter((t: any) => t.status === 'pending' || t.status === 'dispatched').length;
  const monthlyRevenueData = Array.isArray(stats?.monthlyTrends) ? stats.monthlyTrends.slice(-8).map((row:any) => ({
    month: row.month, revenue: Number(row.revenue || 0), bookings: 0
  })) : [];

  const kpis = [
    { title: ar ? 'إجمالي الإيرادات' : 'Total revenue', value: stats ? formatMoney(totalRevenue, ar) : '—', delta: null, icon: DollarSign, tone: 'violet', note: ar ? 'من بيانات السيرفر' : 'Server data' },
    { title: ar ? 'الحجوزات' : 'Bookings', value: userBookings.length.toLocaleString(ar ? 'ar-SA' : 'en-US'), delta: null, icon: CalendarCheck, tone: 'orange', note: ar ? 'من بيانات السيرفر' : 'Server data' },
    { title: ar ? 'السيارات المتاحة' : 'Available cars', value: availableCars.toLocaleString(ar ? 'ar-SA' : 'en-US'), delta: `${utilization}%`, icon: Car, tone: 'pink', note: ar ? 'نسبة التشغيل من السيرفر' : 'Server utilization' },
    { title: ar ? 'العملاء' : 'Customers', value: usersList.length.toLocaleString(ar ? 'ar-SA' : 'en-US'), delta: null, icon: Users, tone: 'blue', note: ar ? 'حسابات من السيرفر' : 'Server accounts' },
  ];

  const activities = auditLogs.slice(0, 4).map((log: any) => ({
    id: log.id, title: log.action, name: log.actor, amount: '—',
    time: log.timestamp ? new Date(log.timestamp).toLocaleTimeString(ar ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : '—',
    icon: CheckCircle2, type: log.category
  }));

  return (
    <div className="dashboard-overview space-y-5">
      <div className="dashboard-welcome-row">
        <div>
          <div className="dashboard-eyebrow">{ar ? 'نظرة سريعة على أعمالك اليوم' : 'A quick look at your business today'}</div>
          <h2>{ar ? 'صباح الخير 👋' : 'Good morning 👋'}</h2>
          <p>{ar ? 'تابع أداء الأسطول والحجوزات والإيرادات من مكان واحد.' : 'Monitor fleet, bookings and revenue from one place.'}</p>
        </div>
        <div className="dashboard-date-pill"><Clock3 size={16} />{new Date().toLocaleDateString(ar ? 'ar-SA' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
      </div>

      {statsError && <div className="dashboard-panel p-4 text-sm text-red-600">{ar ? `تعذر تحميل تحليلات السيرفر: ${statsError}` : `Server analytics failed: ${statsError}`}</div>}

      <div className="dashboard-kpi-grid">
        {kpis.map(({ title, value, delta, icon: Icon, tone, note }) => (
          <div className="dashboard-kpi-card" key={title}>
            <div className="dashboard-kpi-top">
              <div className={`dashboard-kpi-icon ${tone}`}><Icon size={20} /></div>
              <button type="button" className="dashboard-more"><MoreHorizontal size={18} /></button>
            </div>
            <div className="dashboard-kpi-title">{title}</div>
            <div className="dashboard-kpi-value">{value}</div>
            <div className="dashboard-kpi-footer">
              <span className="dashboard-growth">{delta != null ? <><ArrowUpRight size={14} />{delta}</> : (ar ? 'بيانات فعلية' : 'Live data')}</span>
              <span>{note}</span>
            </div>
            <div className="dashboard-kpi-progress"><span style={{ width: `${delta != null ? Math.min(92, Math.max(0, Number.parseInt(String(delta)) || 0)) : 100}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-revenue-panel">
          <div className="dashboard-panel-head">
            <div>
              <h3>{ar ? 'نظرة عامة على الأداء' : 'Performance overview'}</h3>
              <p>{ar ? 'الإيرادات والحجوزات خلال آخر 8 أشهر' : 'Revenue and bookings across the last 8 months'}</p>
            </div>
            <div className="dashboard-filter-pill"><BarChart3 size={15} />{ar ? 'آخر 8 أشهر' : 'Last 8 months'}</div>
          </div>
          <div className="dashboard-chart-meta">
            <div><span>{ar ? 'الإيرادات' : 'Revenue'}</span><strong>{formatMoney(totalRevenue, ar)}</strong></div>
            <div><span>{ar ? 'الحجوزات' : 'Bookings'}</span><strong>{userBookings.length}</strong></div>
            <div><span>{ar ? 'نسبة التشغيل' : 'Utilization'}</span><strong>{utilization}%</strong></div>
          </div>
          <div className="h-[300px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 15, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="rufqahRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4b3ca8" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#4b3ca8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eeeaf8" vertical={false} strokeDasharray="3 4" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8d88a7', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8d88a7', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 14, border: '1px solid #ebe8f6', boxShadow: '0 12px 35px rgba(47,37,105,.12)', fontSize: 12 }} formatter={(value: any) => [formatMoney(Number(value), ar), ar ? 'الإيرادات' : 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#4b3ca8" strokeWidth={3} fill="url(#rufqahRevenue)" dot={false} activeDot={{ r: 5, strokeWidth: 3, stroke: '#fff', fill: '#4b3ca8' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <aside className="dashboard-profile-card">
          <div className="dashboard-profile-card-head"><span>{ar ? 'ملف الحساب' : 'Account profile'}</span><MoreHorizontal size={19} /></div>
          <div className="dashboard-large-avatar">{(currentUser.fullName || 'A').charAt(0).toUpperCase()}</div>
          <h3>{ar ? 'مدير النظام' : 'System administrator'}</h3>
          <p>{currentUser.fullName || (ar ? 'إدارة وتشغيل المنصة' : 'Platform administration')}</p>
          <div className="dashboard-profile-stats">
            <div><strong>{userBookings.length}</strong><span>{ar ? 'حجز' : 'Bookings'}</span></div>
            <div><strong>{usersList.length}</strong><span>{ar ? 'عميل' : 'Customers'}</span></div>
            <div><strong>{branches.length}</strong><span>{ar ? 'فرع' : 'Branches'}</span></div>
          </div>
          <button type="button" className="dashboard-profile-cta" onClick={onOpenProfile}>{ar ? 'عرض الملف الشخصي' : 'View profile'}</button>
          <div className="dashboard-health"><CheckCircle2 size={17} /><div><strong>{ar ? 'كل الأنظمة تعمل' : 'All systems operational'}</strong><span>{ar ? 'آخر مزامنة منذ دقائق' : 'Synced a few minutes ago'}</span></div></div>
        </aside>
      </div>

      <div className="dashboard-bottom-grid">
        <section className="dashboard-panel dashboard-activity-panel">
          <div className="dashboard-panel-head"><div><h3>{ar ? 'آخر الأنشطة' : 'Recent activity'}</h3><p>{ar ? 'آخر العمليات المسجلة على المنصة' : 'Latest activity recorded on the platform'}</p></div><button type="button" className="dashboard-text-link">{ar ? 'عرض الكل' : 'View all'}</button></div>
          <div className="dashboard-activity-list">
            {activities.map((activity: any) => {
              const Icon = activity.icon;
              return <div className="dashboard-activity-row" key={activity.id}><div className="dashboard-activity-avatar"><Icon size={16} /></div><div className="min-w-0 flex-1"><strong>{activity.title}</strong><span>{activity.name}</span></div><div className="text-end"><strong>{activity.amount}</strong><span>{activity.time}</span></div><span className="dashboard-status-dot" /></div>;
            })}
          </div>
        </section>

        <section className="dashboard-campaign-card">
          <div className="dashboard-campaign-head"><span>{ar ? 'ملخص الأسطول' : 'Fleet summary'}</span><MoreHorizontal size={18} /></div>
          <div className="dashboard-donut-wrap">
            <div className="dashboard-donut" style={{ '--progress': `${Math.min(100, utilization)}%` } as React.CSSProperties}><div><strong>{utilization}%</strong><span>{ar ? 'تشغيل' : 'active'}</span></div></div>
          </div>
          <div className="dashboard-campaign-values"><div><span>{ar ? 'مؤجرة' : 'Rented'}</span><strong>{activeRentals}</strong></div><div><span>{ar ? 'متاحة' : 'Available'}</span><strong>{availableCars}</strong></div></div>
          <div className="dashboard-mini-bars">{[18, 28, 22, 35, 31, 44, 38, 52, 46, 58, 49, 65].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
          <div className="dashboard-alert-box">
            <div className="flex items-start gap-2"><ShieldCheck size={18} /><div><strong>{ar ? 'حالة التشغيل' : 'Operations health'}</strong><span>{pendingSos > 0 ? (ar ? `${pendingSos} بلاغات تحتاج متابعة` : `${pendingSos} alerts need attention`) : (ar ? 'لا توجد تنبيهات حرجة' : 'No critical alerts')}</span></div></div>
            {pendingSos > 0 ? <ArrowDownRight size={18} /> : <BellRing size={18} />}
          </div>
        </section>
      </div>

      <div className="dashboard-insight-strip">
        <div><Building2 size={18} /><span>{ar ? 'الفروع' : 'Branches'}</span><strong>{branches.length}</strong></div>
        <div><Car size={18} /><span>{ar ? 'إجمالي الأسطول' : 'Total fleet'}</span><strong>{cars.length}</strong></div>
        <div><Users size={18} /><span>{ar ? 'المستخدمون' : 'Users'}</span><strong>{usersList.length}</strong></div>
        <div><CheckCircle2 size={18} /><span>{ar ? 'الحالة' : 'Status'}</span><strong>{ar ? 'مستقر' : 'Stable'}</strong></div>
      </div>
    </div>
  );
};
