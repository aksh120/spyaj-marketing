"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, MapPin, ChevronDown, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Contact", href: "/contact" },
];

const cities = [
  "All Cities",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Kalyan-Dombivli",
  "Vasai-Virar",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Dhanbad",
  "Amritsar",
  "Navi Mumbai",
  "Allahabad",
  "Howrah",
  "Ranchi",
  "Gwalior",
  "Jabalpur",
  "Coimbatore",
  "Vijayawada",
  "Jodhpur",
  "Madurai",
  "Raipur",
  "Kota",
  "Guwahati",
  "Chandigarh",
  "Solapur",
  "Hubli-Dharwad",
  "Bareilly",
  "Moradabad",
  "Mysore",
  "Gurgaon",
  "Aligarh",
  "Jalandhar",
  "Tiruchirappalli",
  "Bhubaneswar",
  "Salem",
  "Mira-Bhayandar",
  "Warangal",
  "Thiruvananthapuram",
  "Bhiwandi",
  "Saharanpur",
  "Guntur",
  "Amravati",
  "Bikaner",
  "Noida",
  "Jamshedpur",
  "Bhilai",
  "Cuttack",
  "Firozabad",
  "Kochi",
  "Nellore",
  "Bhavnagar",
  "Dehradun",
  "Durgapur",
  "Asansol",
  "Rourkela",
  "Nanded",
  "Kolhapur",
  "Ajmer",
  "Akola",
  "Gulbarga",
  "Jamnagar",
  "Ujjain",
  "Loni",
  "Siliguri",
  "Jhansi",
  "Ulhasnagar",
  "Jammu",
  "Sangli-Miraj & Kupwad",
  "Mangalore",
  "Erode",
  "Belgaum",
  "Ambattur",
  "Tirunelveli",
  "Malegaon",
  "Gaya",
  "Jalgaon",
  "Udaipur",
  "Maheshtala",
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useUI();
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase()),
  );

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 py-3 md:py-4",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-6">
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="relative h-12 md:h-16 w-auto aspect-video">
            <Image
              src={
                mounted
                  ? resolvedTheme === "dark"
                    ? "/logo-dark.png"
                    : "/logo-light.png"
                  : "/logo-light.png"
              }
              alt="SPYAJ Marketing"
              width={200}
              height={60}
              className="h-12 md:h-16 w-auto object-contain"
              onError={() => setImgError(true)}
              priority
            />
          </div>
        </Link>

        <div className="hidden lg:block relative">
          <button
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-border rounded-full hover:border-primary/50 transition-all bg-background"
          >
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {selectedCity}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                isCityDropdownOpen && "rotate-180",
              )}
            />
          </button>

          {isCityDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 left-0 bg-background border-2 border-border rounded-2xl shadow-xl p-2 min-w-[250px] max-h-[400px] overflow-hidden z-50"
            >
              <div className="p-2 border-b-2 border-border mb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityDropdownOpen(false);
                        setCitySearchQuery("");
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all",
                        selectedCity === city
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-muted",
                      )}
                    >
                      {city}
                    </button>
                  ))
                ) : (
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      No cities found
                    </p>
                    {citySearchQuery && (
                      <button
                        onClick={() => {
                          setSelectedCity(citySearchQuery);
                          setIsCityDropdownOpen(false);
                          setCitySearchQuery("");
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-sm bg-primary/10 hover:bg-primary/20 transition-all border-2 border-primary/30"
                      >
                        <span className="font-semibold">
                          Use "{citySearchQuery}"
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="hidden lg:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="What are you looking for today?"
              className="w-full bg-background border-2 border-border rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 mx-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative py-1",
                pathname === link.href
                  ? "text-primary font-bold"
                  : "text-foreground/70",
              )}
            >
              {link.name}
              {pathname === link.href && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden md:flex items-center gap-1 bg-background/60 backdrop-blur-md border-2 border-border/50 rounded-full p-1 shadow-lg">
            <Link
              href="/auth/sign-in"
              className="text-sm font-medium px-5 py-2.5 rounded-full hover:bg-muted/50 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Sign Up
            </Link>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          <ThemeToggle />

          <button
            className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-[55] md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-background z-[60] md:hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary via-primary to-blue-600 p-6 pb-8">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="mt-4">
                <h2 className="text-2xl font-black text-white">Menu</h2>
                <p className="text-white/70 text-sm mt-1">Explore SPYAJ Marketing</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Search */}
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-muted/50 border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* City Selector */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</span>
                </div>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl py-2.5 px-3 appearance-none outline-none focus:border-primary transition-all text-sm font-medium"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Navigation Links */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Menu className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Navigation</span>
                </div>
                <div className="space-y-1">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between py-3 px-4 rounded-xl transition-all",
                          pathname === link.href
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <span className="text-base font-semibold">{link.name}</span>
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with Auth Buttons */}
            <div className="p-4 border-t border-border bg-card/50">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/auth/sign-in"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center font-bold py-3 rounded-xl border-2 border-border hover:bg-muted transition-all text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center font-bold py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
