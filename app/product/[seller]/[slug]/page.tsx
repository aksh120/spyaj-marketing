import { notFound, redirect } from "next/navigation";
import {
  products,
  discountProducts,
  flashDeals,
  featuredProducts,
  sellers,
} from "@/lib/data";
import { slugify } from "@/lib/utils";
import ProductDetailsClient from "./client";
import { Metadata } from "next";

const allProducts = [
  ...products,
  ...discountProducts,
  ...flashDeals,
  ...featuredProducts,
] as any[];

type Props = {
  params: Promise<{ seller: string; slug: string }>;
};

async function getProduct(sellerSlug: string, productSlug: string) {
  const decodedSellerSlug = decodeURIComponent(sellerSlug);
  const decodedProductSlug = decodeURIComponent(productSlug);

  const product = allProducts.find((p) => {
    const pSlug = slugify(p.name);
    const sSlug = slugify(p.seller || "Verified Seller");

    return pSlug === decodedProductSlug && sSlug === decodedSellerSlug;
  });

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

  return {
    title: `${product.name} by ${product.seller} | SPYAJ`,
    description: `Buy ${product.name} from ${product.seller} on SPYAJ Marketplace. Best prices, verified suppliers, and secure trade assurance.`,
    openGraph: {
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { seller: sellerSlug, slug: productSlug } = await params;
  const product = await getProduct(sellerSlug, productSlug);

  if (!product) {
    const looseMatch = allProducts.find((p) => slugify(p.name) === productSlug);
    if (looseMatch) {
    }
    notFound();
  }

  let sellerData = sellers.find(
    (s) => slugify(s.name) === sellerSlug || slugify(s.id) === sellerSlug,
  );

  if (!sellerData) {
    const sellerName = product.seller || "Verified Seller";
    sellerData = {
      id: slugify(sellerName),
      name: sellerName,
      tier: product.verified ? "Gold" : "Bronze",
      verified: !!product.verified,
      rating: 4.5,
      responseRate: "90%",
      responseTime: "< 24 hours",
      deliverySuccess: "95%",
      location: "India",
      description: `Leading supplier of ${product.category || "quality goods"}. Specialized in high standards and customer satisfaction.`,
      joined: "2023",
      categories: [product.category || "General"],
      banner: "https://loremflickr.com/1200/400/warehouse",
      logo: `https://ui-avatars.com/api/?name=${sellerName}&background=random`,
      certifications: ["Business Reg"],
    };
  }

  return <ProductDetailsClient product={product} seller={sellerData} />;
}
