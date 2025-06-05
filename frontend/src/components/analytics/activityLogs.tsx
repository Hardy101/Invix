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

interface logs {
  id: number;
  timestamp: string;
  guestName: string;
  action: string;
  method: string;
  qrCode: string;
}

interface TableProps {
  logs: logs[];
}

const ActivityLog: React.FC<TableProps> = ({ logs }) => {
 

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
        <div className="flex flex-wrap gap-y-4 items-center justify-between">
          <div className="flex flex-col gap-y-2">
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
            {logs.map((log) => (
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
