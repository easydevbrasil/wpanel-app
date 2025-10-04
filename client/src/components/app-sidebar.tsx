import { LayoutDashboard, Users, Building2, CreditCard, ShoppingCart, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
  },
  {
    title: "Fornecedores",
    url: "/fornecedores",
    icon: Building2,
  },
  {
    title: "Planos",
    url: "/plans",
    icon: CreditCard,
  },
  {
    title: "Vendas",
    url: "/vendas",
    icon: ShoppingCart,
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { toggleSidebar, open } = useSidebar();
  const { logout, user } = useAuth();

  return (
    <Sidebar className="border-r bg-gradient-to-b from-blue-600 via-purple-600 to-purple-700 transition-all duration-300 relative">
      {/* Toggle button on the right side middle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white text-blue-600 shadow-lg z-50 border border-blue-200"
        data-testid="button-sidebar-collapse-toggle"
      >
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
      
      <SidebarHeader className="border-b border-white/10 p-6 group-data-[collapsible=icon]:p-3">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">W</span>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="text-xl font-bold text-white">wPanel</h1>
            <p className="text-xs text-white/70">Painel Administrativo</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider px-3 mb-2 group-data-[collapsible=icon]:hidden">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    className="text-white/70 hover:text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white transition-all group-data-[collapsible=icon]:justify-center"
                    data-testid={`link-${item.title.toLowerCase()}`}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 mb-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mb-2">
          <Avatar className="h-10 w-10 border-2 border-white/20 flex-shrink-0">
            <AvatarFallback className="bg-white/10 text-white font-semibold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-white truncate">{user?.username || "Admin User"}</p>
            <p className="text-xs text-white/60 truncate">admin@wpanel.com</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
          data-testid="button-logout"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-2 flex-shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
