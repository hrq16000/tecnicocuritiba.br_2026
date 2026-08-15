import { createFileRoute } from "@tanstack/react-router";
import RemocaoVirusCampoLargo from "@/pages/servico-bairro/RemocaoVirusCampoLargo";

export const Route = createFileRoute("/servicos/remocao-virus/campo-largo")({
  component: RemocaoVirusCampoLargo,
});
