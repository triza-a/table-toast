import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, UserCheck, UserX, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Staff = () => {
  const staffMembers = [
    { id: 1, name: "John Doe", role: "Chef", status: "present", shift: "Morning", contact: "john@restaurant.com" },
    { id: 2, name: "Jane Smith", role: "Waiter", status: "present", shift: "Morning", contact: "jane@restaurant.com" },
    { id: 3, name: "Mike Wilson", role: "Waiter", status: "present", shift: "Evening", contact: "mike@restaurant.com" },
    { id: 4, name: "Sarah Connor", role: "Chef", status: "leave", shift: "Morning", contact: "sarah@restaurant.com" },
    { id: 5, name: "Tom Hardy", role: "Manager", status: "present", shift: "Full Day", contact: "tom@restaurant.com" },
    { id: 6, name: "Emma Watson", role: "Waiter", status: "leave", shift: "Evening", contact: "emma@restaurant.com" },
    { id: 7, name: "Chris Evans", role: "Chef", status: "absent", shift: "Evening", contact: "chris@restaurant.com" },
    { id: 8, name: "Lisa Ray", role: "Waiter", status: "present", shift: "Morning", contact: "lisa@restaurant.com" },
  ];

  const presentCount = staffMembers.filter((s) => s.status === "present").length;
  const leaveCount = staffMembers.filter((s) => s.status === "leave").length;
  const absentCount = staffMembers.filter((s) => s.status === "absent").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-success text-success-foreground">Present</Badge>;
      case "leave":
        return <Badge className="bg-warning text-warning-foreground">On Leave</Badge>;
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">Manage employees and track attendance</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Staff Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-success" />
                Present Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{presentCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-warning" />
                On Leave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{leaveCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserX className="w-4 h-4 text-destructive" />
                Absent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{absentCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{staffMembers.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffMembers.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(staff.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{staff.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.shift}</TableCell>
                    <TableCell className="text-muted-foreground">{staff.contact}</TableCell>
                    <TableCell>{getStatusBadge(staff.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Staff;
