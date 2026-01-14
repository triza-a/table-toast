import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  ingredients?: string;
}

export interface Order {
  id: string;
  table_number: number;
  status: string;
  items: OrderItem[];
  special_instructions: string | null;
  allergies: string[];
  subtotal: number;
  tax: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Parse the JSONB items field
      const parsedOrders = (data || []).map((order) => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : JSON.parse(order.items as string || "[]"),
      }));
      
      setOrders(parsedOrders);
    } catch (error: any) {
      toast({
        title: "Error fetching orders",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (order: Omit<Order, "id" | "created_at" | "updated_at">) => {
    try {
      const { error } = await supabase.from("orders").insert([{
        ...order,
        items: JSON.stringify(order.items),
      }]);
      if (error) throw error;
      toast({ title: "Success", description: "Order created successfully" });
    } catch (error: any) {
      toast({
        title: "Error creating order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Order Updated", description: `Order marked as ${status}` });
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Order deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error deleting order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { orders, loading, createOrder, updateOrderStatus, deleteOrder, refetch: fetchOrders };
};
