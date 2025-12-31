"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch(console.error);
        }

        const dismissed = localStorage.getItem("pwaPromptDismissed");
        if (dismissed) return;

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setTimeout(() => setShowPrompt(true), 3000);
        };

        window.addEventListener("beforeinstallprompt", handler);

        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true);
        }

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setIsInstalled(true);
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem("pwaPromptDismissed", "true");
    };

    if (isInstalled || !showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-80 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-primary to-blue-600 p-4 text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold">Install SPYAJ App</h3>
                            <p className="text-xs text-white/70">Get faster access & offline mode</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-3 bg-white dark:bg-zinc-900">
                    <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span> Quick access from home screen
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span> Works offline
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span> Faster loading
                        </li>
                    </ul>

                    <div className="flex gap-2">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 py-2.5 rounded-xl border-2 border-gray-300 dark:border-zinc-600 font-bold text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Not Now
                        </button>
                        <button
                            onClick={handleInstall}
                            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Install
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
