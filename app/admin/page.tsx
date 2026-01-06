"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  FolderTree,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/db";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalSellers: number;
  newContacts: number;
  openQuotes: number;
  quotesThisWeek: number;
  contactsThisWeek: number;
}

interface RecentActivity {
  type: "quote" | "contact";
  id: string;
  title: string;
  subtitle: string;
  status: string;
  createdAt: string;
}

const statCards = [
  {
    label: "Total Products",
    key: "totalProducts" as keyof DashboardStats,
    icon: Package,
    color: "bg-blue-500",
    href: "/admin/products",
  },
  {
    label: "Categories",
    key: "totalCategories" as keyof DashboardStats,
    icon: FolderTree,
    color: "bg-emerald-500",
    href: "/admin/categories",
  },
  {
    label: "Sellers",
    key: "totalSellers" as keyof DashboardStats,
    icon: Users,
    color: "bg-purple-500",
    href: "/admin/sellers",
  },
  {
    label: "Open Quotes",
    key: "openQuotes" as keyof DashboardStats,
    icon: FileText,
    color: "bg-orange-500",
    href: "/admin/quotes",
    highlight: true,
  },
  {
    label: "New Messages",
    key: "newContacts" as keyof DashboardStats,
    icon: MessageSquare,
    color: "bg-rose-500",
    href: "/admin/leads",
    highlight: true,
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const oneWeekAgoIso = oneWeekAgo.toISOString();

      const [
        { count: products },
        { count: categories },
        { count: sellers },
        { count: newContacts },
        { count: openQuotes },
        { count: quotesThisWeekCount },
        { count: contactsThisWeekCount },
        { data: recentQuotes },
        { data: recentContacts }
      ] = await Promise.all([
        supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("categories").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("sellers").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabaseAdmin.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabaseAdmin.from("quote_requests").select("*", { count: "exact", head: true }).gt("created_at", oneWeekAgoIso),
        supabaseAdmin.from("contact_submissions").select("*", { count: "exact", head: true }).gt("created_at", oneWeekAgoIso),
        supabaseAdmin.from("quote_requests").select("id, product_name, contact_name, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabaseAdmin.from("contact_submissions").select("id, name, subject, status, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        totalProducts: products || 0,
        totalCategories: categories || 0,
        totalSellers: sellers || 0,
        newContacts: newContacts || 0,
        openQuotes: openQuotes || 0,
        quotesThisWeek: quotesThisWeekCount || 0,
        contactsThisWeek: contactsThisWeekCount || 0,
      });

      const activity: RecentActivity[] = [
        ...(recentQuotes?.map(q => ({
          type: "quote" as const,
          id: q.id,
          title: q.product_name,
          subtitle: `From ${q.contact_name}`,
          status: q.status,
          createdAt: q.created_at,
        })) || []),
        ...(recentContacts?.map(c => ({
          type: "contact" as const,
          id: c.id,
          title: c.name,
          subtitle: c.subject || "No subject",
          status: c.status,
          createdAt: c.created_at,
        })) || []),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      { }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">
            Welcome back! Here's what's happening.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      { }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={card.href}>
              <div
                className={`bg-white rounded-xl p-5 border ${card.highlight && stats?.[card.key]
                  ? "border-orange-200 shadow-lg shadow-orange-100"
                  : "border-slate-200"
                  } hover:shadow-lg transition-shadow cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}
                  >
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  {card.highlight && stats?.[card.key] ? (
                    <span className="flex items-center text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Needs attention
                    </span>
                  ) : null}
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats?.[card.key] ?? 0}
                </p>
                <p className="text-sm text-slate-500 mt-1">{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      { }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        { }
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            This Week
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/quotes" className="block">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border border-blue-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">
                    Quote Requests
                  </span>
                </div>
                <p className="text-3xl font-bold text-blue-900">
                  {stats?.quotesThisWeek ?? 0}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>New this week</span>
                </div>
              </div>
            </Link>
            <Link href="/admin/leads" className="block">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border border-emerald-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-600">
                    Contact Messages
                  </span>
                </div>
                <p className="text-3xl font-bold text-emerald-900">
                  {stats?.contactsThisWeek ?? 0}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>New this week</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        { }
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Activity
          </h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No recent activity</p>
              <p className="text-sm">
                Quote requests and contact messages will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === "quote"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-blue-100 text-blue-600"
                      }`}
                  >
                    {activity.type === "quote" ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {activity.subtitle}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${activity.status === "new" || activity.status === "open"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      { }
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Package className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Add Product
            </span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex flex-col items-center justify-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            <FolderTree className="w-6 h-6 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              Manage Categories
            </span>
          </Link>
          <Link
            href="/admin/quotes"
            className="flex flex-col items-center justify-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <FileText className="w-6 h-6 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              View Quotes
            </span>
          </Link>
          <Link
            href="/admin/leads"
            className="flex flex-col items-center justify-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <MessageSquare className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              View Messages
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
