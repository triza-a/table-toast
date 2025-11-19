import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
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

const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuItems] = useState([
    {
      id: 1,
      name: "Margherita Pizza",
      price: 12.99,
      category: "Main Course",
      ingredients: "Tomato, Mozzarella, Basil",
      available: true,
    },
    {
      id: 2,
      name: "Caesar Salad",
      price: 8.99,
      category: "Appetizer",
      ingredients: "Lettuce, Parmesan, Croutons, Caesar Dressing",
      available: true,
    },
    {
      id: 3,
      name: "Pasta Carbonara",
      price: 14.99,
      category: "Main Course",
      ingredients: "Pasta, Bacon, Eggs, Parmesan",
      available: false,
    },
    {
      id: 4,
      name: "Tiramisu",
      price: 6.99,
      category: "Dessert",
      ingredients: "Mascarpone, Coffee, Ladyfingers",
      available: true,
    },
  ]);

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage your menu items</p>
          </div>
          <Dialog>
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
                    <Input placeholder="e.g., Margherita Pizza" />
                  </div>
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input type="number" placeholder="12.99" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input placeholder="e.g., Main Course" />
                </div>
                <div className="space-y-2">
                  <Label>Ingredients</Label>
                  <Textarea placeholder="List ingredients separated by commas" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Available</Label>
                  <Switch defaultChecked />
                </div>
                <Button className="w-full">Add Item</Button>
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
                  <div className="text-xl font-bold text-primary">${item.price}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Ingredients:</p>
                  <p className="text-sm text-muted-foreground">{item.ingredients}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={item.available ? "default" : "secondary"}>
                    {item.available ? "Available" : "Unavailable"}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon">
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
