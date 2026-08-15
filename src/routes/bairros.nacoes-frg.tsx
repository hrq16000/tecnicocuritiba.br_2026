import { createFileRoute } from "@tanstack/react-router";
import NacoesFRG from "@/pages/bairros/NacoesFRG";

export const Route = createFileRoute("/bairros/nacoes-frg")({
  component: NacoesFRG,
});
