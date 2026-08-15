import { createFileRoute } from "@tanstack/react-router";
import RemocaoVirusCentro from "@/pages/servico-bairro/RemocaoVirusCentro";

export const Route = createFileRoute("/servicos/remocao-virus/centro")({
  component: RemocaoVirusCentro,
});
