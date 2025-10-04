import ClientesPage from "../../pages/clientes";
import { Toaster } from "@/components/ui/toaster";

export default function ClientesPageExample() {
  return (
    <div className="bg-background min-h-screen">
      <ClientesPage />
      <Toaster />
    </div>
  );
}
