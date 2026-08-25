import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate, useNavigate } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { criarOrdemAdmin } from "@/lib/os/osAdmin.functions";
import { ArrowLeft } from "lucide-react";

/** Abertura de O.S. pelo operador. Nenhum valor é sugerido pelo sistema. */
const AdminOrdemNova = () => {
  const { loading, session, isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [salvando, setSalvando] = useState(false);
  const [f, setF] = useState({
    clienteNome: "",
    telefone: "",
    equipamento: "",
    marcaModelo: "",
    numeroSerie: "",
    sintomas: "",
    tecnicoResponsavel: "",
  });

  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const criar = async () => {
    setSalvando(true);
    try {
      const { protocolo } = await criarOrdemAdmin({
        data: {
          ...f,
          diagnostico: "",
          servicoExecutado: "",
          observacoes: "",
          modalidade: "",
          pecas: [],
          valorServicos: 0,
          desconto: 0,
          pagamentoStatus: "pendente",
          previsaoConclusao: "",
        },
      });
      toast({ title: "Ordem aberta", description: protocolo });
      navigate(`/admin/ordens/${protocolo}`);
    } catch (e) {
      toast({
        title: "Não foi possível abrir a ordem",
        description: e instanceof Error ? e.message : "Erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-10 w-64" />
      </div>
    );
  }
  if (!session || !isAdmin) return <Navigate to="/admin/login" />;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Nova ordem de serviço — painel interno</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-10">
        <Link to="/admin/ordens" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Todas as ordens
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-foreground">Nova ordem de serviço</h1>
        <Card className="space-y-3 p-5">
          <Input placeholder="Nome do cliente" value={f.clienteNome} onChange={(e) => set("clienteNome")(e.target.value)} />
          <Input placeholder="Telefone (com DDD)" value={f.telefone} onChange={(e) => set("telefone")(e.target.value)} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Input placeholder="Equipamento" value={f.equipamento} onChange={(e) => set("equipamento")(e.target.value)} />
            <Input placeholder="Marca/modelo" value={f.marcaModelo} onChange={(e) => set("marcaModelo")(e.target.value)} />
            <Input placeholder="Número de série" value={f.numeroSerie} onChange={(e) => set("numeroSerie")(e.target.value)} />
          </div>
          <Textarea rows={4} placeholder="Problema relatado pelo cliente" value={f.sintomas} onChange={(e) => set("sintomas")(e.target.value)} />
          <Input placeholder="Técnico responsável" value={f.tecnicoResponsavel} onChange={(e) => set("tecnicoResponsavel")(e.target.value)} />
          <Button
            onClick={() => void criar()}
            disabled={salvando || f.clienteNome.trim().length < 2 || f.telefone.replace(/\D/g, "").length < 10}
          >
            {salvando ? "Abrindo…" : "Abrir ordem"}
          </Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminOrdemNova;
