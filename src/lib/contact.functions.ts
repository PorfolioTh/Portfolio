import { createServerFn } from "@tanstack/react-start";
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      phone: data.phone || null,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
    });
    if (error) { console.error("contact insert", error); } if (error) throw new Error("Impossible d'enregistrer le message");
    return { ok: true };
  });
