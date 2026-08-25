/**
 * LOG DE AUDITORIA DAS FERRAMENTAS MCP (privacy-first)
 * ====================================================
 * Registra apenas: ferramenta, rota solicitada, dono (owner) e resultado.
 *
 * Proibido por contrato: PII, e-mail, telefone, IP, cabeçalhos, token ou
 * qualquer payload do usuário. O `owner` nunca é gravado em claro — é
 * reduzido a um identificador curto e estável (hash não reversível na
 * prática para quem lê o log), suficiente para correlacionar acessos.
 */

export type McpOutcome = "authorized" | "unauthorized" | "error";

export type McpAuditEntry = {
  event: "mcp_tool_access";
  tool: string;
  /** Rota pública solicitada pela ferramenta (nunca query com dados de lead). */
  route: string;
  owner: string;
  outcome: McpOutcome;
  at: string;
};

/** Hash curto e estável (FNV-1a) — sem dependências e sem reverter o valor. */
const shortHash = (value: string): string => {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
};

const EMAIL = /[^\s@]+@[^\s@]+/;

/**
 * Extrai o dono do acesso a partir do contexto de auth do MCP, já anonimizado.
 * Aceita qualquer forma de contexto e nunca lança.
 */
export const resolveOwner = (ctx: unknown): string => {
  const claims =
    (ctx as { auth?: { claims?: Record<string, unknown> }; claims?: Record<string, unknown> })?.auth
      ?.claims ?? (ctx as { claims?: Record<string, unknown> })?.claims;
  const raw = claims?.["sub"] ?? claims?.["client_id"];
  if (typeof raw !== "string" || !raw) return "anonymous";
  // Defensivo: se algum provedor mandar e-mail no `sub`, nunca sai em claro.
  return `owner_${shortHash(EMAIL.test(raw) ? raw.toLowerCase() : raw)}`;
};

/** Monta a entrada estruturada de auditoria (sem efeito colateral). */
export const buildMcpAuditEntry = (input: {
  tool: string;
  route: string;
  outcome: McpOutcome;
  ctx?: unknown;
}): McpAuditEntry => ({
  event: "mcp_tool_access",
  tool: input.tool,
  route: input.route,
  owner: resolveOwner(input.ctx),
  outcome: input.outcome,
  at: new Date().toISOString(),
});

/** Emite o log de auditoria em JSON de uma linha (ingestível por coletor). */
export const logMcpToolAccess = (input: {
  tool: string;
  route: string;
  outcome: McpOutcome;
  ctx?: unknown;
}): McpAuditEntry => {
  const entry = buildMcpAuditEntry(input);
  console.info(JSON.stringify(entry));
  return entry;
};
