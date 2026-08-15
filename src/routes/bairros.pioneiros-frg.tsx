import { createFileRoute } from "@tanstack/react-router";
import PioneirosFRG from "@/pages/bairros/PioneirosFRG";

export const Route = createFileRoute("/bairros/pioneiros-frg")({
  component: PioneirosFRG,
});
