import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Faq = () => (
  <Accordion type="single" collapsible>
    <AccordionItem value="pergunta">
      <AccordionTrigger>Como funciona?</AccordionTrigger>
      <AccordionContent forceMount>Resposta editorial disponível ao abrir.</AccordionContent>
    </AccordionItem>
  </Accordion>
);

afterEach(cleanup);
describe("FAQ SSR acessível", () => {
  it("inclui a resposta real no HTML mesmo inicialmente fechada", () => {
    const html = renderToStaticMarkup(<Faq />);
    expect(html).toContain("Resposta editorial disponível ao abrir.");
    expect(html).toContain('data-state="closed"');
    expect(html).toContain("data-[state=closed]:hidden");
    expect(html).toContain('aria-expanded="false"');
  });
  it("abre e fecha pelo controle original sem desmontar a resposta", () => {
    render(<Faq />);
    const trigger = screen.getByRole("button", { name: "Como funciona?" });
    const answer = screen.getByText("Resposta editorial disponível ao abrir.");
    const region = answer.closest('[role="region"]');
    expect(region).toHaveAttribute("data-state", "closed");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(region).toHaveAttribute("data-state", "open");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(region).toHaveAttribute("data-state", "closed");
    expect(answer).toBeInTheDocument();
  });
});
