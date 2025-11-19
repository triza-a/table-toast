import ChefLayout from "@/components/ChefLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const InventoryAlert = () => {
  const inventoryItems = [
    { name: "Tomatoes", current: 2, min: 10, unit: "kg", usage: "High", status: "critical" },
    { name: "Mozzarella", current: 5, min: 8, unit: "kg", usage: "High", status: "low" },
    { name: "Olive Oil", current: 1, min: 3, unit: "L", usage: "Medium", status: "critical" },
    { name: "Basil", current: 0.5, min: 2, unit: "kg", usage: "High", status: "critical" },
    { name: "Parmesan", current: 4, min: 6, unit: "kg", usage: "Medium", status: "low" },
    { name: "Chicken Breast", current: 18, min: 10, unit: "kg", usage: "Low", status: "good" },
    { name: "Pasta", current: 25, min: 15, unit: "kg", usage: "Low", status: "good" },
  ];

  const criticalItems = inventoryItems.filter((item) => item.status === "critical");
  const lowItems = inventoryItems.filter((item) => item.status === "low");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive";
      case "low":
        return "warning";
      case "good":
        return "success";
      default:
        return "secondary";
    }
  };

  const getStockPercentage = (current: number, min: number) => {
    return Math.min((current / min) * 100, 100);
  };

  return (
    <ChefLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Inventory Alerts</h1>
          <p className="text-muted-foreground">Monitor ingredient levels for today's service</p>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-destructive">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                Critical Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{criticalItems.length}</div>
              <p className="text-xs text-muted-foreground">Urgent restocking needed</p>
            </CardContent>
          </Card>

          <Card className="border-warning">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4 text-warning" />
                Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{lowItems.length}</div>
              <p className="text-xs text-muted-foreground">Running below minimum</p>
            </CardContent>
          </Card>

          <Card className="border-success">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4 text-success" />
                Well Stocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {inventoryItems.filter((i) => i.status === "good").length}
              </div>
              <p className="text-xs text-muted-foreground">Sufficient for service</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Items Alert */}
        {criticalItems.length > 0 && (
          <Card className="border-2 border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                URGENT: Critical Stock Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalItems.map((item, idx) => (
                  <div key={idx} className="p-4 bg-destructive/10 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{item.name}</span>
                      <Badge variant="destructive">CRITICAL</Badge>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Current: {item.current} {item.unit}
                      </span>
                      <span className="text-muted-foreground">
                        Min: {item.min} {item.unit}
                      </span>
                    </div>
                    <Progress value={getStockPercentage(item.current, item.min)} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Inventory Items */}
        <Card>
          <CardHeader>
            <CardTitle>All Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryItems.map((item, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          {item.usage} Usage
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      className={
                        item.status === "critical"
                          ? "bg-destructive text-destructive-foreground"
                          : item.status === "low"
                          ? "bg-warning text-warning-foreground"
                          : "bg-success text-success-foreground"
                      }
                    >
                      {item.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Current Stock: {item.current} {item.unit}
                      </span>
                      <span className="text-muted-foreground">
                        Minimum: {item.min} {item.unit}
                      </span>
                    </div>
                    <Progress
                      value={getStockPercentage(item.current, item.min)}
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ChefLayout>
  );
};

export default InventoryAlert;
