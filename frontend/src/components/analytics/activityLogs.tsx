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
  guest_name: string;
  status: string;
  method: string;
  qrCode: string;
}

interface TableProps {
  logs: logs[];
}

const ActivityLog: React.FC<TableProps> = ({ logs }) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (action: string) => {
    switch (action) {
      case "checked_in":
        return (
          <Badge
            variant="default"
            className="bg-green-500/10 text-green-700 hover:bg-green-500/20"
          >
            Checked In
          </Badge>
        );
      case "Checked Out":
        return (
          <Badge
            variant="default"
            className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20"
          >
            Checked Out
          </Badge>
        );
      case "Registration":
        return (
          <Badge
            variant="default"
            className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20"
          >
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
              <TableHead>Guest Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs &&
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {formatTimestamp(log.timestamp)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {log.guest_name}
                  </TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
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
