import { NextRequest, NextResponse } from "next/server";
import { sendQuoteToUser } from "@/lib/email";
import { parseAndValidateBody } from "@/lib/security";

const SEND_QUOTE_SCHEMA = {
    requestId: "uuid",
    contactName: "name",
    email: "email",
    productName: "productName",
    quantity: "safeText",
    quotePrice: "safeText",
} as const;

export async function POST(request: NextRequest) {
    try {
        const result = await parseAndValidateBody(request, SEND_QUOTE_SCHEMA);

        if (!result.success) {
            return result.response;
        }

        const { requestId, ...data } = result.data as any;

        const success = await sendQuoteToUser(data, requestId);

        if (!success) {
            return NextResponse.json(
                { error: "Failed to send quote email" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: "Quote sent successfully" });
    } catch (error) {
        console.error("Error in send-quote API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
