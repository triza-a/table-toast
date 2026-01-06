import { useState } from "react";
import WaiterLayout from "@/components/WaiterLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Send, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Orders = () => {
  const [orderItems] = useState([
    { id: 1, name: "Margherita Pizza", price: 12.99, quantity: 2, allergens: ["Gluten", "Dairy"] },
    { id: 2, name: "Caesar Salad", price: 8.99, quantity: 1, allergens: ["Gluten", "Dairy", "Eggs"] },
    { id: 3, name: "Grilled Chicken", price: 16.99, quantity: 1, allergens: [] },
  ]);

  const [tableNumber, setTableNumber] = useState("5");
  const [customerAllergies, setCustomerAllergies] = useState("");
  const { toast } = useToast();

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const hasAllergens = orderItems.some((item) => item.allergens.length > 0);

  const handleSubmitOrder = () => {
    toast({
      title: "Order Submitted",
      description: `Order for Table ${tableNumber} has been sent to the kitchen`,
    });
  };

  return (
    <WaiterLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Current Order</h1>
          <p className="text-muted-foreground">Review and submit customer orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        NRs {item.price} × {item.quantity}
                      </div>
                      {item.allergens.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3 text-warning" />
                          <span className="text-xs text-warning">{item.allergens.join(", ")}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold">NRs {(item.price * item.quantity).toFixed(2)}</div>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
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
                  <Label htmlFor="allergies" className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    Customer Allergies (Important!)
                  </Label>
                  <Textarea
                    id="allergies"
                    value={customerAllergies}
                    onChange={(e) => setCustomerAllergies(e.target.value)}
                    placeholder="Enter any allergies or dietary restrictions..."
                    rows={3}
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
                    <span className="text-muted-foreground">Tax (10%)</span>
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

                <Button onClick={handleSubmitOrder} className="w-full" size="lg">
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
                  <Badge>{tableNumber}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span>{orderItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary">In Progress</Badge>
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
