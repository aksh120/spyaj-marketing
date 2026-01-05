import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabaseAdmin, logAuditAction } from "./db";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        console.log("[AUTH] Attempting login for:", email);

        const { data: admin, error } = await supabaseAdmin
          .from("admin_users")
          .select("*")
          .eq("email", email)
          .single();

        console.log(
          "[AUTH] Query result - error:",
          error?.message,
          "admin:",
          admin ? "found" : "not found",
        );

        if (error || !admin) {
          console.log("[AUTH] User not found or query error");
          throw new Error("Invalid email or password");
        }

        if (!admin.is_active) {
          console.log("[AUTH] Account is disabled");
          throw new Error("Account is disabled");
        }

        console.log("[AUTH] Comparing password...");
        console.log(
          "[AUTH] Password hash from DB:",
          admin.password_hash?.substring(0, 20) + "...",
        );

        const isValid = await bcrypt.compare(password, admin.password_hash);
        console.log("[AUTH] Password valid:", isValid);

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        await supabaseAdmin
          .from("admin_users")
          .update({ last_login: new Date().toISOString() })
          .eq("id", admin.id);

        await logAuditAction({
          admin_id: admin.id,
          admin_email: admin.email,
          action: "login",
          entity_type: "admin_user",
          entity_id: admin.id,
          old_values: null,
          new_values: null,
          ip_address: null,
          user_agent: null,
        });

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      },
    }),
  ],

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = request.nextUrl.pathname === "/admin/login";
      const isApiAdminRoute = request.nextUrl.pathname.startsWith("/api/admin");

      if (isApiAdminRoute) {
        return isLoggedIn;
      }

      if (isAdminRoute && !isLoginPage) {
        return isLoggedIn;
      }

      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin", request.nextUrl));
      }

      return true;
    },
  },

  trustHost: true,
});

export async function getCurrentAdmin() {
  const session = await auth();
  if (!session?.user) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}

export async function isSuperAdmin() {
  const admin = await getCurrentAdmin();
  return admin?.role === "super_admin";
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}
