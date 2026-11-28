import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

function Example({ persistent = false }: { persistent?: boolean }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="faq">
        <AccordionTrigger>Pergunta frequente</AccordionTrigger>
        <AccordionContent forceMount={persistent ? true : undefined}>
          Resposta disponível para o visitante.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("FAQ estática com acordeão acessível", () => {
  it("mantém a resposta integral no HTML SSR, mas inicia fechada", () => {
    const html = renderToStaticMarkup(<Example persistent />);
    expect(html).toContain("Pergunta frequente");
    expect(html).toContain("Resposta disponível para o visitante.");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("data-[state=closed]:hidden");
  });

  it("mantém inalterados os acordeões sem montagem persistente", () => {
    expect(renderToStaticMarkup(<Example />)).not.toContain("Resposta disponível");
  });

  it("permite expandir e recolher a mesma resposta sem desmontá-la", () => {
    render(<Example persistent />);
    const trigger = screen.getByRole("button", { name: "Pergunta frequente" });
    const region = screen.getByText("Resposta disponível para o visitante.").closest('[role="region"]');
    expect(region).not.toBeNull();
    expect(region).toHaveAttribute("data-state", "closed");
    expect(region).toHaveTextContent("Resposta disponível");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(region).toHaveAttribute("data-state", "open");
    expect(trigger).toHaveAttribute("aria-controls", region!.id);
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(region).toHaveAttribute("data-state", "closed");
    expect(region).toHaveTextContent("Resposta disponível");
  });
});
