import { useState } from "react";
import ChefLayout from "@/components/ChefLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Orders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState([
    {
      id: 1,
      table: "5",
      items: [
        { name: "Margherita Pizza", quantity: 2, ingredients: "Tomato, Mozzarella, Basil" },
        { name: "Caesar Salad", quantity: 1, ingredients: "Lettuce, Parmesan, Croutons" },
      ],
      allergies: "No peanuts, Lactose intolerant",
      status: "pending",
      time: "2 mins ago",
    },
    {
      id: 2,
      table: "3",
      items: [
        { name: "Pasta Carbonara", quantity: 1, ingredients: "Pasta, Bacon, Eggs, Parmesan" },
        { name: "Grilled Chicken", quantity: 1, ingredients: "Chicken, Herbs, Olive oil" },
      ],
      allergies: "",
      status: "preparing",
      time: "5 mins ago",
    },
    {
      id: 3,
      table: "7",
      items: [
        { name: "Tomato Soup", quantity: 2, ingredients: "Tomatoes, Cream, Basil" },
        { name: "Tiramisu", quantity: 2, ingredients: "Mascarpone, Coffee, Ladyfingers" },
      ],
      allergies: "Gluten-free required",
      status: "preparing",
      time: "8 mins ago",
    },
    {
      id: 4,
      table: "2",
      items: [{ name: "Grilled Chicken", quantity: 3, ingredients: "Chicken, Herbs, Olive oil" }],
      allergies: "",
      status: "pending",
      time: "1 min ago",
    },
    {
      id: 5,
      table: "10",
      items: [
        { name: "Margherita Pizza", quantity: 1, ingredients: "Tomato, Mozzarella, Basil" },
        { name: "Caesar Salad", quantity: 2, ingredients: "Lettuce, Parmesan, Croutons" },
        { name: "Tiramisu", quantity: 1, ingredients: "Mascarpone, Coffee, Ladyfingers" },
      ],
      allergies: "Severe nut allergy - IMPORTANT",
      status: "pending",
      time: "Just now",
    },
  ]);

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    toast({
      title: "Order Updated",
      description: `Order #${orderId} marked as ${newStatus}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "preparing":
        return <Badge className="bg-warning text-warning-foreground">Preparing</Badge>;
      case "ready":
        return <Badge className="bg-success text-success-foreground">Ready</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <ChefLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Kitchen Orders</h1>
          <p className="text-muted-foreground">Manage incoming orders and update status</p>
        </div>

        {/* Order Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <Card
              key={order.id}
              className={order.allergies ? "border-warning shadow-lg" : ""}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Table {order.table}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(order.status)}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {order.time}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-lg">
                    #{order.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{item.name}</span>
                        <Badge variant="secondary">×{item.quantity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Ingredients: {item.ingredients}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Allergy Warning */}
                {order.allergies && (
                  <div className="p-3 bg-warning/20 border-2 border-warning rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-warning">ALLERGY ALERT!</p>
                        <p className="text-sm text-warning">{order.allergies}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="flex-1"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Start Preparing
                    </Button>
                  )}
                  {order.status === "preparing" && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="flex-1 bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Ready
                    </Button>
                  )}
                  {order.status === "ready" && (
                    <Button variant="outline" className="flex-1" disabled>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Order Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ChefLayout>
  );
};

export default Orders;
