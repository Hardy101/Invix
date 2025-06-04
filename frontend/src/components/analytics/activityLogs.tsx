import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { Search, Filter } from "lucide-react";

const ActivityLog = () => {
  const activityLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 14:32:15",
      guestName: "John Smith",
      action: "Checked In",
      method: "qrcode",
      qrCode: "QR001234",
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:28:42",
      guestName: "Sarah Johnson",
      action: "Checked Out",
      method: "qrcode",
      qrCode: "QR001235",
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:25:18",
      guestName: "Mike Davis",
      action: "Checked In",
      method: "qrcode",
      qrCode: "QR001236",
    },
    {
      id: 4,
      timestamp: "2024-01-15 14:22:05",
      guestName: "Emily Wilson",
      action: "Registration",
      method: "qrcode",
      qrCode: "QR001237",
    },
    {
      id: 5,
      timestamp: "2024-01-15 14:18:33",
      guestName: "David Brown",
      action: "Checked In",
      method: "qrcode",
      qrCode: "QR001238",
    },
    {
      id: 6,
      timestamp: "2024-01-15 14:15:27",
      guestName: "Lisa Anderson",
      action: "Checked Out",
      method: "qrcode",
      qrCode: "QR001239",
    },
  ];

  const getStatusBadge = (action: string) => {
    switch (action) {
      case "Checked In":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Checked In
          </Badge>
        );
      case "Checked Out":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Checked Out
          </Badge>
        );
      case "Registration":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Registration
          </Badge>
        );
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity Logs</CardTitle>
            <CardDescription>
              Latest guest check-in and check-out activities
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-8 w-[250px]"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>UUID</TableHead>
              <TableHead>Guest Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-sm">
                  {log.timestamp}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {log.qrCode}
                </TableCell>
                <TableCell className="font-medium">{log.guestName}</TableCell>
                <TableCell>{getStatusBadge(log.action)}</TableCell>
                <TableCell>{log.method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
