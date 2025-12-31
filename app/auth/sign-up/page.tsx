"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const benefits = [
    "Access to thousands of verified B2B suppliers",
    "Secure payment processing with escrow protection",
    "24/7 customer support for all your business needs",
    "Real-time order tracking and analytics dashboard",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 pt-[80px] md:pt-[100px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-card/80 backdrop-blur-xl border-2 border-border rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 md:mb-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5"
            >
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Create Account
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Join thousands of businesses on SPYAJ
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <motion.button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full bg-primary text-primary-foreground py-4 md:py-5 rounded-xl md:rounded-2xl text-base md:text-lg font-bold flex items-center justify-between px-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />

              {isLoading ? (
                <div className="flex items-center justify-center w-full gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Creating your account...</span>
                </div>
              ) : (
                <>
                  <div className="bg-white p-2.5 rounded-xl shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <span className="flex-1 text-center">
                    Sign Up with Google
                  </span>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-300" />
                </>
              )}
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-bold text-center mb-4">
                What you'll get:
              </h3>
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {benefit}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex items-center justify-center gap-2 p-4 bg-green-500/10 rounded-xl border border-green-500/20"
            >
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                Secured with Google's enterprise-grade authentication
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                By signing up, you agree to SPYAJ&apos;s{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
