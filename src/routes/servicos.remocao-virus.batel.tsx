import { createFileRoute } from "@tanstack/react-router";
import RemocaoVirusBatel from "@/pages/servico-bairro/RemocaoVirusBatel";

export const Route = createFileRoute("/servicos/remocao-virus/batel")({
  component: RemocaoVirusBatel,
});
