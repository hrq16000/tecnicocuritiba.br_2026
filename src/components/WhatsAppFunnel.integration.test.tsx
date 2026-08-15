import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, render, screen, cleanup, waitFor, within, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "@/lib/router-compat";
import { WhatsAppFunnel } from "./WhatsAppFunnel";

// Mock Supabase para o funil não bater na rede.
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({ insert: vi.fn().mockResolvedValue({ data: null, error: null }) }),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
  },
}));

// window.open retorna uma janela "válida" para o fluxo feliz (sem fallback).
const openSpy = vi.fn<(url?: string | URL, target?: string, features?: string) => Window | null>(
  () => ({}) as Window,
);

beforeEach(() => {
  openSpy.mockClear();
  vi.stubGlobal("open", openSpy);
  (window as unknown as { gtag: (...a: unknown[]) => void }).gtag = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  sessionStorage.clear();
});

function renderFunnel() {
  return render(
    <MemoryRouter>
      <WhatsAppFunnel />
    </MemoryRouter>,
  );
}

async function openFunnel() {
  await act(async () => {
    window.dispatchEvent(new CustomEvent("wa-funnel:open", { detail: { location: "test" } }));
  });
  await screen.findByRole("dialog", {}, { timeout: 3000 });
  // Etapa 0 (PF × PJ): os cenários residenciais seguem pelo ramo PF.
  await clickText(/Para mim ou minha residência/i);
  await waitFor(() => expect(dialog().textContent).toMatch(/Qual o equipamento/i), { timeout: 3000 });
}

function dialog() {
  return screen.getByRole("dialog");
}

async function clickText(label: string | RegExp) {
  const d = dialog();
  const buttons = Array.from(d.querySelectorAll<HTMLButtonElement>("button"));
  const matches = (t: string) => (typeof label === "string" ? t === label : label.test(t));
  const btn = buttons.find((b) => matches((b.textContent || "").trim()));
  if (!btn) throw new Error(`Botão "${label}" não encontrado. Disponíveis: ${buttons.map((b) => b.textContent).join(" | ")}`);
  await act(async () => { btn.click(); });
}

/** Preenche a qualificação obrigatória (nome + bairro) da etapa de identidade. */
async function fillQualification() {
  const d = dialog();
  const inputs = Array.from(d.querySelectorAll<HTMLInputElement>("input[type='text'], input:not([type])"));
  const values = ["Cliente Teste", "Batel"];
  for (let i = 0; i < inputs.length && i < values.length; i += 1) {
    await act(async () => {
      fireEvent.change(inputs[i], { target: { value: values[i] } });
    });
  }
}

function getWaUrl(): URL | null {
  for (let i = openSpy.mock.calls.length - 1; i >= 0; i -= 1) {
    const arg = openSpy.mock.calls[i][0];
    const href = typeof arg === "string" ? arg : arg?.toString();
    if (href && href.includes("wa.me")) return new URL(href);
  }
  return null;
}

async function checkAllTerms() {
  const boxes = within(dialog()).getAllByRole("checkbox");
  for (const b of boxes) {
    await act(async () => { (b as HTMLElement).click(); });
  }
}

