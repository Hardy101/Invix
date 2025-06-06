"use client";

import { useState } from "react";
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
  TrendingUp,
  Eye,
  MessageSquare,
  Star,
} from "lucide-react";

const EventDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const eventData = {
    title: "Avantgardey",
    location: "Tokyo International Forum, Tokyo",
    date: "June 6, 2025",
    time: "09:44 AM - 11:30 PM",
    status: "Published",
    category: "Performance",
    description:
      "An extraordinary performance showcasing the innovative dance group Avantgardey, featuring synchronized choreography and cutting-edge artistic expression.",
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

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Event Details</h1>
              <p className="text-sm text-gray-500">Manage your event</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Event Hero Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src="/images/avantgardey-event.png"
                    alt="Avantgardey Event"
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 hover:bg-green-600">
                      {eventData.status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/90">
                      {eventData.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {eventData.title}
                      </h1>
                      <p className="text-gray-600">{eventData.description}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{eventData.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{eventData.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{eventData.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-medium">
                          {eventData.totalCapacity.toLocaleString()}
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
                <CardTitle className="text-lg">Registration Status</CardTitle>
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
                      (eventData.registeredGuests / eventData.totalCapacity) *
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
                  <Users className="mr-2 h-4 w-4" />
                  View Guest List
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.guest}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400">{activity.time}</p>
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
                    Total Registered
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
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Registration Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94%</div>
                  <p className="text-xs text-muted-foreground">Above average</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Page Views
                  </CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15.2K</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversion Rate
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">55.6%</div>
                  <p className="text-xs text-muted-foreground">
                    Excellent performance
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Social Shares
                  </CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.8K</div>
                  <p className="text-xs text-muted-foreground">
                    High engagement
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
  );
};

export default EventDetailsPage;
