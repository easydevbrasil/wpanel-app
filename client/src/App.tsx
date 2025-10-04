import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import ClientesPage from "@/pages/clientes";
import FornecedoresPage from "@/pages/fornecedores";
import PlansPage from "@/pages/plans";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import { Menu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="flex items-center justify-between px-6 py-3 border-b bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 backdrop-blur-md bg-opacity-90 z-50">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/10"
            data-testid="button-sidebar-toggle"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center md:hidden">
            <span className="text-lg font-bold text-white">W</span>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider style={style as React.CSSProperties} open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <div className="flex w-full h-full">
            <AppSidebar />
            <main className="flex-1 overflow-auto bg-background">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/dashboard" />} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <DashboardPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/clientes">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <ClientesPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/fornecedores">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <FornecedoresPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/plans">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <PlansPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
