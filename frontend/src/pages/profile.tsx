import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Shield,
  Settings,
  Calendar,
  Users,
  BarChart3,
  Bell,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Building,
  Clock,
  Eye,
  ChevronRight,
} from "lucide-react";

// shadcn
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";

// local imports
import { useAuth } from "../context/AuthProvider";
import { useEventStore } from "../store/useEventsStore";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { events, fetchEvents, clearEvents } = useEventStore();

  const userProfile = {
    name: "Carmine Phalange",
    username: "@carminephalange",
    email: "carmine.phalange@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    company: "Event Solutions Inc.",
    role: "Event Manager",
    joinDate: "January 2023",
    bio: "Hey there, i use Invix",
  };

  const recentEvents = events.slice(0, 2);

  const menuItems = [
    {
      icon: User,
      title: "Account Settings",
      description: "Manage your personal information",
      href: "/settings/account",
    },
    {
      icon: Shield,
      title: "Security Settings",
      description: "Password, 2FA, and privacy",
      href: "/settings/security",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Email and push notification preferences",
      href: "/settings/notifications",
    },
    {
      icon: BarChart3,
      title: "Analytics Preferences",
      description: "Data and reporting settings",
      href: "/settings/analytics",
    },
  ];

  const handleLogout = async () => {
    const success = await logout();

    if (success) {
      clearEvents();
      navigate("/");
    } else {
      console.error("Logout failed. Not navigating.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate(-1)} variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">My Profile</h1>
              <p className="text-sm text-gray-500">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Profile */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src="/images/profile-avatar.png"
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                        {user?.name
                          ?.split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Camera className="h-4 w-4" />
                    </Button> */}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {user?.name}
                      </h2>
                      <p className="text-purple-600 font-medium">
                        @{user?.email}
                      </p>
                      <p className="text-gray-600 mt-2">{userProfile.bio}</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{user?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>--</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>--</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Building className="h-4 w-4" />
                        <span>--</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                        {user?.role}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Joined --</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Your event management statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {events.length}
                    </div>
                    <p className="text-sm text-gray-600">Events Created</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {events.reduce(
                        (total, event) => total + (event.expected_guests || 0),
                        0
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Total Attendees</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Events</CardTitle>
                    <CardDescription>
                      Your latest event activities
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => navigate("/home")}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents &&
                    recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{event.name}</h4>
                            <p className="text-sm text-gray-500">
                              {event.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {event.expected_guests} attendees
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {/* {event.status} */}
                            published
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Settings Menu */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {menuItems.map((item, index) => (
                  <div key={index}>
                    <Button
                      variant="ghost"
                      className="w-full justify-between h-auto p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5 text-purple-600" />
                        <div className="text-left">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Button>
                    {index < menuItems.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy Settings
                </Button>
                <Separator />
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
