// Back-end: recebe a mensagem de interesse e grava no banco de dados.
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const interesseSchema = z.object({
  anuncioId: z.string().trim().min(1).max(80),
  nome: z.string().trim().min(1, "Informe seu nome").max(100),
  email: z.string().trim().email("E-mail inválido").max(200),
  mensagem: z.string().trim().min(1, "Escreva uma mensagem").max(1000),
});

export const enviarInteresse = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => interesseSchema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error("Banco de dados não configurado");
    const db = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await db.from("interesses").insert({
      anuncio_id: data.anuncioId,
      nome: data.nome,
      email: data.email,
      mensagem: data.mensagem,
      origem: "site",
    });
    if (error) {
      console.error(error);
      throw new Error("Não foi possível enviar agora. Tente de novo.");
    }
    return { ok: true };
  });
