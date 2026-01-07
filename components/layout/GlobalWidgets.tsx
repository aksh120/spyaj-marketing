"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Paperclip, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function GlobalWidgets() {
  const { isOpen: isCartOpen } = useCart();
  const { isMobileMenuOpen } = useUI();

  if (isCartOpen || isMobileMenuOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[50] flex flex-col gap-4 items-end">
      <AIAssistant />
      <ChatWidget />
    </div>
  );
}

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to Spyaj Marketing. How can I help you today?",
      sender: "them",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getSupplierResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (
      lowerMsg.includes("price") ||
      lowerMsg.includes("cost") ||
      lowerMsg.includes("rate")
    ) {
      return "Our prices are very competitive! For cotton yarn, we offer ₹250/kg for orders above 100kg. For larger quantities (500kg+), we can offer additional 10% discount. Would you like a detailed quote?";
    }
    if (
      lowerMsg.includes("bulk") ||
      lowerMsg.includes("quantity") ||
      lowerMsg.includes("units")
    ) {
      return "Yes, we have 5000 units ready to ship! Our MOQ is 100 units, but we offer better pricing for bulk orders. What quantity are you looking for?";
    }
    if (
      lowerMsg.includes("shipping") ||
      lowerMsg.includes("delivery") ||
      lowerMsg.includes("ship")
    ) {
      return "We offer shipping across India. Standard delivery takes 3-5 business days. Express shipping (1-2 days) is available at extra cost. We also handle international orders!";
    }
    if (lowerMsg.includes("sample") || lowerMsg.includes("try")) {
      return "Absolutely! We can send you samples. Sample pack of 5 units is ₹500 including shipping. It will be deducted from your first bulk order!";
    }
    if (lowerMsg.includes("payment") || lowerMsg.includes("pay")) {
      return "We accept multiple payment methods: Bank Transfer, UPI, Cards, and Trade Assurance (escrow). For first orders, we require 50% advance. Regular customers get NET 30 terms.";
    }
    if (
      lowerMsg.includes("quality") ||
      lowerMsg.includes("certificate") ||
      lowerMsg.includes("certified")
    ) {
      return "All our products are ISO 9001 certified. We provide quality test reports with every shipment. Our cotton yarn is 100% organic and Oeko-Tex Standard 100 certified.";
    }
    if (
      lowerMsg.includes("cotton") ||
      lowerMsg.includes("yarn") ||
      lowerMsg.includes("fabric")
    ) {
      return "We specialize in premium cotton yarn! We have 100% cotton, blended varieties (cotton-polyester, cotton-silk), and organic options. What specific type are you interested in?";
    }
    if (
      lowerMsg.includes("hello") ||
      lowerMsg.includes("hi") ||
      lowerMsg.includes("hey")
    ) {
      return "Hello! Great to hear from you. I'm here to help with all your needs. Feel free to ask about our products, pricing, or shipping options!";
    }
    if (lowerMsg.includes("thank") || lowerMsg.includes("thanks")) {
      return "You're welcome! Feel free to reach out anytime. We look forward to doing business with you! 🙏";
    }
    if (
      lowerMsg.includes("order") ||
      lowerMsg.includes("buy") ||
      lowerMsg.includes("purchase")
    ) {
      return "Great! To place an order, please share: 1) Product type & quantity, 2) Delivery location, 3) Preferred payment method. I'll prepare a detailed quotation for you!";
    }
    if (
      lowerMsg.includes("available") ||
      lowerMsg.includes("stock") ||
      lowerMsg.includes("inventory")
    ) {
      return "Yes, we have excellent stock availability! Most products are ready for immediate dispatch. Let me know what you need and I'll confirm the exact quantity.";
    }
    if (
      lowerMsg.includes("discount") ||
      lowerMsg.includes("offer") ||
      lowerMsg.includes("deal")
    ) {
      return "We have great offers for new customers! 🎉 First order: 5% off. Orders above ₹50,000: Extra 7% off. Subscribe to our updates for seasonal deals!";
    }

    const defaultResponses = [
      "That's a great question! Let me help you with that. Could you provide more details about what you're looking for?",
      "I understand. We have several options that might suit your needs. Would you like me to share our catalog?",
      "Thank you for your interest! Our team specializes in this area. Can you tell me more about your requirements?",
      "Absolutely! We can definitely help with that. What timeline are you working with?",
    ];
    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const typingDelay = 1000 + Math.random() * 1500;
    setTimeout(() => {
      setIsTyping(false);
      const response = getSupplierResponse(userMessage.text);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: response,
          sender: "them",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, typingDelay);
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <>
      <AnimatePresence>
        {isOpen && mounted && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              backgroundColor: isDark ? "#18181b" : "#ffffff",
              borderColor: isDark ? "#3f3f46" : "#e5e7eb",
            }}
            className="w-[320px] md:w-[380px] h-[500px] rounded-2xl shadow-2xl border-2 flex flex-col overflow-hidden mb-2"
          >
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    SM
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-sm">Spyaj Marketing</h3>
                  <p className="text-[10px] opacity-80">
                    {isTyping ? "Typing..." : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ backgroundColor: isDark ? "#09090b" : "#f9fafb" }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.sender === "me"
                      ? "ml-auto items-end"
                      : "mr-auto items-start",
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm shadow-sm transition-all",
                      msg.sender === "me"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "rounded-bl-none",
                    )}
                    style={
                      msg.sender !== "me"
                        ? {
                            backgroundColor: isDark ? "#27272a" : "#e5e7eb",
                            color: isDark ? "#f4f4f5" : "#111827",
                          }
                        : undefined
                    }
                  >
                    {msg.text}
                  </div>
                  <span
                    className="text-[10px] mt-1.5 px-1 font-medium"
                    style={{ color: isDark ? "#a1a1aa" : "#6b7280" }}
                  >
                    {msg.time}
                  </span>
                </motion.div>
              ))}

              {}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col max-w-[85%] mr-auto items-start"
                >
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1"
                    style={{
                      backgroundColor: isDark ? "#27272a" : "#e5e7eb",
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="w-2 h-2 bg-gray-500 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        delay: 0.15,
                      }}
                      className="w-2 h-2 bg-gray-500 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        delay: 0.3,
                      }}
                      className="w-2 h-2 bg-gray-500 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div
              className="p-3 border-t"
              style={{
                backgroundColor: isDark ? "#18181b" : "#ffffff",
                borderColor: isDark ? "#3f3f46" : "#e5e7eb",
              }}
            >
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2 border focus-within:border-primary/50 transition-colors"
                style={{
                  backgroundColor: isDark ? "#27272a" : "#f3f4f6",
                  borderColor: isDark ? "#3f3f46" : "#e5e7eb",
                }}
              >
                <button
                  className="transition-colors"
                  style={{ color: isDark ? "#a1a1aa" : "#6b7280" }}
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  disabled={isTyping}
                  style={{ color: isDark ? "#f4f4f5" : "#111827" }}
                  className="flex-1 bg-transparent border-none outline-none text-sm min-w-0 placeholder:text-gray-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="bg-primary text-primary-foreground p-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:bg-primary/90 transition-all relative"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-background"></span>
        )}
      </motion.button>
    </>
  );
}

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<
    Array<{
      id: number;
      type: "user" | "ai";
      text: string;
      action?: string;
      actionData?: any;
    }>
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async () => {
    if (!query.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: "user" as const,
      text: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage.text }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "ai",
            text: data.response,
            action: data.action,
            actionData: data.actionData,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "ai",
            text:
              data.error ||
              "Sorry, I couldn't process your request. Please try again.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "ai",
          text: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAction = (action: string, actionData?: any) => {
    switch (action) {
      case "view_products":
        if (actionData?.searchTerm) {
          router.push(
            `/marketplace?search=${encodeURIComponent(actionData.searchTerm)}`,
          );
        } else {
          router.push("/marketplace");
        }
        setIsOpen(false);
        break;
      case "view_sellers":
      case "browse_sellers":
        router.push("/seller");
        setIsOpen(false);
        break;
      case "browse_categories":
        router.push("/marketplace");
        setIsOpen(false);
        break;
      case "request_quote":
        router.push("/#rfq");
        setIsOpen(false);
        break;
      case "contact_support":
        router.push("/contact");
        setIsOpen(false);
        break;
      case "become_seller":
        router.push("/seller");
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      view_products: "View Products",
      view_sellers: "View Suppliers",
      browse_categories: "Browse Marketplace",
      browse_sellers: "View Suppliers",
      request_quote: "Request Quote",
      contact_support: "Contact Us",
      become_seller: "Get Started",
      shipping_info: "Learn More",
      payment_info: "View Options",
    };
    return labels[action] || "Learn More";
  };

  const isDark = mounted && resolvedTheme === "dark";

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && mounted && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            style={{
              backgroundColor: isDark ? "#18181b" : "#ffffff",
              borderColor: isDark ? "#3f3f46" : "#e5e7eb",
              color: isDark ? "#ffffff" : "#111827",
            }}
            className="w-[320px] md:w-[380px] h-[450px] rounded-2xl shadow-2xl border-2 flex flex-col overflow-hidden mb-2 origin-bottom-right"
          >
            {}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">AI Trade Assistant</h4>
                  <p className="text-[10px] opacity-80">
                    Ask me anything about sourcing
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-[10px] opacity-80 hover:opacity-100"
                    title="Clear chat"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ backgroundColor: isDark ? "#09090b" : "#f9fafb" }}
            >
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-indigo-500" />
                  </div>
                  <p className="text-sm font-medium mb-2">
                    How can I help you today?
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Try asking about products, suppliers, or pricing
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Find suppliers", "Get a quote", "Shipping info"].map(
                      (suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setQuery(suggestion);
                          }}
                          className={cn(
                            "text-[10px] px-3 py-1.5 rounded-full border transition-all duration-200 shadow-sm hover:shadow-md",
                            isDark
                              ? "bg-white/5 border-white/10 text-indigo-300 hover:bg-indigo-600 hover:text-white"
                              : "bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white",
                          )}
                        >
                          {suggestion}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex flex-col max-w-[90%]",
                      msg.type === "user"
                        ? "ml-auto items-end"
                        : "mr-auto items-start",
                    )}
                  >
                    <div
                      className={cn(
                        "px-3 py-2 rounded-2xl text-xs shadow-sm",
                        msg.type === "user"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none"
                          : "rounded-bl-none",
                      )}
                      style={
                        msg.type === "ai"
                          ? {
                              backgroundColor: isDark ? "#27272a" : "#f3f4f6",
                              color: isDark ? "#f4f4f5" : "#1f2937",
                              border: `1px solid ${isDark ? "#3f3f46" : "#d1d5db"}`,
                            }
                          : undefined
                      }
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                      {msg.action && msg.action !== "general_help" && (
                        <button
                          onClick={() =>
                            handleAction(msg.action!, msg.actionData)
                          }
                          className="mt-2 text-[10px] font-bold px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-1"
                        >
                          {getActionLabel(msg.action)}
                          <Send className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}

              {isTyping && (
                <div
                  className="flex items-center gap-2 p-3 rounded-2xl rounded-bl-none max-w-[80%]"
                  style={{
                    backgroundColor: isDark ? "#27272a" : "#f3f4f6",
                    border: `1px solid ${isDark ? "#3f3f46" : "#d1d5db"}`,
                  }}
                >
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="w-2 h-2 bg-indigo-500 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        delay: 0.2,
                      }}
                      className="w-2 h-2 bg-indigo-500 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        delay: 0.4,
                      }}
                      className="w-2 h-2 bg-indigo-500 rounded-full"
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Thinking...
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {}
            <div
              className="p-3 border-t"
              style={{
                backgroundColor: isDark ? "#18181b" : "#ffffff",
                borderColor: isDark ? "#3f3f46" : "#e5e7eb",
              }}
            >
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2 border focus-within:border-indigo-500/50 transition-colors"
                style={{
                  backgroundColor: isDark ? "#27272a" : "#f3f4f6",
                  borderColor: isDark ? "#3f3f46" : "#e5e7eb",
                }}
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                  placeholder="Ask about products, suppliers..."
                  style={{ color: isDark ? "#f4f4f5" : "#111827" }}
                  className="flex-1 bg-transparent border-none outline-none text-xs min-w-0 placeholder:text-gray-500"
                  disabled={isTyping}
                />
                <button
                  onClick={handleAsk}
                  disabled={isTyping || !query.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl rounded-full flex items-center justify-center hover:shadow-indigo-500/30 transition-all relative"
        title="AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        {!isOpen && (
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
          >
            <span className="text-[8px] font-bold">AI</span>
          </motion.span>
        )}
      </motion.button>
    </>
  );
}
