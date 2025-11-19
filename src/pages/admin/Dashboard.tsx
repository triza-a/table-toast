import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, UtensilsCrossed, Users, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  // Dummy data
  const stats = [
    { title: "Today's Sales", value: "$2,450", icon: DollarSign, change: "+12.5%", trend: "up" },
    { title: "Weekly Sales", value: "$15,240", icon: TrendingUp, change: "+8.2%", trend: "up" },
    { title: "Orders Today", value: "142", icon: UtensilsCrossed, change: "+5.4%", trend: "up" },
    { title: "Active Staff", value: "12/15", icon: Users, change: "3 on leave", trend: "neutral" },
  ];

  const salesData = [
    { day: "Mon", sales: 2400 },
    { day: "Tue", sales: 1398 },
    { day: "Wed", sales: 9800 },
    { day: "Thu", sales: 3908 },
    { day: "Fri", sales: 4800 },
    { day: "Sat", sales: 3800 },
    { day: "Sun", sales: 4300 },
  ];

  const popularDishes = [
    { name: "Margherita Pizza", value: 45, color: "hsl(var(--primary))" },
    { name: "Caesar Salad", value: 30, color: "hsl(var(--accent))" },
    { name: "Pasta Carbonara", value: 25, color: "hsl(var(--warning))" },
    { name: "Grilled Chicken", value: 20, color: "hsl(var(--success))" },
  ];

  const lowStockItems = [
    { name: "Tomatoes", quantity: "2 kg", level: "critical" },
    { name: "Mozzarella", quantity: "5 kg", level: "low" },
    { name: "Olive Oil", quantity: "1 L", level: "critical" },
  ];

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
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
