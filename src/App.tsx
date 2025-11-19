import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import Inventory from "./pages/admin/Inventory";
import Reports from "./pages/admin/Reports";
import Staff from "./pages/admin/Staff";
import WaiterMenu from "./pages/waiter/Menu";
import WaiterOrders from "./pages/waiter/Orders";
import ChefOrders from "./pages/chef/Orders";
import ChefInventory from "./pages/chef/InventoryAlert";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/menu" element={<MenuManagement />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/staff" element={<Staff />} />
          <Route path="/waiter" element={<WaiterMenu />} />
          <Route path="/waiter/orders" element={<WaiterOrders />} />
          <Route path="/chef" element={<ChefOrders />} />
          <Route path="/chef/inventory" element={<ChefInventory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
