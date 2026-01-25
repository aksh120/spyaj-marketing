"use server";

import { supabaseAdmin } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getQuotes() {
    try {
        const { data, error } = await supabaseAdmin
            .from("quote_requests")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Failed to fetch quotes:", error);
        return { success: false, error: "Failed to fetch quotes" };
    }
}

export async function updateQuoteStatus(id: string, newStatus: string) {
    try {
        const { error } = await supabaseAdmin
            .from("quote_requests")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) throw error;

        revalidatePath("/admin/quotes");
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function deleteQuote(id: string) {
    try {
        const { error } = await supabaseAdmin
            .from("quote_requests")
            .delete()
            .eq("id", id);

        if (error) throw error;

        revalidatePath("/admin/quotes");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete quote:", error);
        return { success: false, error: "Failed to delete quote" };
    }
}
