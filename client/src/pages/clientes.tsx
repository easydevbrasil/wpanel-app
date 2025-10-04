import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Pencil, Trash2, Search, Upload } from "lucide-react";
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
];

export default function ClientesPage() {
  const { toast } = useToast();
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

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

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
      </div>

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
    </div>
  );
}
