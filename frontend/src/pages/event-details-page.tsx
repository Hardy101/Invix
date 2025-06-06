import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Home,
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Share2,
  QrCode,
  BarChart3,
  Download,
  UserCheck,
  AlertCircle,
  MessageSquare,
  Star,
  X,
  Delete,
  Trash,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { EventFormData } from "../constants/interfaces";
import { fetchEventDetails } from "../utils/functions";
import { url } from "../constants/variables";
import axios from "axios";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState<EventFormData>({
    name: "",
    date: "",
    location: "",
    time: "",
    expected_guests: 0,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [guestList, setGuestList] = useState([{ id: "", name: "", tags: "" }]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<"guests" | "edit">("guests");

  const updateEventDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      console.error("No event ID provided");
      return;
    }
    try {
      const response = await axios.put(
        `${url}/event/update/${id}`,
        eventDetails,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        fetchEventDetails(id, setGuestList, setEventDetails);
        setIsSidebarOpen(false);
      } else {
        console.error("Error updating event:", response.data);
      }
    } catch (err: any) {
      console.error(`Error: ${err}`);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await axios.delete(`${url}/event/delete/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        navigate("/home");
      } else {
        console.error("Error deleting event:", response.data);
      }
    } catch (err: any) {
      console.error(`Error: ${err}`);
    }
  };
  const eventData = {
    title: "Avantgardey",
    location: "Tokyo International Forum, Tokyo",
    date: "June 6, 2025",
    time: "21:56",
    status: "Published",
    category: "Performance",
    totalCapacity: 9000,
    registeredGuests: 8456,
    checkedIn: 0,
    checkedOut: 0,
    pending: 8456,
  };

  const recentActivity = [
    { action: "New registration", guest: "Yuki Tanaka", time: "5 minutes ago" },
    {
      action: "Registration confirmed",
      guest: "Hiroshi Sato",
      time: "12 minutes ago",
    },
    {
      action: "New registration",
      guest: "Akiko Yamamoto",
      time: "18 minutes ago",
    },
    {
      action: "Registration confirmed",
      guest: "Kenji Nakamura",
      time: "25 minutes ago",
    },
  ];

  const highlights = [
    "World-class synchronized dance performance",
    "Interactive audience participation segments",
    "Meet & greet with performers",
    "Professional photography allowed",
  ];

  useEffect(() => {
    if (!id) {
      console.error("No event ID provided");
      return;
    }
    fetchEventDetails(id, setGuestList, setEventDetails);
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex flex-col justify-between gap-y-4 px-6 py-3 md:flex-row md:items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Link to="/home">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Event Details</h1>
              <p className="text-sm text-gray-500">Manage your event</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsSidebarOpen(true);
                setSidebarView("guests");
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              Guest List
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsSidebarOpen(true);
                setSidebarView("edit");
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </Button>
            <Button size="sm" onClick={handleDeleteEvent} variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete Event
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white border-l transform transition-transform duration-200 ease-in-out z-10 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {sidebarView === "guests" ? "Guest List" : "Edit Event"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2 mt-2">
              <Button
                variant={sidebarView === "guests" ? "default" : "outline"}
                size="sm"
                onClick={() => setSidebarView("guests")}
                className="flex-1"
              >
                <Users className="mr-2 h-4 w-4" />
                Guests
              </Button>
              <Button
                variant={sidebarView === "edit" ? "default" : "outline"}
                size="sm"
                onClick={() => setSidebarView("edit")}
                className="flex-1"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>

          <div className="p-4">
            {sidebarView === "guests" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Search guests..."
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
                  {guestList.map((guest, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{guest.name}</p>
                        <p className="text-sm text-gray-500">{guest.tags}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Update event form
              <form onSubmit={updateEventDetails} className="space-y-4">
                <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Name</label>
                    <input
                      type="text"
                      value={eventDetails.name}
                      onChange={(e) =>
                        setEventDetails({
                          ...eventDetails,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input
                      type="date"
                      value={eventDetails.date}
                      onChange={(e) =>
                        setEventDetails({
                          ...eventDetails,
                          date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <input
                      type="time"
                      value={eventDetails.time}
                      onChange={(e) =>
                        setEventDetails({
                          ...eventDetails,
                          time: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <input
                      type="text"
                      value={eventDetails.location}
                      onChange={(e) =>
                        setEventDetails({
                          ...eventDetails,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Expected Guests
                    </label>
                    <input
                      type="number"
                      value={eventDetails.expected_guests}
                      onChange={(e) =>
                        setEventDetails({
                          ...eventDetails,
                          expected_guests: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button className="w-full">Save Changes</Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-200 ${
            isSidebarOpen ? "mr-80" : ""
          }`}
        >
          <div className="p-6 space-y-6">
            {/* Event Hero Section */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={`${url}/event/event-image/${id}`}
                        alt={`image of ${eventDetails.name} Event`}
                        className="w-full h-64 object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Prevent infinite loop
                          target.src = "/placeholder-event.jpg"; // Use a placeholder image
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-600 hover:bg-green-600">
                          published
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-white/90">
                          Performance
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                          {eventDetails.name}
                        </h1>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{eventDetails.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium">{eventDetails.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">
                              {eventDetails.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Capacity</p>
                            <p className="font-medium">
                              {eventDetails.expected_guests.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Registration Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Registered</span>
                        <span>
                          {eventData.registeredGuests.toLocaleString()} /{" "}
                          {eventData.totalCapacity.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (eventData.registeredGuests /
                            eventData.totalCapacity) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {eventData.checkedIn}
                        </p>
                        <p className="text-xs text-gray-500">Checked In</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                          {eventData.pending.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                      <QrCode className="mr-2 h-4 w-4" />
                      Generate QR Code
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <Link to={"/analytics"}>Analytics</Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Updates
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Detailed Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="guests">Guests</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Event Highlights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Event Highlights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                            <span className="text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Latest registrations and updates
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">
                                {activity.action}
                              </p>
                              <p className="text-sm text-gray-500">
                                {activity.guest}
                              </p>
                            </div>
                            <p className="text-xs text-gray-400">
                              {activity.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="guests" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Guests
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {eventData.registeredGuests.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        94% of capacity
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Checked In
                      </CardTitle>
                      <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {eventData.checkedIn}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Event hasn't started
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Pending
                      </CardTitle>
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {eventData.pending.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Awaiting check-in
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Settings</CardTitle>
                    <CardDescription>
                      Manage your event configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Registration Open</p>
                        <p className="text-sm text-gray-500">
                          Allow new registrations
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Toggle
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Check-in Enabled</p>
                        <p className="text-sm text-gray-500">
                          Enable QR code check-ins
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">
                          Send updates to guests
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
