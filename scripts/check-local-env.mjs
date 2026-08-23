#!/usr/bin/env node
/**
 * ISOLAMENTO DO AMBIENTE LOCAL.
 *
 * Roda antes de `dev:local` e garante que a máquina do desenvolvedor não
 * aponte acidentalmente para o backend de produção.
 *
 * Falha (exit 1) quando LOCAL_DEV/OFFLINE está ativo mas a URL do Supabase
 * é remota. Apenas avisa quando o `.env.local` ainda não existe.
 */
import { existsSync, readFileSync } from "node:fs";

function fromEnvFile(file, name) {
  if (!existsSync(file)) return undefined;
  const line = readFileSync(file, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith(`${name}=`));
  return line?.slice(name.length + 1).trim().replace(/^["']|["']$/g, "");
}

// Precedência do Vite: process.env > .env.local > .env
function resolve(name) {
  return process.env[name] || fromEnvFile(".env.local", name) || fromEnvFile(".env", name);
}

const hasLocalEnv = existsSync(".env.local");
if (!hasLocalEnv) {
  console.warn(
    "[local-env] `.env.local` não encontrado — rode `cp .env.example .env.local` " +
      "para não usar as credenciais da nuvem por engano.",
  );
}

const url = resolve("VITE_SUPABASE_URL") ?? "";
const isLocalUrl = /^https?:\/\/(127\.0\.0\.1|localhost|0\.0\.0\.0)(:|\/|$)/.test(url);
const localFlag = ["1", "true"].includes(resolve("LOCAL_DEV") ?? "") || ["1", "true"].includes(resolve("OFFLINE") ?? "");

if (localFlag && !isLocalUrl) {
  console.error(
    `[local-env] BLOQUEADO: LOCAL_DEV está ativo, mas VITE_SUPABASE_URL aponta para "${url || "(vazio)"}".\n` +
      "           Copie `.env.example` para `.env.local` (http://127.0.0.1:54321) antes de rodar o dev local.",
  );
  process.exit(1);
}

console.log(
  isLocalUrl
    ? "[local-env] OK — frontend e servidor apontam para o Supabase local (127.0.0.1:54321)."
    : "[local-env] Atenção: usando um backend remoto. Isso é esperado apenas fora do modo local.",
);
