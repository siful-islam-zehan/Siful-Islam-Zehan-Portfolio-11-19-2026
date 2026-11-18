import { NextResponse } from "next/server";

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

    // 6. Resolve Formspree endpoint from environment variables
    const formspreeEndpoint =
      process.env.FORMSPREE_ENDPOINT ||
      process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
      (process.env.FORMSPREE_FORM_ID
        ? `https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`
        : null) ||
      (process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
        ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`
        : null);

    if (!formspreeEndpoint || formspreeEndpoint.trim() === "") {
      return NextResponse.json(
        {
          error:
            "Something went wrong. Please try again or contact me directly via email.",
          unconfigured: true,
        },
        { status: 503 }
      );
    }

    // Normalize endpoint URL
    const targetUrl = formspreeEndpoint.startsWith("http")
      ? formspreeEndpoint.trim()
      : `https://formspree.io/f/${formspreeEndpoint.trim()}`;

    // 7. Dispatch payload to Formspree API
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

    const responseData = await formspreeRes.json().catch(() => ({}));

    if (!formspreeRes.ok) {
      return NextResponse.json(
        {
          error:
            "Something went wrong. Please try again or contact me directly via email.",
          details: responseData,
        },
        { status: formspreeRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Your message has been sent successfully. I'll get back to you as soon as possible.",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Something went wrong. Please try again or contact me directly via email.",
      },
      { status: 500 }
    );
  }
}
