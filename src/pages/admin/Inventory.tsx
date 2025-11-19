import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Inventory = () => {
  const inventoryItems = [
    { id: 1, name: "Tomatoes", quantity: 2, unit: "kg", minStock: 10, status: "critical" },
    { id: 2, name: "Mozzarella Cheese", quantity: 5, unit: "kg", minStock: 8, status: "low" },
    { id: 3, name: "Olive Oil", quantity: 1, unit: "L", minStock: 3, status: "critical" },
    { id: 4, name: "Pasta", quantity: 25, unit: "kg", minStock: 15, status: "good" },
    { id: 5, name: "Chicken Breast", quantity: 18, unit: "kg", minStock: 10, status: "good" },
    { id: 6, name: "Lettuce", quantity: 7, unit: "kg", minStock: 5, status: "good" },
    { id: 7, name: "Parmesan", quantity: 4, unit: "kg", minStock: 6, status: "low" },
    { id: 8, name: "Flour", quantity: 30, unit: "kg", minStock: 20, status: "good" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "low":
        return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
      case "good":
        return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const criticalCount = inventoryItems.filter((item) => item.status === "critical").length;
  const lowCount = inventoryItems.filter((item) => item.status === "low").length;

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Inventory & Stock</h1>
            <p className="text-muted-foreground">Monitor and manage ingredient levels</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Ingredient
          </Button>
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
              <div className="text-3xl font-bold text-destructive">{criticalCount}</div>
              <p className="text-xs text-muted-foreground">Requires immediate restock</p>
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
              <div className="text-3xl font-bold text-warning">{lowCount}</div>
              <p className="text-xs text-muted-foreground">Below minimum level</p>
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
                {inventoryItems.filter((item) => item.status === "good").length}
              </div>
              <p className="text-xs text-muted-foreground">Above minimum level</p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min. Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.minStock} {item.unit}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="Add qty"
                        className="w-24"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Inventory;
