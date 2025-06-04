import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Calendar,
  CalendarDays,
  Clock,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  Plus,
  Users,
  Search,
} from "lucide-react";

// shadcn
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

// Local imports
import Overlay from "../components/overlay";
import { useEventStore } from "../store/useEventsStore";
import LoadingComponent from "../components/loading";
import Navbar from "../components/navbar";
import TopNavigation from "../components/homePage/topNavigation";
import CreateEventForm from "../components/homePage/createEventForm";
import { url } from "../constants/variables";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { events, isLoading, fetchEvents } = useEventStore();
  const [isCreateEventActive, setIsCreateEventActive] = useState(false);

  const recentActivity = [
    {
      action: "New registration",
      event: "Miami Beach Party",
      time: "2 hours ago",
      user: "Sarah Johnson",
    },
    {
      action: "Event published",
      event: "Tech Conference 2024",
      time: "5 hours ago",
      user: "You",
    },
    {
      action: "Ticket purchased",
      event: "Miami Beach Party",
      time: "1 day ago",
      user: "Mike Davis",
    },
    {
      action: "Event created",
      event: "Art Gallery Opening",
      time: "2 days ago",
      user: "You",
    },
  ];
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="relative h-dvh pb-32">
      {/* Floating Elements */}
      <CreateEventForm
        isCreateEventActive={isCreateEventActive}
        setIsCreateEventActive={setIsCreateEventActive}
      />
      <Navbar />
      <Overlay />
      {/* End of floating Elements */}

      <TopNavigation
        isCreateEventActive={isCreateEventActive}
        setIsCreateEventActive={setIsCreateEventActive}
      />

      <div className="body mt-10 font-poppins px-4 md:px-8">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-poppins-bold text-gray-900">
              Welcome back, John!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your events today.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search events..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Attendees
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">587</div>
              <p className="text-xs text-muted-foreground">
                +23% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Events
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming events */}
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <div className="grid gap-6 mt-8 lg:grid-cols-3">
            {/* Upcoming Events */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Upcoming Events</CardTitle>
                      <CardDescription>
                        Your scheduled events for this month
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/event/${event.id}`)}
                    >
                      <div className="relative">
                        <img
                          src={`${url}/event/event-image/${event.id}`}
                          alt={event.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <Badge
                          variant={"default"}
                          className="absolute -top-2 -right-2 text-xs"
                        >
                          Published
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {event.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <CalendarDays className="mr-1 h-3 w-3" />
                            {event.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {event.date}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {event.location}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="mr-1 h-3 w-3" />
                            {event.expected_guests} attendees
                          </div>
                          <Badge variant="outline">party</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-primary/90 hover:bg-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Event
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Guest List
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest updates from your events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.event}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-400">
                            {activity.time}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.user}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
