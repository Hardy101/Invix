import { useState, useEffect } from "react";
import { Users, UserCheck, UserX, Clock, Upload } from "lucide-react";
import axios from "axios";

// shadcn
import { Card } from "../components/ui/card";
import { CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

// local imports
import Charts from "../components/analytics/charts";
import ActivityLog from "../components/analytics/activityLogs";
import TopNavigation from "../components/homePage/topNavigation";
import { useEventStore } from "../store/useEventsStore";
import { url } from "../constants/variables";

export default function Analytics() {
  const [isCreateEventActive, setIsCreateEventActive] = useState(false);
  const { events, fetchEvents } = useEventStore();
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    checkedIn: 0,
    checkedOut: 0,
    pending: 0,
    checkInTimes: [],
  });
  const [eventAnalytics, setEventAnalytics] = useState({
    activityLog: [
      {
        id: 0,
        timestamp: "",
        guestName: "",
        action: "",
        method: "",
        qrCode: "",
      },
    ],
  });

  const eventOptions = events.map((event) => ({
    text: event.name,
    value: event.id.toString(),
  }));

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchEventAnalytics();
    }
  }, [selectedEvent]);

  const fetchEventAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${url}/event/${selectedEvent}/analytics`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const guestStatusData = [
    { name: "Checked In", value: analytics.checkedIn, fill: "#2a9d90" },
    {
      name: "Checked Out",
      value: analytics.checkedOut,
      fill: "hsl(12 76% 61%)",
    },
    { name: "Pending", value: analytics.pending, fill: "hsl(197 37% 24%)" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navigation */}
      <TopNavigation
        isCreateEventActive={isCreateEventActive}
        setIsCreateEventActive={setIsCreateEventActive}
      />
      {/* Header */}
      <div className="border-b bg-white">
        <div className="flex flex-col gap-y-4 items-center py-2 px-6 md:flex-row">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-poppins-bold">
              Guest Management Analytics
            </h1>
          </div>
          <div className="flex items-center space-x-4 md:ml-auto">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Select
              value={selectedEvent}
              onValueChange={setSelectedEvent}
              name="selectevent"
            >
              <SelectTrigger id="selectevent">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {eventOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {!selectedEvent ? (
          <div className="flex items-center justify-center h-[300px]">
            <p>Please select an event to view analytics</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-poppins-medium">
                    Total Guests
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-poppins-bold">
                    {analytics.checkedIn +
                      analytics.checkedOut +
                      analytics.pending}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total registered guests
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-poppins-medium">
                    Checked In
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-poppins-bold">
                    {analytics.checkedIn}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently on premises
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-poppins-medium">
                    Checked Out
                  </CardTitle>
                  <UserX className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-poppins-bold">
                    {analytics.checkedOut}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Completed visits
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-poppins-medium">
                    Pending
                  </CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-poppins-bold">
                    {analytics.pending}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting check-in
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Bar and Piechart */}
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p>Loading analytics data...</p>
              </div>
            ) : (
              <Charts
                guestStatusData={guestStatusData}
                checkinData={analytics.checkInTimes}
              />
            )}

            {/* Activity Logs Table */}
            <ActivityLog logs={eventAnalytics.activityLog} />
          </>
        )}
      </div>
    </div>
  );
}
