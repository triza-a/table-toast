import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, Plus, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventory } from "@/hooks/useInventory";

const Inventory = () => {
  const { inventory, loading, updateInventoryItem } = useInventory();
  const [addQuantities, setAddQuantities] = useState<Record<string, string>>({});

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

  const handleAddStock = async (id: string, currentStock: number) => {
    const addQty = parseInt(addQuantities[id] || "0");
    if (addQty > 0) {
      await updateInventoryItem(id, { current_stock: currentStock + addQty });
      setAddQuantities((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const criticalCount = inventory.filter((item) => item.status === "critical").length;
  const lowCount = inventory.filter((item) => item.status === "low").length;
  const goodCount = inventory.filter((item) => item.status === "good").length;

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
              <div className="text-3xl font-bold text-success">{goodCount}</div>
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
                  <TableHead>Add Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.ingredient}</TableCell>
                    <TableCell>
                      {item.current_stock} {item.unit}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.min_stock} {item.unit}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          className="w-20"
                          value={addQuantities[item.id] || ""}
                          onChange={(e) =>
                            setAddQuantities((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddStock(item.id, item.current_stock)}
                        >
                          Add
                        </Button>
                      </div>
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
