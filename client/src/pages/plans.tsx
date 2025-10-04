import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Percent, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Plan } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

const colorPalettes = [
  { id: "platinum", from: "slate-400", to: "gray-600", label: "Platinum", gradient: "linear-gradient(to right, #94a3b8, #4b5563)" },
  { id: "gold", from: "yellow-400", to: "orange-500", label: "Gold", gradient: "linear-gradient(to right, #facc15, #f97316)" },
  { id: "bronze", from: "orange-600", to: "amber-700", label: "Bronze", gradient: "linear-gradient(to right, #ea580c, #b45309)" },
  { id: "blue-purple", from: "blue-500", to: "purple-600", label: "Azul/Roxo", gradient: "linear-gradient(to right, #3b82f6, #9333ea)" },
  { id: "green-teal", from: "green-500", to: "teal-600", label: "Verde/Turquesa", gradient: "linear-gradient(to right, #22c55e, #0d9488)" },
  { id: "orange-red", from: "orange-500", to: "red-600", label: "Laranja/Vermelho", gradient: "linear-gradient(to right, #f97316, #dc2626)" },
  { id: "pink-rose", from: "pink-500", to: "rose-600", label: "Rosa/Rosa Escuro", gradient: "linear-gradient(to right, #ec4899, #e11d48)" },
  { id: "indigo-blue", from: "indigo-500", to: "blue-600", label: "Índigo/Azul", gradient: "linear-gradient(to right, #6366f1, #2563eb)" },
  { id: "cyan-blue", from: "cyan-500", to: "blue-600", label: "Ciano/Azul", gradient: "linear-gradient(to right, #06b6d4, #2563eb)" },
  { id: "purple-pink", from: "purple-500", to: "pink-600", label: "Roxo/Rosa", gradient: "linear-gradient(to right, #a855f7, #db2777)" },
  { id: "emerald-green", from: "emerald-500", to: "green-600", label: "Esmeralda/Verde", gradient: "linear-gradient(to right, #10b981, #16a34a)" },
  { id: "violet-purple", from: "violet-500", to: "purple-600", label: "Violeta/Roxo", gradient: "linear-gradient(to right, #8b5cf6, #9333ea)" },
];

export default function PlansPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    cashDiscount: 0,
    installmentDiscount: 0,
    subscriptionDiscount: 0,
    colorFrom: "blue-500",
    colorTo: "purple-600",
  });

  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("/api/plans", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({ title: "Plano criado com sucesso!" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Erro ao criar plano", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof formData }) =>
      apiRequest(`/api/plans/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({ title: "Plano atualizado com sucesso!" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Erro ao atualizar plano", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/plans/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({ title: "Plano removido com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover plano", variant: "destructive" });
    },
  });

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      cashDiscount: plan.cashDiscount,
      installmentDiscount: plan.installmentDiscount,
      subscriptionDiscount: plan.subscriptionDiscount,
      colorFrom: plan.colorFrom,
      colorTo: plan.colorTo,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({ title: "Nome do plano é obrigatório", variant: "destructive" });
      return;
    }

    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este plano?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      cashDiscount: 0,
      installmentDiscount: 0,
      subscriptionDiscount: 0,
      colorFrom: "blue-500",
      colorTo: "purple-600",
    });
  };

  const getPlanColor = (plan: Plan) => {
    return `from-${plan.colorFrom} to-${plan.colorTo}`;
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os planos e configure descontos para cada tipo de compra
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              data-testid="button-add-plan"
              onClick={() => resetForm()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? "Editar Plano" : "Novo Plano"}
              </DialogTitle>
              <DialogDescription>
                Configure os descontos para cada tipo de compra
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Plano</Label>
                <Input
                  id="name"
                  placeholder="Ex: Platinum, Gold, Bronze"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-plan-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cashDiscount">Desconto à Vista (%)</Label>
                <Input
                  id="cashDiscount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.cashDiscount}
                  onChange={(e) => setFormData({ ...formData, cashDiscount: Number(e.target.value) })}
                  data-testid="input-cash-discount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installmentDiscount">Desconto Parcelado (%)</Label>
                <Input
                  id="installmentDiscount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.installmentDiscount}
                  onChange={(e) => setFormData({ ...formData, installmentDiscount: Number(e.target.value) })}
                  data-testid="input-installment-discount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscriptionDiscount">Desconto Assinatura (%)</Label>
                <Input
                  id="subscriptionDiscount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.subscriptionDiscount}
                  onChange={(e) => setFormData({ ...formData, subscriptionDiscount: Number(e.target.value) })}
                  data-testid="input-subscription-discount"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Paleta de Cores</Label>
                <div className="flex flex-wrap gap-2">
                  {colorPalettes.map((palette) => (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, colorFrom: palette.from, colorTo: palette.to })}
                      style={{ background: palette.gradient, width: '32px', height: '32px' }}
                      className={`rounded hover:scale-110 transition-transform ${
                        formData.colorFrom === palette.from && formData.colorTo === palette.to
                          ? "ring-2 ring-offset-1 ring-primary"
                          : ""
                      }`}
                      data-testid={`button-color-${palette.id}`}
                      title={palette.label}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Cor selecionada: {formData.colorFrom} → {formData.colorTo}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-plan"
              >
                {createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className="hover-elevate transition-all duration-300 overflow-hidden"
          >
            <CardHeader className={`bg-gradient-to-br ${getPlanColor(plan)} text-white p-6`}>
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl font-bold">{plan.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => handleEdit(plan)}
                    data-testid={`button-edit-plan-${plan.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => handleDelete(plan.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-plan-${plan.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">À Vista</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                    {plan.cashDiscount}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Parcelado</span>
                  </div>
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400">
                    {plan.installmentDiscount}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Assinatura</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                    {plan.subscriptionDiscount}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">Nenhum plano cadastrado</p>
          <p className="text-sm text-muted-foreground mt-1">Clique em "Novo Plano" para começar</p>
        </div>
      )}
    </div>
  );
}
