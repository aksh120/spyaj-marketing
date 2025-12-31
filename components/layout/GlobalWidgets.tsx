"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Paperclip, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";

export default function GlobalWidgets() {
    const { isOpen: isCartOpen } = useCart();
    const { isMobileMenuOpen } = useUI();

    // Hide widgets when cart or mobile menu is open
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
            text: "Hello! Is the cotton yarn available in bulk?",
            sender: "me",
            time: "10:00 AM",
        },
        {
            id: 2,
            text: "Yes, we have 5000 units ready to ship.",
            sender: "them",
            time: "10:05 AM",
        },
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([
            ...messages,
            {
                id: Date.now(),
                text: input,
                sender: "me",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },
        ]);
        setInput("");
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-card/95 backdrop-blur-md w-[320px] md:w-[380px] h-[500px] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden mb-2"
                    >
                        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                                        TH
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Textile Hub</h3>
                                    <p className="text-[10px] opacity-80">
                                        Online • Typically replies in 5m
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

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 dark:bg-zinc-950/50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
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
                                                : "bg-muted text-foreground border border-border/50 rounded-bl-none",
                                        )}
                                    >
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5 px-1 font-medium">
                                        {msg.time}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 border-t border-border bg-background">
                            <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 border border-border focus-within:border-primary/50 transition-colors">
                                <button className="text-muted-foreground hover:text-foreground transition-colors">
                                    <Paperclip className="w-4 h-4" />
                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm min-w-0"
                                />
                                <button
                                    onClick={handleSend}
                                    className="bg-primary text-primary-foreground p-1.5 rounded-lg hover:opacity-90 transition-opacity"
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
    const [response, setResponse] = useState<null | string>(null);
    const [isTyping, setIsTyping] = useState(false);

    const handleAsk = () => {
        if (!query.trim()) return;
        setIsTyping(true);
        setResponse(null);
        setTimeout(() => {
            setIsTyping(false);
            setResponse(
                "I found 5 verified suppliers for 'Industrial Pumps' in Mumbai with a rating above 4.5. Would you like to view their profiles?",
            );
        }, 1500);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className="bg-card/95 backdrop-blur-md w-[300px] rounded-2xl shadow-xl border border-border p-4 mb-2 origin-bottom-right"
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm">AI Trade Assistant</h4>
                                <p className="text-xs text-muted-foreground">
                                    Ask me anything about sourcing.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {response ? (
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100 p-3 rounded-xl text-xs leading-relaxed border border-indigo-100 dark:border-indigo-800">
                                    {response}
                                    <div className="mt-2 flex gap-2">
                                        <button className="bg-white dark:bg-black text-xs px-2 py-1 rounded border border-indigo-200 shadow-sm hover:bg-gray-50">
                                            View Suppliers
                                        </button>
                                        <button
                                            className="text-xs underline opacity-80"
                                            onClick={() => {
                                                setResponse(null);
                                                setQuery("");
                                            }}
                                        >
                                            Ask Another
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <textarea
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="E.g., Find verified electronics sellers..."
                                        className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none h-20"
                                    />
                                    <button
                                        onClick={handleAsk}
                                        disabled={isTyping}
                                        className="absolute bottom-2 right-2 p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-opacity disabled:opacity-50"
                                    >
                                        <Send className="w-3 h-3" />
                                    </button>
                                </div>
                            )}

                            {isTyping && (
                                <div className="flex gap-1 justify-center">
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6 }}
                                        className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                                    ></motion.div>
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                        className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                                    ></motion.div>
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                        className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                                    ></motion.div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl rounded-full flex items-center justify-center hover:shadow-indigo-500/20 transition-all"
                title="AI Assistant"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
            </motion.button>
        </>
    );
}
