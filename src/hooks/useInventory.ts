import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface InventoryItem {
  id: string;
  ingredient: string;
  current_stock: number;
  min_stock: number;
  unit: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .order("ingredient", { ascending: true });

      if (error) throw error;
      setInventory(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching inventory",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addInventoryItem = async (item: Omit<InventoryItem, "id" | "created_at" | "updated_at">) => {
    try {
      const { error } = await supabase.from("inventory").insert([item]);
      if (error) throw error;
      toast({ title: "Success", description: "Inventory item added successfully" });
    } catch (error: any) {
      toast({
        title: "Error adding inventory item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      // Auto-calculate status based on stock levels
      if (updates.current_stock !== undefined) {
        const item = inventory.find((i) => i.id === id);
        if (item) {
          const minStock = updates.min_stock ?? item.min_stock;
          if (updates.current_stock <= minStock * 0.5) {
            updates.status = "critical";
          } else if (updates.current_stock <= minStock) {
            updates.status = "low";
          } else {
            updates.status = "good";
          }
        }
      }

      const { error } = await supabase
        .from("inventory")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Inventory updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error updating inventory",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      const { error } = await supabase.from("inventory").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Inventory item deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error deleting inventory item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchInventory();

    const channel = supabase
      .channel("inventory_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory" },
        () => {
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { inventory, loading, addInventoryItem, updateInventoryItem, deleteInventoryItem, refetch: fetchInventory };
};
