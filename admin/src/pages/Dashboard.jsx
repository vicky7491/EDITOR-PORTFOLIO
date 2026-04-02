import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import axiosAdmin from '@/api/axiosAdmin';
import StatsCard   from '@/components/ui/StatsCard';
import { useAuth } from '@/context/AuthContext';

// Month name helper
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                 'Jul','Aug','Sep','Oct','Nov','Dec'];

// SVG icons (inline)
const Icon = ({ d, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
       className="w-5 h-5" {...props}>
    <path d={d}/>
  </svg>
);

// Recharts custom tooltip
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-800 border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const PIE_COLORS = ['#8b5cf6','#0ea5e9','#10b981','#f59e0b','#ef4444','#ec4899'];

const Dashboard = () => {
  const { admin } = useAuth();
  const navigate  = useNavigate();

  const [stats,    setStats]    = useState(null);
  const [activity, setActivity] = useState(null);
  const [charts,   setCharts]   = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, a, c] = await Promise.all([
          axiosAdmin.get('/api/admin/dashboard/stats'),
          axiosAdmin.get('/api/admin/dashboard/activity'),
          axiosAdmin.get('/api/admin/dashboard/charts'),
        ]);
        setStats(s.data.data);
        setActivity(a.data.data);
        setCharts(c.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Format monthly chart data for Recharts
  const monthlyData = charts?.monthlyInquiries?.map((d) => ({
    name:       MONTHS[d.month - 1],
    Inquiries:  d.count,
  })) || [];

  const projectMonthly = charts?.monthlyProjects?.map((d) => ({
    name:     MONTHS[d.month - 1],
    Projects: d.count,
  })) || [];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card p-5 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-semibold text-slate-100">
            Welcome back 👋
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">{admin?.email}</p>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/projects/new')}
            className="btn-primary text-xs py-2"
          >
            + New Project
          </button>
          <button
            onClick={() => navigate('/admin/videos/upload')}
            className="btn-secondary text-xs py-2"
          >
            + Upload Video
          </button>
        </div>
      </motion.div>

      {/* ── Stats grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Projects"
          value={stats?.projects.total ?? 0}
          sub={`${stats?.projects.published} published · ${stats?.projects.draft} draft`}
          color="brand"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-5 h-5">
              <rect x="2" y="7" width="20" height="15" rx="2"/>
              <polyline points="17 2 12 7 7 2"/>
            </svg>
          }
        />
        <StatsCard
          label="Total Videos"
          value={stats?.videos.total ?? 0}
          sub={`${stats?.videos.featured} featured`}
          color="purple"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-5 h-5">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          }
        />
        <StatsCard
          label="Categories"
          value={stats?.categories.total ?? 0}
          color="blue"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-5 h-5">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          }
        />
        <StatsCard
          label="Services"
          value={stats?.services.total ?? 0}
          sub={`${stats?.services.active} active`}
          color="green"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-5 h-5">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          }
        />
        <StatsCard
          label="Testimonials"
          value={stats?.testimonials.total ?? 0}
          color="amber"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-5 h-5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02
                               12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          }
        />
        <StatsCard
          label="Total Inquiries"
          value={stats?.inquiries.total ?? 0}
          color="blue"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-5 h-5">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          }
        />
        <StatsCard
          label="Unread Inquiries"
          value={stats?.inquiries.unread ?? 0}
          color={stats?.inquiries.unread > 0 ? 'red' : 'green'}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-5 h-5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          }
        />
        <StatsCard
          label="Active Services"
          value={stats?.services.active ?? 0}
          color="green"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-5 h-5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          }
        />
      </div>

      {/* ── Charts row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Monthly inquiries line chart */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">
            Monthly inquiries (last 6 months)
          </h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }}
                       axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }}
                       axisLine={false} tickLine={false} allowDecimals={false}/>
                <Tooltip content={<ChartTooltip />}/>
                <Line type="monotone" dataKey="Inquiries" stroke="#8b5cf6"
                      strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }}
                      activeDot={{ r: 5 }}/>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-600 text-sm">
              No data yet
            </div>
          )}
        </div>

        {/* Projects by category pie chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">
            Projects by category
          </h3>
          {charts?.projectsByCategory?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={charts.projectsByCategory}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {charts.projectsByCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />}/>
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="mt-3 space-y-1.5">
                {charts.projectsByCategory.slice(0, 4).map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full"
                           style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}/>
                      <span className="text-xs text-slate-400 truncate max-w-[100px]">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-300">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-600 text-sm">
              No projects yet
            </div>
          )}
        </div>
      </div>

      {/* ── Monthly projects bar chart ──────────────────────────────────────── */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">
          Projects created (last 6 months)
        </h3>
        {projectMonthly.length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={projectMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }}
                     axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }}
                     axisLine={false} tickLine={false} allowDecimals={false}/>
              <Tooltip content={<ChartTooltip />}/>
              <Bar dataKey="Projects" fill="#8b5cf6" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-36 flex items-center justify-center text-slate-600 text-sm">
            No data yet
          </div>
        )}
      </div>

      {/* ── Recent activity ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent projects */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">Recent projects</h3>
            <button
              onClick={() => navigate('/admin/projects')}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {activity?.recentProjects?.length > 0 ? (
              activity.recentProjects.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/admin/projects/edit/${p._id}`)}
                  className="flex items-center gap-3 p-2.5 rounded-lg
                             hover:bg-white/5 cursor-pointer transition-colors"
                >
                  {p.thumbnail?.url ? (
                    <img src={p.thumbnail.url} alt={p.title}
                         className="w-10 h-10 rounded-lg object-cover shrink-0"/>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-surface-800
                                    flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth={1.5} className="w-4 h-4 text-slate-600">
                        <rect x="2" y="7" width="20" height="15" rx="2"/>
                        <polyline points="17 2 12 7 7 2"/>
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-200 truncate">{p.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge ${
                    p.status === 'published' ? 'badge-published' : 'badge-draft'
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-600 text-sm text-center py-6">No projects yet</p>
            )}
          </div>
        </div>

        {/* Recent inquiries */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">Recent inquiries</h3>
            <button
              onClick={() => navigate('/admin/inquiries')}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {activity?.recentInquiries?.length > 0 ? (
              activity.recentInquiries.map((inq) => (
                <div
                  key={inq._id}
                  onClick={() => navigate(`/admin/inquiries/${inq._id}`)}
                  className="flex items-center gap-3 p-2.5 rounded-lg
                             hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600
                                  to-accent-500 flex items-center justify-center
                                  text-white text-xs font-semibold shrink-0">
                    {inq.name[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-200 truncate">{inq.name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {inq.subject || inq.email}
                    </p>
                  </div>
                  <span className={`badge badge-${inq.status}`}>{inq.status}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-600 text-sm text-center py-6">No inquiries yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;