import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, DollarSign, Calculator, Grid3x3, TableProperties, X, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Sale, type Plan } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";


export default function VendasPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [filterBillingType, setFilterBillingType] = useState<string>("all");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [formData, setFormData] = useState({
    billingType: "BOLETO",
    customer: "",
    value: 0,
    dueDate: "",
    description: "",
    daysAfterDueDateToRegistrationCancellation: 1,
    externalReference: "",
    installmentCount: 1,
    totalValue: 0,
    installmentValue: 0,
    discountValue: 0,
    discountDueDateLimitDays: 1,
  });

  const { data: sales = [], isLoading } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  const calculateDiscount = () => {
    if (!selectedPlan || !formData.value) {
      toast({ title: "Selecione um plano e informe o valor", variant: "destructive" });
      return;
    }

    const plan = plans.find(p => p.name === selectedPlan);
    if (!plan) {
      toast({ title: "Plano não encontrado", variant: "destructive" });
      return;
    }

    let discountPercent = 0;
    if (formData.billingType === "PIX" || formData.billingType === "BOLETO") {
      discountPercent = plan.cashDiscount;
    } else if (formData.billingType === "CREDIT_CARD") {
      if (formData.installmentCount === 1) {
        discountPercent = plan.cashDiscount;
      } else {
        discountPercent = plan.installmentDiscount;
      }
    }

    const discountValue = Math.round(formData.value * (discountPercent / 100));
    setFormData({ ...formData, discountValue });
    toast({ title: `Desconto de ${discountPercent}% aplicado: ${(discountValue / 100).toFixed(2)}` });
  };

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("/api/sales", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      toast({ title: "Venda criada com sucesso!" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Erro ao criar venda", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof formData }) =>
      apiRequest(`/api/sales/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      toast({ title: "Venda atualizada com sucesso!" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Erro ao atualizar venda", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/sales/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      toast({ title: "Venda removida com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover venda", variant: "destructive" });
    },
  });

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      billingType: sale.billingType,
      customer: sale.customer,
      value: sale.value,
      dueDate: sale.dueDate,
      description: sale.description || "",
      daysAfterDueDateToRegistrationCancellation: sale.daysAfterDueDateToRegistrationCancellation || 1,
      externalReference: sale.externalReference || "",
      installmentCount: sale.installmentCount || 1,
      totalValue: sale.totalValue || 0,
      installmentValue: sale.installmentValue || 0,
      discountValue: sale.discountValue || 0,
      discountDueDateLimitDays: sale.discountDueDateLimitDays || 1,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.customer.trim() || !formData.dueDate) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    if (editingSale) {
      updateMutation.mutate({ id: editingSale.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover esta venda?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingSale(null);
    setFormData({
      billingType: "BOLETO",
      customer: "",
      value: 0,
      dueDate: "",
      description: "",
      daysAfterDueDateToRegistrationCancellation: 1,
      externalReference: "",
      installmentCount: 1,
      totalValue: 0,
      installmentValue: 0,
      discountValue: 0,
      discountDueDateLimitDays: 1,
    });
  };


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const filteredSales = sales.filter((s) => {
    const matchesSearch = s.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.externalReference?.includes(searchTerm);
    
    const matchesBillingType = filterBillingType === "all" || s.billingType === filterBillingType;
    
    let matchesDateRange = true;
    if (filterDateFrom && s.dueDate < filterDateFrom) matchesDateRange = false;
    if (filterDateTo && s.dueDate > filterDateTo) matchesDateRange = false;
    
    return matchesSearch && matchesBillingType && matchesDateRange;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterBillingType("all");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const hasActiveFilters = searchTerm || filterBillingType !== "all" || filterDateFrom || filterDateTo;

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas vendas e cobranças
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              data-testid="button-add-sale"
              onClick={() => resetForm()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSale ? "Editar Venda" : "Nova Venda"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da venda abaixo
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="billingType">Tipo de Cobrança</Label>
                <Select value={formData.billingType} onValueChange={(value) => setFormData({ ...formData, billingType: value })}>
                  <SelectTrigger data-testid="select-billing-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOLETO">Boleto</SelectItem>
                    <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="customer">Nome do Cliente</Label>
                <Input
                  id="customer"
                  placeholder="Nome do cliente"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  data-testid="input-customer"
                />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="plan">Plano do Cliente</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger data-testid="select-plan">
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.name}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="value">Valor (R$)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.value / 100}
                  onChange={(e) => setFormData({ ...formData, value: Math.round(Number(e.target.value) * 100) })}
                  data-testid="input-value"
                />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="dueDate">Data de Vencimento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  data-testid="input-due-date"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Descrição da venda"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  data-testid="input-description"
                />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="externalReference">Referência Externa</Label>
                <Input
                  id="externalReference"
                  placeholder="Pedido #"
                  value={formData.externalReference}
                  onChange={(e) => setFormData({ ...formData, externalReference: e.target.value })}
                  data-testid="input-external-reference"
                />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="installmentCount">Parcelas</Label>
                <Input
                  id="installmentCount"
                  type="number"
                  min="1"
                  value={formData.installmentCount}
                  onChange={(e) => setFormData({ ...formData, installmentCount: Number(e.target.value) })}
                  data-testid="input-installment-count"
                />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="discountValue">Desconto</Label>
                <div className="flex gap-2">
                  <Input
                    id="discountValue"
                    type="number"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    data-testid="input-discount-value"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={calculateDiscount}
                    data-testid="button-calculate-discount"
                    className="flex-shrink-0"
                  >
                    <Calculator className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="discountDueDateLimitDays">Dias Limite Desconto</Label>
                <Input
                  id="discountDueDateLimitDays"
                  type="number"
                  min="1"
                  value={formData.discountDueDateLimitDays}
                  onChange={(e) => setFormData({ ...formData, discountDueDateLimitDays: Number(e.target.value) })}
                  data-testid="input-discount-due-date-limit-days"
                />
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
                data-testid="button-save-sale"
              >
                {createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar vendas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>

          <Select value={filterBillingType} onValueChange={setFilterBillingType}>
            <SelectTrigger className="w-[180px]" data-testid="select-filter-billing-type">
              <SelectValue placeholder="Tipo de Cobrança" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="BOLETO">Boleto</SelectItem>
              <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
              <SelectItem value="PIX">PIX</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-[150px]"
              data-testid="input-filter-date-from"
              placeholder="De"
            />
            <span className="text-muted-foreground">até</span>
            <Input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-[150px]"
              data-testid="input-filter-date-to"
              placeholder="Até"
            />
          </div>

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
              <X className="h-4 w-4 mr-2" />
              Limpar filtros
            </Button>
          )}

          <div className="ml-auto flex items-center gap-2 border rounded-lg p-1">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-8"
              data-testid="button-view-table"
            >
              <TableProperties className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8"
              data-testid="button-view-grid"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filteredSales.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredSales.length} de {sales.length} vendas
          </div>
        )}
      </div>

      {filteredSales.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">Nenhuma venda encontrada</p>
          {hasActiveFilters ? (
            <Button variant="ghost" onClick={clearFilters} className="mt-2">
              Limpar filtros
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">Clique em "Nova Venda" para começar</p>
          )}
        </div>
      ) : viewMode === "table" ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Cliente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id} className="hover-elevate">
                  <TableCell className="font-medium" data-testid={`text-customer-${sale.id}`}>
                    {sale.customer}
                  </TableCell>
                  <TableCell>{sale.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {sale.billingType === "BOLETO" ? "Boleto" : sale.billingType === "PIX" ? "PIX" : "Cartão"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">{formatCurrency(sale.value)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(sale.dueDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(sale)}
                        data-testid={`button-edit-${sale.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(sale.id)}
                        data-testid={`button-delete-${sale.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSales.map((sale) => {
            return (
              <Card key={sale.id} className="hover-elevate transition-all">
                <CardContent className="p-0 flex">
                  <div className="w-2 bg-gradient-to-b from-blue-500 to-purple-600"></div>
                  <div className="flex-1 p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-lg" data-testid={`text-customer-${sale.id}`}>
                          {sale.customer}
                        </p>
                        <p className="text-sm text-muted-foreground">{sale.description || "Sem descrição"}</p>
                      </div>
                      <Badge variant="secondary">
                        {sale.billingType === "BOLETO" ? "Boleto" : sale.billingType === "PIX" ? "PIX" : "Cartão"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Valor</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="font-bold text-xl text-green-600">{formatCurrency(sale.value)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Vencimento</p>
                        <p className="font-semibold">{formatDate(sale.dueDate)}</p>
                      </div>
                    </div>

                    {sale.discountValue && sale.discountValue > 0 && (
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <span>Desconto: {formatCurrency(sale.discountValue)}</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(sale)}
                        data-testid={`button-edit-${sale.id}`}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(sale.id)}
                        data-testid={`button-delete-${sale.id}`}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
