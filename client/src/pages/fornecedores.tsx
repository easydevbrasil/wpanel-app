import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TODO: Remove mock data
const mockSuppliers = [
  {
    id: "1",
    name: "Tech Supplies Inc",
    cpfCnpj: "12.345.678/0001-90",
    email: "contato@techsupplies.com",
    phone: "1140001000",
    category: "Tecnologia",
    status: "active",
  },
  {
    id: "2",
    name: "Office Solutions",
    cpfCnpj: "98.765.432/0001-10",
    email: "vendas@officesolutions.com",
    phone: "1140002000",
    category: "Escritório",
    status: "active",
  },
];

export default function FornecedoresPage() {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

  const handleDelete = (id: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
    toast({ title: "Fornecedor removido com sucesso!" });
  };

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast({ title: editingSupplier?.id ? "Fornecedor atualizado!" : "Fornecedor criado!" });
    setIsDialogOpen(false);
    setEditingSupplier(null);
  };

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fornecedores</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seus fornecedores e parceiros
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              data-testid="button-add-supplier"
              onClick={() => setEditingSupplier(null)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSupplier?.id ? "Editar Fornecedor" : "Novo Fornecedor"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do fornecedor abaixo
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Nome da empresa" data-testid="input-supplier-name" />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="cpfCnpj">CNPJ</Label>
                <Input id="cpfCnpj" placeholder="00.000.000/0000-00" data-testid="input-supplier-cnpj" />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" data-testid="input-supplier-email" />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 4000-1000" data-testid="input-supplier-phone" />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input id="category" placeholder="Categoria do fornecedor" data-testid="input-supplier-category" />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" placeholder="Endereço completo" data-testid="input-supplier-address" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  placeholder="Observações sobre o fornecedor"
                  data-testid="input-supplier-observations"
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
                data-testid="button-save-supplier"
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
            placeholder="Buscar fornecedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-supplier"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Fornecedor</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id} className="hover-elevate">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        {supplier.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium" data-testid={`text-supplier-name-${supplier.id}`}>
                        {supplier.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{supplier.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{supplier.cpfCnpj}</TableCell>
                <TableCell className="text-sm">{supplier.phone}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{supplier.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  >
                    {supplier.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(supplier)}
                      data-testid={`button-edit-supplier-${supplier.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(supplier.id)}
                      data-testid={`button-delete-supplier-${supplier.id}`}
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
