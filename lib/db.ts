import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials not configured. Database features will be disabled.",
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export const supabaseAdmin = createClient(
  supabaseUrl || "",
  supabaseServiceKey || supabaseAnonKey || "",
);

export const db = supabase;
export default supabase;

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: "admin" | "super_admin";
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Seller {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  is_verified: boolean;
  rating: number;
  response_rate: string | null;
  response_time: string | null;
  delivery_success: string | null;
  location: string | null;
  joined_year: number | null;
  logo_url: string | null;
  banner_url: string | null;
  certifications: string[];
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
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
  category_id: string | null;
  seller_id: string | null;
  images: { url: string; alt?: string }[];
  rating: number;
  reviews_count: number;
  orders_count: number;
  views_count: number;
  badge: string | null;
  is_featured: boolean;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;

  category?: Category;
  seller?: Seller;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  status: "new" | "read" | "replied" | "resolved" | "spam";
  assigned_to: string | null;
  admin_notes: string | null;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequest {
  id: string;
  contact_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  product_name: string;
  category: string | null;
  quantity: string | null;
  target_budget: string | null;
  requirements: string | null;
  delivery_location: string | null;
  attachments: { url: string; name: string }[];
  product_id: string | null;
  status: "open" | "reviewing" | "quoted" | "accepted" | "rejected" | "expired";
  assigned_to: string | null;
  admin_notes: string | null;
  quoted_price: string | null;
  quoted_at: string | null;
  quote_valid_until: string | null;
  ip_address: string | null;
  user_agent: string | null;
  source: string | null;
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  content_type: "text" | "html" | "image" | "json";
  value: string;
  page: string | null;
  section: string | null;
  description: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string | null;
  admin_email: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface EmailLog {
  id: string;
  recipient_email: string;
  subject: string;
  template: string | null;
  status: "pending" | "sent" | "failed" | "bounced";
  related_entity_type: string | null;
  related_entity_id: string | null;
  error_message: string | null;
  smtp_response: string | null;
  created_at: string;
}

export async function getProducts(options?: {
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      seller:sellers(*)
    `,
    )
    .eq("is_active", true);

  if (options?.category) {
    query = query.eq("category.slug", options.category);
  }

  if (options?.search) {
    query = query.or(
      `name.ilike.%${options.search}%,description.ilike.%${options.search}%`,
    );
  }

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 12) - 1,
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data as Category[];
}

export async function getSellers() {
  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false });

  if (error) {
    console.error("Error fetching sellers:", error);
    return [];
  }

  return data as Seller[];
}

export async function getAdminByEmail(email: string) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .eq("is_active", true)
    .single();

  if (error) {
    return null;
  }

  return data as AdminUser;
}

export async function createContactSubmission(
  submission: Omit<
    ContactSubmission,
    | "id"
    | "created_at"
    | "updated_at"
    | "status"
    | "assigned_to"
    | "admin_notes"
    | "email_sent"
    | "email_sent_at"
  >,
) {
  const { data, error } = await supabase
    .from("contact_submissions")
    .insert({
      ...submission,
      status: "new",
      email_sent: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating contact submission:", error);
    throw error;
  }

  return data as ContactSubmission;
}

export async function createQuoteRequest(
  request: Omit<
    QuoteRequest,
    | "id"
    | "created_at"
    | "updated_at"
    | "status"
    | "assigned_to"
    | "admin_notes"
    | "quoted_price"
    | "quoted_at"
    | "quote_valid_until"
    | "email_sent"
    | "email_sent_at"
  >,
) {
  const { data, error } = await supabase
    .from("quote_requests")
    .insert({
      ...request,
      status: "open",
      email_sent: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating quote request:", error);
    throw error;
  }

  return data as QuoteRequest;
}

export async function logAuditAction(log: Omit<AuditLog, "id" | "created_at">) {
  const { error } = await supabase.from("audit_logs").insert(log);

  if (error) {
    console.error("Error logging audit action:", error);
  }
}

export async function logEmail(log: Omit<EmailLog, "id" | "created_at">) {
  const { error } = await supabase.from("email_logs").insert(log);

  if (error) {
    console.error("Error logging email:", error);
  }
}

export async function getSiteContent(key: string) {
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("key", key)
    .single();

  if (error) {
    return null;
  }

  return data as SiteContent;
}

export async function getPageContent(page: string) {
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("page", page);

  if (error) {
    console.error("Error fetching page content:", error);
    return [];
  }

  const content: Record<string, string> = {};
  (data as SiteContent[]).forEach((item) => {
    content[item.key] = item.value;
  });

  return content;
}
