import Link from "next/link";

const siteLinks = [
    { section: "Main", links: [{ label: "Home", href: "/" }, { label: "Marketplace", href: "/marketplace" }, { label: "Contact", href: "/contact" }] },
    { section: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Careers", href: "/careers" }, { label: "Blog", href: "/blog" }] },
    { section: "Resources", links: [{ label: "Seller Onboarding", href: "/seller-onboarding" }, { label: "Buyers FAQ", href: "/buyers-faq" }, { label: "Buyer Protection", href: "/buyers-protection" }] },
    { section: "Legal", links: [{ label: "Privacy Policy", href: "/privacy-policy" }, { label: "Terms of Service", href: "/terms-of-service" }] },
];

export default function Sitemap() {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20 pt-[80px] md:pt-[120px]">
            <h1 className="text-3xl md:text-5xl font-bold mb-10 text-center">Sitemap</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {siteLinks.map((section) => (
                    <div key={section.section} className="space-y-4">
                        <h2 className="text-xl font-bold border-b pb-2">{section.section}</h2>
                        <ul className="space-y-2">
                            {section.links.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
