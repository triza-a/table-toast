import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  contact: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setStaff(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching staff",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addStaffMember = async (member: Omit<StaffMember, "id" | "created_at" | "updated_at">) => {
    try {
      const { error } = await supabase.from("staff").insert([member]);
      if (error) throw error;
      toast({ title: "Success", description: "Staff member added successfully" });
    } catch (error: any) {
      toast({
        title: "Error adding staff member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateStaffMember = async (id: string, updates: Partial<StaffMember>) => {
    try {
      const { error } = await supabase
        .from("staff")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Staff member updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error updating staff member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteStaffMember = async (id: string) => {
    try {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Staff member deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error deleting staff member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStaff();

    const channel = supabase
      .channel("staff_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "staff" },
        () => {
          fetchStaff();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { staff, loading, addStaffMember, updateStaffMember, deleteStaffMember, refetch: fetchStaff };
};
