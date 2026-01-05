import { notFound } from "next/navigation";
import { supabase } from "@/lib/db";
import ProductDetailsClient from "./client";
import { Metadata } from "next";

type Props = {
  params: Promise<{ seller: string; slug: string }>;
};

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: string;
  price_numeric: number | null;
  currency: string;
  unit: string | null;
  min_order_qty: number;
  images: { url: string; alt?: string }[];
  rating: number;
  reviews_count: number;
  orders_count: number;
  badge: string | null;
  is_featured: boolean;
  category?: { id: string; name: string; slug: string };
  seller?: {
    id: string;
    name: string;
    slug: string;
    tier: string;
    is_verified: boolean;
    rating: number;
    response_rate: string | null;
    response_time: string | null;
    delivery_success: string | null;
    location: string | null;
    description: string | null;
    logo_url: string | null;
    banner_url: string | null;
    certifications: string[];
  };
}

async function getProduct(
  sellerSlug: string,
  productSlug: string,
): Promise<Product | null> {
  const decodedProductSlug = decodeURIComponent(productSlug);

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, name, slug, description, short_description, price, price_numeric, currency, unit, min_order_qty, images, rating, reviews_count, orders_count, badge, is_featured,
      category:categories(id, name, slug),
      seller:sellers(id, name, slug, tier, is_verified, rating, response_rate, response_time, delivery_success, location, description, logo_url, banner_url, certifications)
    `,
    )
    .eq("slug", decodedProductSlug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  const product: Product = {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    short_description: data.short_description,
    price: data.price,
    price_numeric: data.price_numeric,
    currency: data.currency,
    unit: data.unit,
    min_order_qty: data.min_order_qty,
    images: data.images || [],
    rating: data.rating || 0,
    reviews_count: data.reviews_count || 0,
    orders_count: data.orders_count || 0,
    badge: data.badge,
    is_featured: data.is_featured,
    category:
      Array.isArray(data.category) && data.category.length > 0
        ? (data.category[0] as { id: string; name: string; slug: string })
        : data.category
          ? (data.category as unknown as {
              id: string;
              name: string;
              slug: string;
            })
          : undefined,
    seller:
      Array.isArray(data.seller) && data.seller.length > 0
        ? (data.seller[0] as Product["seller"])
        : data.seller
          ? (data.seller as unknown as Product["seller"])
          : undefined,
  };

  return product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seller, slug } = await params;
  const product = await getProduct(seller, slug);

  if (!product) {
    return {
      title: "Product Not Found | SPYAJ Marketplace",
      description: "The product you are looking for does not exist.",
    };
  }

  const sellerName = product.seller?.name || "Verified Seller";
  const productImage =
    product.images && product.images.length > 0 ? product.images[0].url : "";

  return {
    title: `${product.name} by ${sellerName} | SPYAJ`,
    description: `Buy ${product.name} from ${sellerName} on SPYAJ Marketplace. Best prices, verified suppliers, and secure trade assurance.`,
    openGraph: {
      images: productImage ? [productImage] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { seller: sellerSlug, slug: productSlug } = await params;
  const product = await getProduct(sellerSlug, productSlug);

  if (!product) {
    notFound();
  }

  const sellerData = product.seller || {
    id: "default",
    name: "Verified Seller",
    slug: "verified-seller",
    tier: "Bronze",
    is_verified: false,
    rating: 0,
    response_rate: null,
    response_time: null,
    delivery_success: null,
    location: null,
    description: null,
    logo_url: null,
    banner_url: null,
    certifications: [],
  };

  const clientProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    price: product.price,
    unit: product.unit,
    minOrder: product.min_order_qty,
    image:
      product.images && product.images.length > 0
        ? product.images[0].url
        : "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800",
    images: product.images?.map((img) => img.url) || [],
    rating: product.rating,
    reviews: product.reviews_count,
    orders: product.orders_count,
    seller: sellerData.name,
    verified: sellerData.is_verified,
    category: product.category?.name || "General",
    badge: product.badge,
  };

  const clientSeller = {
    id: sellerData.slug,
    name: sellerData.name,
    tier: sellerData.tier,
    verified: sellerData.is_verified,
    rating: sellerData.rating || 0,
    responseRate: sellerData.response_rate || "N/A",
    responseTime: sellerData.response_time || "N/A",
    deliverySuccess: sellerData.delivery_success || "N/A",
    location: sellerData.location || "India",
    description:
      sellerData.description || `Verified supplier on SPYAJ Marketplace.`,
    joined: "2023",
    categories: [product.category?.name || "General"],
    banner:
      sellerData.banner_url ||
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200",
    logo:
      sellerData.logo_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerData.name)}&background=random`,
    certifications: sellerData.certifications || [],
  };

  return <ProductDetailsClient product={clientProduct} seller={clientSeller} />;
}
