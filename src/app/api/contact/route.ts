import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, _gotcha } = body;

    // 1. Spam protection: honeypot verification
    // Real users never see or fill this field; if filled, silently discard bot submission
    if (_gotcha && String(_gotcha).trim() !== "") {
      return NextResponse.json({
        success: true,
        message: "Your message has been sent successfully.",
      });
    }

    // 2. Validate Full Name
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Full Name is required." },
        { status: 400 }
      );
    }

    // 3. Validate Email Address
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email Address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // 4. Validate Subject
    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json(
        { error: "Subject is required." },
        { status: 400 }
      );
    }

    // 5. Validate Message
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    let savedToSupabase = false;

    // 6. Attempt saving directly to Supabase table (public.contact_messages)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      supabaseUrl &&
      supabaseKey &&
      supabaseUrl !== "https://your-project-ref.supabase.co"
    ) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error: dbError } = await supabase.from("contact_messages").insert([
          {
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            is_read: false,
            created_at: new Date().toISOString(),
          },
        ]);
        if (!dbError) {
          savedToSupabase = true;
        } else {
          console.warn("Supabase contact_messages insert notice:", dbError.message);
        }
      } catch (err) {
        console.warn("Supabase client connection notice:", err);
      }
    }

    // 7. Resolve Formspree endpoint from environment variables
    const formspreeEndpoint =
      process.env.FORMSPREE_ENDPOINT ||
      process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
      (process.env.FORMSPREE_FORM_ID
        ? `https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`
        : null) ||
      (process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
        ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`
        : null);

    let sentViaFormspree = false;

    if (formspreeEndpoint && formspreeEndpoint.trim() !== "") {
      const targetUrl = formspreeEndpoint.startsWith("http")
        ? formspreeEndpoint.trim()
        : `https://formspree.io/f/${formspreeEndpoint.trim()}`;

      try {
        const formspreeRes = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            _replyto: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
          }),
        });

        if (formspreeRes.ok) {
          sentViaFormspree = true;
        }
      } catch (fetchErr) {
        console.warn("Formspree dispatch error:", fetchErr);
      }
    }

    // 8. Determine final outcome
    // If either Supabase storage or Formspree succeeded, confirm success to the sender
    if (savedToSupabase || sentViaFormspree) {
      return NextResponse.json({
        success: true,
        message:
          "Your message has been sent successfully. I'll review your note and respond shortly.",
      });
    }

    // If neither Formspree nor Supabase contact_messages succeeded:
    return NextResponse.json(
      {
        error:
          "Contact messaging service is currently being configured. Please write directly to hello@sifulislamzehan.dev.",
        unconfigured: true,
      },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Something went wrong. Please try again or write directly to hello@sifulislamzehan.dev.",
      },
      { status: 500 }
    );
  }
}
