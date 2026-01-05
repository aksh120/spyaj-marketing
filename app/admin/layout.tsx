"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/db";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Sellers",
    href: "/admin/sellers",
    icon: Users,
  },
  {
    label: "Quote Requests",
    href: "/admin/quotes",
    icon: FileText,
  },
  {
    label: "Contact Messages",
    href: "/admin/leads",
    icon: MessageSquare,
  },
  {
    label: "Site Content",
    href: "/admin/content",
    icon: Settings,
  },
];

interface Notification {
  id: string;
  type: "quote" | "contact";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, pathname, router]);

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data: quotes } = await supabaseAdmin
        .from("quote_requests")
        .select("id, contact_name, product_name, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: contacts } = await supabaseAdmin
        .from("contact_submissions")
        .select("id, name, subject, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      const notifs: Notification[] = [];

      if (quotes) {
        quotes.forEach((quote) => {
          notifs.push({
            id: `quote-${quote.id}`,
            type: "quote",
            title: `Quote Request: ${quote.product_name}`,
            message: `From ${quote.contact_name}`,
            time: formatTimeAgo(quote.created_at),
            read: quote.status !== "open",
            link: "/admin/quotes",
          });
        });
      }

      if (contacts) {
        contacts.forEach((contact) => {
          notifs.push({
            id: `contact-${contact.id}`,
            type: "contact",
            title: contact.subject || "New Message",
            message: `From ${contact.name}`,
            time: formatTimeAgo(contact.created_at),
            read: contact.status !== "new",
            link: "/admin/leads",
          });
        });
      }

      notifs.sort((a, b) => {
        return 0;
      });

      setNotifications(notifs.slice(0, 10));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  const NotificationDropdown = () => (
    <AnimatePresence>
      {notificationsOpen && (
        <motion.div
          ref={notificationRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
        >
          {}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          {}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link}
                  onClick={() => setNotificationsOpen(false)}
                  className={`block px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                    !notification.read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        notification.type === "quote"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {notification.type === "quote" ? (
                        <FileText size={16} />
                      ) : (
                        <MessageSquare size={16} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-slate-900 truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
            <div className="flex gap-2">
              <Link
                href="/admin/quotes"
                onClick={() => setNotificationsOpen(false)}
                className="flex-1 text-center py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                View Quotes
              </Link>
              <Link
                href="/admin/leads"
                onClick={() => setNotificationsOpen(false)}
                className="flex-1 text-center py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                View Messages
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-bold text-lg text-blue-600">SPYAJ Admin</span>
        </div>
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              if (!notificationsOpen) fetchNotifications();
            }}
            className="p-2 hover:bg-slate-100 rounded-lg relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown />
        </div>
      </div>

      {}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-slate-900 z-50"
            >
              <SidebarContent
                pathname={pathname}
                session={session}
                onSignOut={handleSignOut}
                onItemClick={() => setMobileMenuOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {}
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 bg-slate-900 transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <SidebarContent
          pathname={pathname}
          session={session}
          onSignOut={handleSignOut}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </aside>

      {}
      <main
        className={`transition-all duration-300 pt-16 lg:pt-0 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {}
        <header className="hidden lg:flex sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (!notificationsOpen) fetchNotifications();
                }}
                className="p-2 hover:bg-slate-100 rounded-lg relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {session.user?.name?.[0] || "A"}
              </div>
              <div className="hidden xl:block">
                <p className="font-medium text-sm">{session.user?.name}</p>
                <p className="text-xs text-slate-500">{session.user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {}
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}

function SidebarContent({
  pathname,
  session,
  onSignOut,
  collapsed = false,
  onToggle,
  onItemClick,
}: {
  pathname: string;
  session: {
    user: { name?: string; email?: string; role?: string } | undefined;
  };
  onSignOut: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
  onItemClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!collapsed && (
          <span className="font-bold text-xl text-white">SPYAJ Admin</span>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <ChevronRight
              className={`transition-transform ${collapsed ? "" : "rotate-180"}`}
              size={20}
            />
          </button>
        )}
      </div>

      {}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {}
      <div className="p-4 border-t border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-4 px-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {session.user?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user?.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {session.user?.role || "Admin"}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
