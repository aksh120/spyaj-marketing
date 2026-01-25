"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Package,
  Building,
  Loader2,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { getQuotes, updateQuoteStatus, deleteQuote } from "./actions";

interface QuoteRequest {
  id: string;
  contactName: string;
  companyName: string | null;
  email: string;
  phone: string | null;
  productName: string;
  category: string | null;
  quantity: string | null;
  targetBudget: string | null;
  requirements: string | null;
  status: string;
  source: string | null;
  createdAt: string;
  quoted_price?: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  open: { bg: "bg-yellow-100", text: "text-yellow-700" },
  reviewing: { bg: "bg-blue-100", text: "text-blue-700" },
  quoted: { bg: "bg-purple-100", text: "text-purple-700" },
  accepted: { bg: "bg-green-100", text: "text-green-700" },
  rejected: { bg: "bg-red-100", text: "text-red-700" },
  expired: { bg: "bg-slate-100", text: "text-slate-600" },
};

const statusIcons: Record<string, React.ReactNode> = {
  open: <Clock className="w-4 h-4" />,
  reviewing: <Eye className="w-4 h-4" />,
  quoted: <FileText className="w-4 h-4" />,
  accepted: <CheckCircle className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
  expired: <Clock className="w-4 h-4" />,
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [quotePrice, setQuotePrice] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { success, data, error } = await getQuotes();

      if (!success || error) {
        console.error("Failed to fetch quotes:", error);
        setQuotes([]);
      } else if (data) {
        setQuotes(
          data.map((item) => ({
            id: item.id,
            contactName: item.contact_name,
            companyName: item.company_name,
            email: item.email,
            phone: item.phone,
            productName: item.product_name,
            category: item.category,
            quantity: item.quantity,
            targetBudget: item.target_budget,
            requirements: item.requirements,
            status: item.status || "open",
            source: item.source,
            createdAt: item.created_at,
            quoted_price: item.quoted_price,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuoteStatus = async (id: string, newStatus: string) => {
    try {
      const result = await updateQuoteStatus(id, newStatus);

      if (!result.success) throw new Error(result.error);

      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q)),
      );
      if (selectedQuote?.id === id) {
        setSelectedQuote((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this quote request?"))
      return;

    try {
      const result = await deleteQuote(id);

      if (!result.success) throw new Error(result.error);

      setQuotes((prev) => prev.filter((q) => q.id !== id));
      if (selectedQuote?.id === id) {
        setSelectedQuote(null);
      }
    } catch (error) {
      console.error("Failed to delete quote:", error);
      alert("Failed to delete quote request. Please try again.");
    }
  };

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendQuote = async () => {
    if (!selectedQuote) return;
    if (!quotePrice.trim()) {
      alert("Please enter a quote price");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/admin/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selectedQuote.id,
          contactName: selectedQuote.contactName,
          email: selectedQuote.email,
          productName: selectedQuote.productName,
          quantity: selectedQuote.quantity,
          quotePrice: quotePrice,
        }),
      });

      if (!response.ok) throw new Error("Failed to send quote");

      setQuotes((prev) =>
        prev.map((q) =>
          q.id === selectedQuote.id
            ? { ...q, status: "quoted", quoted_price: quotePrice }
            : q,
        ),
      );
      setSelectedQuote((prev) =>
        prev ? { ...prev, status: "quoted", quoted_price: quotePrice } : null,
      );
      setQuotePrice("");
      alert("Quote sent successfully!");
    } catch (error) {
      console.error("Failed to send quote:", error);
      alert("Failed to send quote. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

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
      { }
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quote Requests</h1>
        <p className="text-slate-500">Manage incoming quote and RFQ requests</p>
      </div>

      { }
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {["open", "reviewing", "accepted", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`p-4 rounded-xl border ${statusFilter === status
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white hover:bg-slate-50"
              } transition-colors`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`${statusColors[status].bg} ${statusColors[status].text} p-1.5 rounded`}
              >
                {statusIcons[status]}
              </div>
              <span className="text-sm font-medium text-slate-600 capitalize">
                {status}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {quotes.filter((q) => q.status === status).length}
            </p>
          </button>
        ))}
      </div>

      { }
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name, product, or email..."
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
            <option value="open">Open</option>
            <option value="reviewing">Reviewing</option>
            <option value="quoted">Quoted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      { }
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No quote requests found
            </h3>
            <p className="text-slate-500">
              {quotes.length === 0
                ? "Quote requests from users will appear here"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredQuotes.map((quote) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedQuote(quote);
                  if (quote.status === "open") {
                    handleUpdateQuoteStatus(quote.id, "reviewing");
                  }
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  { }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {quote.productName}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[quote.status].bg} ${statusColors[quote.status].text}`}
                      >
                        {quote.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {quote.contactName}
                        {quote.companyName && ` (${quote.companyName})`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {quote.email}
                      </span>
                      {quote.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {quote.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  { }
                  <div className="flex items-center gap-4 text-sm">
                    {quote.quantity && (
                      <span className="px-3 py-1 bg-slate-100 rounded-lg">
                        Qty: {quote.quantity}
                      </span>
                    )}
                    {quote.targetBudget && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg">
                        Budget: {quote.targetBudget}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      {formatDate(quote.createdAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuote(quote.id);
                      }}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      { }
      {selectedQuote && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedQuote(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Quote Request Details
                </h2>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              { }
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1.5 rounded-full font-medium ${statusColors[selectedQuote.status].bg} ${statusColors[selectedQuote.status].text}`}
                >
                  {selectedQuote.status}
                </span>
                <span className="text-slate-500">
                  Submitted {formatDate(selectedQuote.createdAt)}
                </span>
              </div>

              { }
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">
                  Product Requested
                </h3>
                <p className="text-lg font-semibold text-slate-900">
                  {selectedQuote.productName}
                </p>
                {selectedQuote.category && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 rounded text-sm text-slate-600">
                    {selectedQuote.category}
                  </span>
                )}
              </div>

              { }
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">
                    Contact Name
                  </h3>
                  <p className="text-slate-900">{selectedQuote.contactName}</p>
                </div>
                {selectedQuote.companyName && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">
                      Company
                    </h3>
                    <p className="text-slate-900">
                      {selectedQuote.companyName}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">
                    Email
                  </h3>
                  <a
                    href={`mailto:${selectedQuote.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {selectedQuote.email}
                  </a>
                </div>
                {selectedQuote.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">
                      Phone
                    </h3>
                    <a
                      href={`tel:${selectedQuote.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedQuote.phone}
                    </a>
                  </div>
                )}
              </div>

              { }
              <div className="grid grid-cols-2 gap-4">
                {selectedQuote.quantity && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">
                      Quantity
                    </h3>
                    <p className="text-slate-900">{selectedQuote.quantity}</p>
                  </div>
                )}
                {selectedQuote.targetBudget && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">
                      Target Budget
                    </h3>
                    <p className="text-slate-900 font-semibold">
                      {selectedQuote.targetBudget}
                    </p>
                  </div>
                )}
              </div>

              { }
              {selectedQuote.requirements && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">
                    Requirements
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 text-slate-700 whitespace-pre-wrap">
                    {selectedQuote.requirements}
                  </div>
                </div>
              )}

              {selectedQuote.status === "reviewing" ||
                selectedQuote.status === "open" ? (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">
                    Quote Price
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. ₹45,000"
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : selectedQuote.status === "quoted" ||
                selectedQuote.status === "accepted" ? (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">
                    Quoted Price
                  </h3>
                  <p className="text-lg font-bold text-blue-600">
                    {(selectedQuote as any).quoted_price ||
                      "Price not recorded"}
                  </p>
                </div>
              ) : null}

              { }
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handleSendQuote}
                  disabled={
                    isSending ||
                    selectedQuote.status === "quoted" ||
                    selectedQuote.status === "accepted"
                  }
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : selectedQuote.status === "quoted" ||
                    selectedQuote.status === "accepted" ? (
                    "Quote Sent"
                  ) : (
                    "Send Quote"
                  )}
                </button>
                <button
                  onClick={() =>
                    handleUpdateQuoteStatus(selectedQuote.id, "accepted")
                  }
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                  disabled={
                    selectedQuote.status === "accepted" ||
                    selectedQuote.status === "rejected"
                  }
                >
                  Mark as Accepted
                </button>
                <button
                  onClick={() =>
                    handleUpdateQuoteStatus(selectedQuote.id, "rejected")
                  }
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                  disabled={
                    selectedQuote.status === "rejected" ||
                    selectedQuote.status === "accepted"
                  }
                >
                  Reject
                </button>
                <a
                  href={`mailto:${selectedQuote.email}?subject=Re: Quote Request - ${selectedQuote.productName}`}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium whitespace-nowrap"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
