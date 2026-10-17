import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(30).optional().default(""),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1).max(5000),
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .validator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const db = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { error } = await db.from("contact_messages").insert({
      name: data.name,
      phone: data.phone || null,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
    });
    if (error) {
      console.error("contact insert", error.code);
      throw new Error("Impossible d'enregistrer le message");
    }

    const apiKey = process.env["RESEND_API_KEY"];
    const from = process.env["CONTACT_FROM_EMAIL"];
    const to = process.env["CONTACT_TO_EMAIL"] || "michaelnadrasana@gmail.com";
    let notificationSent = false;

    if (apiKey && from) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [to],
            reply_to: data.email,
            subject: `[Portfolio] ${data.subject.replace(/[\r\n]+/g, " ").trim() || "Nouveau message"}`,
            text: [
              `Nom : ${data.name}`,
              `E-mail : ${data.email}`,
              `Téléphone : ${data.phone || "Non renseigné"}`,
              `Sujet : ${data.subject || "Non renseigné"}`,
              "",
              data.message,
            ].join("\n"),
          }),
        });
        notificationSent = response.ok;
        if (!response.ok) console.error("contact email", response.status);
      } catch {
        console.error("contact email request failed");
      }
    } else {
      console.error("contact email configuration missing");
    }

    return { ok: true, notificationSent };
  });
