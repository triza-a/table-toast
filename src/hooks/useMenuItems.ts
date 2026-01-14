import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  ingredients: string | null;
  allergens: string[];
  available: boolean;
  created_at: string;
  updated_at: string;
}

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching menu items",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, "id" | "created_at" | "updated_at">) => {
    try {
      const { error } = await supabase.from("menu_items").insert([item]);
      if (error) throw error;
      toast({ title: "Success", description: "Menu item added successfully" });
    } catch (error: any) {
      toast({
        title: "Error adding menu item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const { error } = await supabase
        .from("menu_items")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Menu item updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error updating menu item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Menu item deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error deleting menu item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMenuItems();

    const channel = supabase
      .channel("menu_items_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        () => {
          fetchMenuItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { menuItems, loading, addMenuItem, updateMenuItem, deleteMenuItem, refetch: fetchMenuItems };
};
