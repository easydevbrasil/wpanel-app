import FornecedoresPage from "../../pages/fornecedores";
import { Toaster } from "@/components/ui/toaster";

export default function FornecedoresPageExample() {
  return (
    <div className="bg-background min-h-screen">
      <FornecedoresPage />
      <Toaster />
    </div>
  );
}
