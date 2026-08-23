#!/usr/bin/env node
/**
 * O Nitro publica o worker em `.output/{server,public}`. Os validadores SEO
 * legados usam `dist/{server,client}`; espelhamos os artefatos já compilados
 * sem alterar o formato nativo utilizado no deploy.
 */
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const sourceServer = resolve(root, ".output/server");
const sourcePublic = resolve(root, ".output/public");
const targetServer = resolve(root, "dist/server");
const targetClient = resolve(root, "dist/client");

if (!existsSync(sourceServer) || !existsSync(sourcePublic)) {
  // Builds recentes do Nitro já emitem direto em dist/{server,client}.
  if (existsSync(targetServer) && existsSync(targetClient)) {
    console.log("[build-artifacts] dist/{server,client} já emitidos pelo build; nada a espelhar.");
    process.exit(0);
  }
  console.error("[build-artifacts] .output incompleto; rode `vite build` antes dos gates pós-build.");
  process.exit(1);
}

mkdirSync(targetServer, { recursive: true });
mkdirSync(targetClient, { recursive: true });
cpSync(sourceServer, targetServer, { recursive: true, force: true });
cpSync(sourcePublic, targetClient, { recursive: true, force: true });

console.log("[build-artifacts] .output espelhado em dist para os gates pós-build.");
