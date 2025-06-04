import { useState, useEffect } from "react";
import axios from "axios";
import { Users, UserCheck, UserX, Clock, Upload } from "lucide-react";

// shadcn
import { Card } from "../components/ui/card";
import { CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

// local imports
import Charts from "../components/analytics/charts";
import ActivityLog from "../components/analytics/activityLogs";
import CustomSelect from "../components/customSelectField";
import { url } from "../constants/variables";
import TopNavigation from "../components/homePage/topNavigation";

interface EventProps {
  name: string;
  id: string;
}

export default function Analytics() {
  const [isCreateEventActive, setIsCreateEventActive] = useState(false);
  const [events, setEvents] = useState<EventProps[]>([]);
  const eventOptions = events.map((event) => ({
    text: event.name,
    value: event.id,
  }));

  const fetchAllEvents = async () => {
    const response = await axios.get(`${url}/event/all`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      setEvents(response.data);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

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
            <CustomSelect
              name="eventSelect"
              id="eventSelect"
              options={eventOptions}
              customClassNames="font-poppins"
            />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
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
              <div className="text-2xl font-poppins-bold">257</div>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
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
              <div className="text-2xl font-poppins-bold">145</div>
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
              <div className="text-2xl font-poppins-bold">89</div>
              <p className="text-xs text-muted-foreground">Completed visits</p>
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
              <div className="text-2xl font-poppins-bold">23</div>
              <p className="text-xs text-muted-foreground">Awaiting check-in</p>
            </CardContent>
          </Card>
        </div>

        <Charts />

        {/* Activity Logs Table */}
        <ActivityLog />
      </div>
    </div>
  );
}
