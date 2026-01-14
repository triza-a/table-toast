import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMenuItems } from "@/hooks/useMenuItems";

const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
    ingredients: "",
    allergens: "",
    available: true,
  });

  const { menuItems, loading, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems();

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.category) return;

    await addMenuItem({
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category,
      ingredients: newItem.ingredients,
      allergens: newItem.allergens.split(",").map((a) => a.trim()).filter(Boolean),
      available: newItem.available,
    });

    setNewItem({
      name: "",
      price: "",
      category: "",
      ingredients: "",
      allergens: "",
      available: true,
    });
    setIsDialogOpen(false);
  };

  const handleToggleAvailability = async (id: string, available: boolean) => {
    await updateMenuItem(id, { available: !available });
  };

  const handleDelete = async (id: string) => {
    await deleteMenuItem(id);
  };

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
            <h1 className="text-3xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage your menu items</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>Create a new dish for your menu</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dish Name</Label>
                    <Input
                      placeholder="e.g., Margherita Pizza"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (NRs)</Label>
                    <Input
                      type="number"
                      placeholder="12.99"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    placeholder="e.g., Main Course"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ingredients</Label>
                  <Textarea
                    placeholder="List ingredients separated by commas"
                    value={newItem.ingredients}
                    onChange={(e) => setNewItem({ ...newItem, ingredients: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Allergens (comma-separated)</Label>
                  <Input
                    placeholder="e.g., Gluten, Dairy, Eggs"
                    value={newItem.allergens}
                    onChange={(e) => setNewItem({ ...newItem, allergens: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Available</Label>
                  <Switch
                    checked={newItem.available}
                    onCheckedChange={(checked) => setNewItem({ ...newItem, available: checked })}
                  />
                </div>
                <Button className="w-full" onClick={handleAddItem}>
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="text-xl font-bold text-primary">NRs {item.price}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Ingredients:</p>
                  <p className="text-sm text-muted-foreground">{item.ingredients}</p>
                </div>
                {item.allergens && item.allergens.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Allergens:</p>
                    <p className="text-sm text-muted-foreground">{item.allergens.join(", ")}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Badge
                    variant={item.available ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleToggleAvailability(item.id, item.available)}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default MenuManagement;
