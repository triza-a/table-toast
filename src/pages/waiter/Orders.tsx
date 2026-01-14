import { useState } from "react";
import WaiterLayout from "@/components/WaiterLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Send, AlertTriangle, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";
import { useMenuItems } from "@/hooks/useMenuItems";

const Orders = () => {
  const [orderItems, setOrderItems] = useState<
    { id: string; name: string; price: number; quantity: number; allergens: string[] }[]
  >([]);
  const [tableNumber, setTableNumber] = useState("");
  const [customerAllergies, setCustomerAllergies] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const { toast } = useToast();
  const { createOrder, loading: ordersLoading } = useOrders();
  const { menuItems, loading: menuLoading } = useMenuItems();

  const addItemToOrder = (item: typeof menuItems[0]) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: 1,
          allergens: item.allergens || [],
        },
      ];
    });
  };

  const removeItem = (id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.13; // 13% VAT
  const total = subtotal + tax;

  const hasAllergens = orderItems.some((item) => item.allergens.length > 0);

  const handleSubmitOrder = async () => {
    if (!tableNumber) {
      toast({
        title: "Error",
        description: "Please enter a table number",
        variant: "destructive",
      });
      return;
    }

    if (orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to the order",
        variant: "destructive",
      });
      return;
    }

    await createOrder({
      table_number: parseInt(tableNumber),
      status: "pending",
      items: orderItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      special_instructions: specialInstructions || null,
      allergies: customerAllergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      subtotal,
      tax,
      total,
    });

    // Reset form
    setOrderItems([]);
    setTableNumber("");
    setCustomerAllergies("");
    setSpecialInstructions("");
  };

  const loading = ordersLoading || menuLoading;

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
        <div>
          <h1 className="text-3xl font-bold">Create Order</h1>
          <p className="text-muted-foreground">Build and submit customer orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items to Add */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Add Menu Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {menuItems
                    .filter((item) => item.available)
                    .map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        className="h-auto py-2 justify-start"
                        onClick={() => addItemToOrder(item)}
                      >
                        <div className="text-left">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">NRs {item.price}</div>
                        </div>
                      </Button>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No items added yet. Click menu items above to add.
                  </p>
                ) : (
                  orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          NRs {item.price} × {item.quantity}
                        </div>
                        {item.allergens.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3 text-warning" />
                            <span className="text-xs text-warning">
                              {item.allergens.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-bold">
                          NRs {(item.price * item.quantity).toFixed(2)}
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="table">Table Number</Label>
                  <Input
                    id="table"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Enter table number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g., Extra cheese, no onions..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies" className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    Customer Allergies (Important!)
                  </Label>
                  <Textarea
                    id="allergies"
                    value={customerAllergies}
                    onChange={(e) => setCustomerAllergies(e.target.value)}
                    placeholder="Enter allergies separated by commas (e.g., Nuts, Shellfish)..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>NRs {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (13%)</span>
                    <span>NRs {tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">NRs {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {hasAllergens && (
                  <div className="p-3 bg-warning/10 border border-warning rounded-lg">
                    <p className="text-sm font-medium text-warning flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      This order contains allergens
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleSubmitOrder}
                  className="w-full"
                  size="lg"
                  disabled={orderItems.length === 0}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit to Kitchen
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Table:</span>
                  <Badge>{tableNumber || "-"}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span>{orderItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary">Draft</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WaiterLayout>
  );
};

export default Orders;
