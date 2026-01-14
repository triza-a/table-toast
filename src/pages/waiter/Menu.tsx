import { useState } from "react";
import WaiterLayout from "@/components/WaiterLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMenuItems } from "@/hooks/useMenuItems";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const { menuItems, loading } = useMenuItems();

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    toast({
      title: "Added to order",
      description: "Item added to cart successfully",
    });
  };

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  if (loading) {
    return (
      <WaiterLayout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </WaiterLayout>
    );
  }

  return (
    <WaiterLayout>
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Menu</h1>
            <p className="text-muted-foreground">Browse and select items to add to order</p>
          </div>
          {cartItemCount > 0 && (
            <Button>
              View Cart ({cartItemCount})
            </Button>
          )}
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
            <Card key={item.id} className={!item.available ? "opacity-60" : ""}>
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
                  <div className="flex items-start gap-2 p-2 bg-warning/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-warning">Allergens:</p>
                      <p className="text-xs text-warning">{item.allergens.join(", ")}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => addToCart(item.id)}
                    disabled={!item.available}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {item.available ? "Add to Order" : "Unavailable"}
                  </Button>
                  {cart[item.id] && (
                    <div className="flex items-center justify-center w-12 bg-primary text-primary-foreground rounded-md font-bold">
                      {cart[item.id]}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </WaiterLayout>
  );
};

export default Menu;