describe("Triagem V5 — PC funcionando + instalação → REMOTO", () => {
  it("roteia para atendimento remoto e gera mensagem com a modalidade correta", { timeout: 20000 }, async () => {
    renderFunnel();
    await openFunnel();

    await clickText("PC / Notebook");
    await waitFor(() => expect(dialog().textContent).toMatch(/principal objetivo/i), { timeout: 3000 });

    await clickText("Notebook");
    await clickText("Liga e inicia normalmente");
    await fillQualification();
    await clickText("Instalar ou configurar programa");

    // auto-advance → detalhes
    await waitFor(() => expect(dialog().textContent).toMatch(/urgência/i), { timeout: 3000 });
    await clickText("Há poucos dias");
    await clickText(/Próximas 72 horas úteis/i);

    // auto-advance → modalidade
    await waitFor(() => expect(dialog().textContent).toMatch(/Atendimento remoto/i), { timeout: 3000 });
    expect(dialog().textContent).not.toMatch(/Coleta e entrega/i);
    await clickText("Continuar");

    // termos
    await waitFor(() => expect(dialog().textContent).toMatch(/ciência e aceite/i), { timeout: 3000 });
    await checkAllTerms();
    await clickText("Continuar");

    // revisão
    await waitFor(() => expect(dialog().textContent).toMatch(/Triagem completa/i), { timeout: 3000 });
    await clickText("Agendar agora");

    await waitFor(() => expect(getWaUrl()).not.toBeNull(), { timeout: 3000 });
    const text = getWaUrl()!.searchParams.get("text") || "";
    expect(text).toMatch(/PC \/ Notebook/);
    expect(text).toMatch(/Atendimento remoto/i);
    expect(text).toMatch(/72 horas úteis/i);
  });
});

describe("Triagem V5 — TV não liga → COLETA", () => {
  it("exige aceites de coleta e gera mensagem com R$ 299,99", { timeout: 20000 }, async () => {
    renderFunnel();
    await openFunnel();

    await clickText("TV");
    await waitFor(() => expect(dialog().textContent).toMatch(/O que aconteceu/i), { timeout: 3000 });

    await clickText("LED");
    await fillQualification();
    await clickText("Não liga");

    await waitFor(() => expect(dialog().textContent).toMatch(/urgência/i), { timeout: 3000 });
    // TV "não liga" pergunta "quando aconteceu?" e NUNCA frequência
    expect(dialog().textContent).toMatch(/quando aconteceu/i);
    expect(dialog().textContent).not.toMatch(/frequência/i);
    await clickText("Hoje");
    await clickText("Sem pressa");

    await waitFor(() => expect(dialog().textContent).toMatch(/Coleta e entrega/i), { timeout: 3000 });
    expect(dialog().textContent).toMatch(/R\$ 299,99/);
    await clickText("Continuar");

    // termos (coleta = 4) + ciência dos critérios (3X) + 5 pré-requisitos do gate de coleta
    await waitFor(() => expect(dialog().textContent).toMatch(/ciência e aceite/i), { timeout: 3000 });
    const boxes = within(dialog()).getAllByRole("checkbox");
    expect(boxes.length).toBe(10);
    expect(dialog().textContent).toMatch(/pré-requisitos/i);

    // gate fail-closed: faixa logística obrigatória antes de agendar
    const faixaSelect = within(dialog()).getByLabelText(/Faixa de distância/i) as HTMLSelectElement;
    fireEvent.change(faixaSelect, { target: { value: "f1" } });

    // sem aceitar tudo, não abre WhatsApp (Continuar desabilitado)
    await checkAllTerms();
    await clickText("Continuar");


    await waitFor(() => expect(dialog().textContent).toMatch(/Triagem completa/i), { timeout: 3000 });
    await clickText("Agendar agora");

    await waitFor(() => expect(getWaUrl()).not.toBeNull(), { timeout: 3000 });
    const text = getWaUrl()!.searchParams.get("text") || "";
    expect(text).toMatch(/Coleta e entrega/i);
    expect(text).toMatch(/R\$ 299,99/);
  });
});

describe("Triagem V5 — guard de submit", () => {
  it("não abre WhatsApp sem completar a triagem", async () => {
    renderFunnel();
    await openFunnel();
    expect(getWaUrl()).toBeNull();
  });

  it("não existe mais a categoria 'Outro / Só o valor' e sim 'Outro'", async () => {
    renderFunnel();
    await openFunnel();
    expect(dialog().textContent).not.toMatch(/Só o valor/i);
    expect(within(dialog()).getByText("Outro")).toBeInTheDocument();
  });
});
