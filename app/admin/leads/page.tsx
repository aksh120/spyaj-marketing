"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Loader2,
  Eye,
  Reply,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  new: { bg: "bg-yellow-100", text: "text-yellow-700" },
  read: { bg: "bg-blue-100", text: "text-blue-700" },
  replied: { bg: "bg-green-100", text: "text-green-700" },
  resolved: { bg: "bg-slate-100", text: "text-slate-600" },
  spam: { bg: "bg-red-100", text: "text-red-600" },
};

export default function AdminLeadsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] =
    useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setContacts([]);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
        <p className="text-slate-500">
          View and respond to contact form submissions
        </p>
      </div>

      {}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {["new", "read", "replied", "resolved"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`p-4 rounded-xl border ${
              statusFilter === status
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white hover:bg-slate-50"
            } transition-colors`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`${statusColors[status].bg} ${statusColors[status].text} p-1.5 rounded`}
              >
                {status === "new" && <AlertCircle className="w-4 h-4" />}
                {status === "read" && <Eye className="w-4 h-4" />}
                {status === "replied" && <Reply className="w-4 h-4" />}
                {status === "resolved" && <CheckCircle className="w-4 h-4" />}
              </div>
              <span className="text-sm font-medium text-slate-600 capitalize">
                {status}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {contacts.filter((c) => c.status === status).length}
            </p>
          </button>
        ))}
      </div>

      {}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="resolved">Resolved</option>
            <option value="spam">Spam</option>
          </select>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No messages found
            </h3>
            <p className="text-slate-500">
              {contacts.length === 0
                ? "Contact form submissions will appear here"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredContacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                  contact.status === "new" ? "bg-yellow-50/50" : ""
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {contact.name[0].toUpperCase()}
                  </div>

                  {}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900">
                        {contact.name}
                      </h3>
                      {contact.company && (
                        <span className="text-sm text-slate-500">
                          ({contact.company})
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[contact.status].bg} ${statusColors[contact.status].text}`}
                      >
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">
                      <strong>Subject:</strong>{" "}
                      {contact.subject || "No subject"}
                    </p>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {contact.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {contact.email}
                      </span>
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(contact.createdAt)}
                      </span>
                    </div>
                  </div>

                  {}
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${contact.email}?subject=Re: ${contact.subject || "Your message"}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                    >
                      <Reply size={18} />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {}
      {selectedContact && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedContact(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Message Details
                </h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                  {selectedContact.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {selectedContact.name}
                  </h3>
                  {selectedContact.company && (
                    <p className="text-slate-500">{selectedContact.company}</p>
                  )}
                </div>
                <span
                  className={`ml-auto px-3 py-1 rounded-full font-medium ${statusColors[selectedContact.status].bg} ${statusColors[selectedContact.status].text}`}
                >
                  {selectedContact.status}
                </span>
              </div>

              {}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">
                    Email
                  </h4>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>
                {selectedContact.phone && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">
                      Phone
                    </h4>
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedContact.phone}
                    </a>
                  </div>
                )}
              </div>

              {}
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">
                  Subject
                </h4>
                <p className="text-slate-900">
                  {selectedContact.subject || "No subject"}
                </p>
              </div>

              {}
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">
                  Message
                </h4>
                <div className="bg-slate-50 rounded-lg p-4 text-slate-700 whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              {}
              <p className="text-sm text-slate-400">
                Received: {formatDate(selectedContact.createdAt)}
              </p>

              {}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || "Your message"}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Reply size={18} />
                  Reply via Email
                </a>
                <button className="px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium">
                  Mark as Resolved
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
