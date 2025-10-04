import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, Upload, Grid3x3, TableProperties, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TODO: Remove mock data
const mockClients = [
  {
    id: "1",
    name: "John Doe",
    cpfCnpj: "24971563792",
    email: "john.doe@asaas.com.br",
    phone: "4738010919",
    mobilePhone: "4799376637",
    groupName: "platinum",
    company: "EASYDEV",
  },
  {
    id: "2",
    name: "Maria Silva",
    cpfCnpj: "12345678901",
    email: "maria.silva@example.com",
    phone: "4738010920",
    mobilePhone: "4799376638",
    groupName: "gold",
    company: "TECHCORP",
  },
  {
    id: "3",
    name: "Pedro Santos",
    cpfCnpj: "98765432100",
    email: "pedro.santos@example.com",
    phone: "4738010921",
    mobilePhone: "4799376639",
    groupName: "bronze",
    company: "STARTUPX",
  },
];

export default function ClientesPage() {
  const { toast } = useToast();
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [filterCompany, setFilterCompany] = useState<string>("all");

  const handleDelete = (id: string) => {
    setClients(clients.filter((c) => c.id !== id));
    toast({ title: "Cliente removido com sucesso!" });
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast({ title: editingClient?.id ? "Cliente atualizado!" : "Cliente criado!" });
    setIsDialogOpen(false);
    setEditingClient(null);
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpfCnpj.includes(searchTerm);
    
    const matchesGroup = filterGroup === "all" || c.groupName === filterGroup;
    const matchesCompany = filterCompany === "all" || c.company === filterCompany;
    
    return matchesSearch && matchesGroup && matchesCompany;
  });

  const uniqueGroups = Array.from(new Set(clients.map(c => c.groupName)));
  const uniqueCompanies = Array.from(new Set(clients.map(c => c.company)));

  const clearFilters = () => {
    setSearchTerm("");
    setFilterGroup("all");
    setFilterCompany("all");
  };

  const hasActiveFilters = searchTerm || filterGroup !== "all" || filterCompany !== "all";

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seus clientes e suas informações
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              data-testid="button-add-client"
              onClick={() => setEditingClient(null)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClient?.id ? "Editar Cliente" : "Novo Cliente"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do cliente abaixo
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 flex flex-col items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" data-testid="button-upload-photo">
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Foto
                </Button>
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Nome completo" data-testid="input-name" />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <Input id="cpfCnpj" placeholder="000.000.000-00" data-testid="input-cpf" />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" data-testid="input-email" />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(47) 3801-0919" data-testid="input-phone" />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="mobilePhone">Celular</Label>
                <Input id="mobilePhone" placeholder="(47) 99937-6637" data-testid="input-mobile" />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" placeholder="Nome da empresa" data-testid="input-company" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  placeholder="Observações sobre o cliente"
                  data-testid="input-observations"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={handleSave}
                data-testid="button-save-client"
              >
                Salvar
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
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          
          <Select value={filterGroup} onValueChange={setFilterGroup}>
            <SelectTrigger className="w-[180px]" data-testid="select-filter-group">
              <SelectValue placeholder="Grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os grupos</SelectItem>
              {uniqueGroups.map(group => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="w-[180px]" data-testid="select-filter-company">
              <SelectValue placeholder="Empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as empresas</SelectItem>
              {uniqueCompanies.map(company => (
                <SelectItem key={company} value={company}>{company}</SelectItem>
              ))}
            </SelectContent>
          </Select>

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
        
        {filteredClients.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredClients.length} de {clients.length} clientes
          </div>
        )}
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="mt-2">
              Limpar filtros
            </Button>
          )}
        </div>
      ) : viewMode === "table" ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Cliente</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover-elevate">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {client.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium" data-testid={`text-client-name-${client.id}`}>
                          {client.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{client.cpfCnpj}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{client.phone}</p>
                      <p className="text-muted-foreground">{client.mobilePhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        client.groupName === "platinum"
                          ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
                          : "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                      }
                    >
                      {client.groupName}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(client)}
                        data-testid={`button-edit-${client.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(client.id)}
                        data-testid={`button-delete-${client.id}`}
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
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover-elevate transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                      {client.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg" data-testid={`text-client-name-${client.id}`}>
                      {client.name}
                    </p>
                    <Badge
                      variant="secondary"
                      className={
                        client.groupName === "platinum"
                          ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white mt-1"
                          : client.groupName === "gold"
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white mt-1"
                          : "bg-gradient-to-r from-orange-400 to-orange-600 text-white mt-1"
                      }
                    >
                      {client.groupName}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CPF/CNPJ</p>
                    <p className="font-mono font-medium">{client.cpfCnpj}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Telefone</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Celular</p>
                    <p className="font-medium">{client.mobilePhone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Empresa</p>
                    <p className="font-medium">{client.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(client)}
                    data-testid={`button-edit-${client.id}`}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(client.id)}
                    data-testid={`button-delete-${client.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
