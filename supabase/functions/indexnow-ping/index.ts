// IndexNow ping endpoint.
// POST { urls: string[] } -> notifies Bing/Yandex/Seznam via api.indexnow.org.
// Also accepts a single { url } string. GET returns the configured key for sanity checks.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const HOST = "tecnico.curitiba.br";
const KEY = "f783ab585dfa9e6b017cb058009cccae";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

function normalize(u: string): string | null {
  try {
    if (u.startsWith("/")) return `https://${HOST}${u}`;
    const url = new URL(u);
    if (url.hostname !== HOST && url.hostname !== `www.${HOST}`) return null;
    return `https://${HOST}${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ ok: true, host: HOST, key: KEY, keyLocation: KEY_LOCATION }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { url?: string; urls?: string[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const raw = body.urls && Array.isArray(body.urls) ? body.urls : body.url ? [body.url] : [];
  const urlList = raw
    .map((u) => (typeof u === "string" ? normalize(u) : null))
    .filter((u): u is string => !!u);

  if (urlList.length === 0) {
    return new Response(JSON.stringify({ error: "no_valid_urls" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Ambiente local (supabase start): não chama a internet, apenas simula sucesso.
  const isLocal = (Deno.env.get("SUPABASE_URL") ?? "").includes("127.0.0.1")
    || (Deno.env.get("SUPABASE_URL") ?? "").includes("localhost")
    || Deno.env.get("LOCAL_DEV") === "1";
  if (isLocal) {
    console.log(`[local-mode] IndexNow: ${urlList.length} URL(s) — sucesso simulado, nada enviado.`);
    return new Response(
      JSON.stringify({ ok: true, mocked: true, submitted: urlList.length, host: HOST }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // IndexNow caps at 10,000 URLs per request. We chunk by 1,000 to be safe.
  const chunks: string[][] = [];
  for (let i = 0; i < urlList.length; i += 1000) chunks.push(urlList.slice(i, i + 1000));

  const results: Array<{ status: number; count: number }> = [];

  for (const chunk of chunks) {
    try {
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: HOST,
          key: KEY,
          keyLocation: KEY_LOCATION,
          urlList: chunk,
        }),
      });
      results.push({ status: r.status, count: chunk.length });
    } catch (e) {
      console.error("indexnow chunk failed", e);
      results.push({ status: 0, count: chunk.length });
    }
  }

  const ok = results.every((r) => r.status >= 200 && r.status < 300);
  return new Response(
    JSON.stringify({ ok, submitted: urlList.length, chunks: results, host: HOST }),
    {
      status: ok ? 200 : 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
