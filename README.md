# Spyaj Marketing - Premium B2B Marketplace

Spyaj Marketing is a next-generation B2B marketplace platform designed to connect industrial sellers with buyers across India. Built with modern web technologies, it offers a premium, high-performance user experience with fluid animations and a robust feature set.

![Spyaj Marketing Banner](/public/logo-light.png)

## 🚀 Key Features

### 🌟 Premium User Experience
- **Modern UI/UX**: Designed with a "Premium & Trust" aesthetic using OKLCH color spaces, glassmorphism effects, and fluid transitions.
- **Fluid Animations**: Powered by `framer-motion` for engaging micro-interactions, page transitions, and scroll effects.
- **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.

### 🛍️ B2B Marketplace
- **Dynamic Product Listings**: Browse thousands of industrial products (Steel, Electronics, Raw Materials, etc.).
- **Smart Search & Filtering**: advanced filtering by category, price range, and sorting options.
- **City Search**: Comprehensive city selector in the navbar covering major Indian cities.
- **Mock Data Engine**: Deterministic mock data generation for stable and realistic product pricing and stats.

### 🏢 Seller & User Ecosystem
- **Seller Profiles**: Dedicated seller pages with verification badges, ratings, product catalogs, and trust indicators.
- **User Dashboard**: Comprehensive account management with activity feeds, analytics previews, and saved items.
- **Verification System**: Visual indicators for verified sellers and secure transactions.

### 🔐 Authentication & Security
- **Streamlined Auth**: Optimized Sign-In and Sign-Up pages tailored for Google Authentication.
- **Security First**: UI elements emphasizing trust and safety (HTTPS, verified types).

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@theme` and `@import`)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks (`useState`, `useEffect`)

## 🏁 Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
spyaj-marketing/
├── app/                  # App Router directories
│   ├── account/          # User Dashboard
│   ├── auth/             # Authentication (Sign In/Up)
│   ├── contact/          # Contact & Support
│   ├── marketplace/      # Product Listing Page
│   ├── seller/           # Seller Profile Page
│   ├── globals.css       # Global styles (Tailwind v4)
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/
│   └── layout/           # Shared components (Navbar, Footer)
├── lib/                  # Utilities (cn, etc.)
└── public/               # Static assets
```

## 🎨 Theme Customization

The project uses a centralized theme configuration in `app/globals.css`. You can easily adjust the color palette (Primary, Secondary, Accent) by modifying the OKLCH values in the `@theme` block.

```css
@theme {
    --color-primary: oklch(0.5 0.2 260);
    --color-background: var(--background);
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
