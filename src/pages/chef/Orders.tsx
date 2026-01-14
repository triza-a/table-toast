import ChefLayout from "@/components/ChefLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { formatDistanceToNow } from "date-fns";

const Orders = () => {
  const { orders, loading, updateOrderStatus } = useOrders();

  // Filter to show only active orders (not completed)
  const activeOrders = orders.filter((order) => order.status !== "completed");

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

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
  };

  if (loading) {
    return (
      <ChefLayout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ChefLayout>
    );
  }

  return (
    <ChefLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Kitchen Orders</h1>
          <p className="text-muted-foreground">Manage incoming orders and update status</p>
        </div>

        {activeOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No active orders at the moment.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeOrders.map((order) => (
              <Card
                key={order.id}
                className={order.allergies && order.allergies.length > 0 ? "border-warning shadow-lg" : ""}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Table {order.table_number}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(order.status)}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-lg">
                      #{order.id.slice(0, 8)}
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
                        {item.ingredients && (
                          <p className="text-sm text-muted-foreground">
                            Ingredients: {item.ingredients}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Special Instructions */}
                  {order.special_instructions && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium">Special Instructions:</p>
                      <p className="text-sm text-muted-foreground">{order.special_instructions}</p>
                    </div>
                  )}

                  {/* Allergy Warning */}
                  {order.allergies && order.allergies.length > 0 && (
                    <div className="p-3 bg-warning/20 border-2 border-warning rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-warning">ALLERGY ALERT!</p>
                          <p className="text-sm text-warning">{order.allergies.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <Button
                        onClick={() => handleStatusUpdate(order.id, "preparing")}
                        className="flex-1"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Start Preparing
                      </Button>
                    )}
                    {order.status === "preparing" && (
                      <Button
                        onClick={() => handleStatusUpdate(order.id, "ready")}
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
        )}
      </div>
    </ChefLayout>
  );
};

export default Orders;
