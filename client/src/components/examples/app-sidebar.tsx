import { AppSidebar } from "../app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-8 bg-background">
          <h2 className="text-2xl font-bold">Main Content Area</h2>
        </div>
      </div>
    </SidebarProvider>
  );
}
