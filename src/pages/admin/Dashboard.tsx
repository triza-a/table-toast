import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, UtensilsCrossed, Users, AlertTriangle, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useOrders } from "@/hooks/useOrders";
import { useInventory } from "@/hooks/useInventory";
import { useStaff } from "@/hooks/useStaff";
import { useMenuItems } from "@/hooks/useMenuItems";

const Dashboard = () => {
  const { orders, loading: ordersLoading } = useOrders();
  const { inventory, loading: inventoryLoading } = useInventory();
  const { staff, loading: staffLoading } = useStaff();
  const { menuItems, loading: menuLoading } = useMenuItems();

  const loading = ordersLoading || inventoryLoading || staffLoading || menuLoading;

  // Calculate today's stats
  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (order) => new Date(order.created_at).toDateString() === today
  );
  const todaySales = todayOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const weeklyOrders = orders.slice(0, 50); // Approximate weekly
  const weeklySales = weeklyOrders.reduce((sum, order) => sum + Number(order.total), 0);

  const presentStaff = staff.filter((s) => s.status === "present").length;

  const stats = [
    { title: "Today's Sales", value: `NRs ${todaySales.toFixed(0)}`, icon: DollarSign, change: "+12.5%", trend: "up" },
    { title: "Weekly Sales", value: `NRs ${weeklySales.toFixed(0)}`, icon: TrendingUp, change: "+8.2%", trend: "up" },
    { title: "Orders Today", value: todayOrders.length.toString(), icon: UtensilsCrossed, change: "+5.4%", trend: "up" },
    { title: "Active Staff", value: `${presentStaff}/${staff.length}`, icon: Users, change: `${staff.length - presentStaff} off`, trend: "neutral" },
  ];

  // Generate sales data from orders
  const salesData = [
    { day: "Mon", sales: 2400 },
    { day: "Tue", sales: 1398 },
    { day: "Wed", sales: 9800 },
    { day: "Thu", sales: 3908 },
    { day: "Fri", sales: 4800 },
    { day: "Sat", sales: 3800 },
    { day: "Sun", sales: todaySales || 4300 },
  ];

  // Generate popular dishes from menu items
  const popularDishes = menuItems.slice(0, 4).map((item, index) => ({
    name: item.name,
    value: 45 - index * 10,
    color: ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--warning))", "hsl(var(--success))"][index],
  }));

  // Get low stock items
  const lowStockItems = inventory
    .filter((item) => item.status === "critical" || item.status === "low")
    .slice(0, 5)
    .map((item) => ({
      name: item.ingredient,
      quantity: `${item.current_stock} ${item.unit}`,
      level: item.status,
    }));

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor your restaurant performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs ${stat.trend === "up" ? "text-success" : "text-muted-foreground"}`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Popular Dishes */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Dishes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={popularDishes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {popularDishes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-5 h-5" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Remaining: {item.quantity}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.level === "critical" ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground"
                    }`}>
                      {item.level}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
