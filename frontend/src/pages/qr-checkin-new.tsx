import { useState, useEffect, useRef } from "react";
import {
  QrCode,
  Camera,
  Search,
  UserCheck,
  UserX,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Smartphone,
  Home,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router";
import api, { Guest, EventStats, RecentCheckIn } from "../services/api";
import { useToastStore } from "../store/useToastStore";
import jsQR from "jsqr";

// shadcn
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Alert, AlertDescription } from "../components/ui/alert";

const QRCheckin = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedGuest, setScannedGuest] = useState<Guest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkInStatus, setCheckInStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<EventStats>({
    totalGuests: 0,
    checkedIn: 0,
    pending: 0,
    checkInRate: 0,
  });
  const [recentCheckIns, setRecentCheckIns] = useState<RecentCheckIn[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // TODO: Get event ID from context or URL params
        const eventId = 1; // Replace with actual event ID
        const analytics = await api.getEventAnalytics(eventId);
        setStats(analytics);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "failure",
          text: "Error loading data",
          subtext: "Please try refreshing the page",
        });
      }
    };

    fetchInitialData();
  }, []);

  // QR Scanner setup
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const startScanner = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const scanQRCode = () => {
          if (!videoRef.current || !canvasRef.current || !scannerActive) return;

          const video = videoRef.current;
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");

          if (!context) return;

          // Set canvas dimensions to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw the current video frame on the canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Get the image data from the canvas
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );

          // Scan for QR code
          const code = jsQR(imageData.data, canvas.width, canvas.height);

          if (code) {
            // QR code found
            handleQRScan(code.data);
            return;
          }

          // Continue scanning
          animationFrameId = requestAnimationFrame(scanQRCode);
        };

        // Start scanning
        scanQRCode();
      } catch (error) {
        console.error("Error accessing camera:", error);
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "failure",
          text: "Camera access denied",
          subtext: "Please allow camera access to scan QR codes",
        });
        setScannerActive(false);
      }
    };

    if (scannerActive) {
      startScanner();
    }

    return () => {
      // Cleanup
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [scannerActive]);

  const handleQRScan = async (qrCode: string) => {
    setIsLoading(true);
    try {
      const guest = await api.getGuestByQR(qrCode);
      if (!guest || !guest.name) {
        throw new Error("Invalid guest data received");
      }

      setScannedGuest(guest);
      setCheckInStatus(null);
      setScannerActive(false); // Stop scanning after successful scan
    } catch (error: any) {
      console.error("Error scanning QR code:", error);
      setCheckInStatus("not-found");
      setScannedGuest(null);
      useToastStore.getState().setToastState({
        isToastActive: true,
        type: "failure",
        text: "Guest not found",
        subtext: "Please verify the QR code and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!scannedGuest) return;

    setIsLoading(true);

    try {
      await api.checkInGuest(scannedGuest.qr_token);
      setCheckInStatus("success");
      setScannedGuest({
        ...scannedGuest,
        status: "checked-in",
        checkInTime: new Date().toISOString(),
      });

      // Update stats
      const eventId = 1; // Replace with actual event ID
      const analytics = await api.getEventAnalytics(eventId);
      setStats(analytics);

      useToastStore.getState().setToastState({
        isToastActive: true,
        type: "success",
        text: "Guest checked in successfully",
        subtext: `Welcome ${scannedGuest.name}!`,
      });
    } catch (error: any) {
      console.error("Error checking in guest:", error);
      if (error.response?.status === 409) {
        setCheckInStatus("already-checked-in");
      } else {
        const err_msg = error.response?.data?.detail?.message;
        console.error(err_msg);

        setCheckInStatus("error");
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "failure",
          text: "Error checking in guest",
          subtext: err_msg || "Something went wrong",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const guests = await api.searchGuest(searchQuery);
      if (guests.length > 0) {
        setScannedGuest(guests[0]);
        setCheckInStatus(null);
      } else {
        setCheckInStatus("not-found");
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "failure",
          text: "Guest not found",
          subtext: "Please verify the search query and try again",
        });
      }
    } catch (error) {
      console.error("Error searching guest:", error);
      setCheckInStatus("error");
      useToastStore.getState().setToastState({
        isToastActive: true,
        type: "failure",
        text: "Error searching guest",
        subtext: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setScannedGuest(null);
    setCheckInStatus(null);
    setSearchQuery("");
    setScannerActive(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "checked-in":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Checked In
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "checked-out":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Checked Out
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Link to="/home">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Guest Check-In</h1>
              <p className="text-sm text-gray-500">Avantgardey - Tokyo</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={resetScanner}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Guests
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalGuests.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered attendees
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checked In</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.checkedIn.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Currently present</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting check-in</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Check-in Rate
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.checkInRate}%</div>
              <p className="text-xs text-muted-foreground">Of total capacity</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Scanner Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* QR Scanner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-purple-600" />
                  QR Code Scanner
                </CardTitle>
                <CardDescription>
                  Scan guest QR codes for quick check-in
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!scannerActive ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <Camera className="h-12 w-12 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Ready to Scan
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Click the button below to activate the camera and scan QR
                      codes
                    </p>
                    <Button
                      onClick={() => setScannerActive(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Start Scanner
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full rounded-lg"
                      playsInline
                      muted
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    {isLoading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                          <p>Processing scan...</p>
                        </div>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="absolute top-4 right-4"
                      onClick={() => {
                        if (videoRef.current?.srcObject) {
                          const stream = videoRef.current
                            .srcObject as MediaStream;
                          stream.getTracks().forEach((track) => track.stop());
                        }
                        setScannerActive(false);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Stop Scanner
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-purple-600" />
                  Manual Search
                </CardTitle>
                <CardDescription>
                  Search by name, email, or QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter name, email, or QR code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleManualSearch()
                    }
                    className="flex-1"
                  />
                  <Button onClick={handleManualSearch} disabled={isLoading}>
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            {scannedGuest && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-purple-600" />
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder.svg?height=64&width=64" />
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-lg">
                        {scannedGuest?.name
                          ? scannedGuest.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">
                          {scannedGuest.name}
                        </h3>
                        {scannedGuest.status === "checked_in"
                          ? "checked in"
                          : "pending"}
                      </div>
                      <div className="grid gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Email:</span>
                          <span>{scannedGuest.email}</span>
                        </div>
                        {scannedGuest.checkInTime && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Check-in Time:</span>
                            <span>
                              {new Date(
                                scannedGuest.checkInTime
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Check-in Actions */}
                  <div className="mt-6 space-y-4">
                    {checkInStatus === "success" && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Guest successfully checked in! Welcome to the event.
                        </AlertDescription>
                      </Alert>
                    )}

                    {checkInStatus === "already-checked-in" && (
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                          This guest has already been checked in at{" "}
                          {scannedGuest.checkInTime
                            ? new Date(
                                scannedGuest.checkInTime
                              ).toLocaleString()
                            : "unknown time"}
                          .
                        </AlertDescription>
                      </Alert>
                    )}

                    {checkInStatus === "not-found" && (
                      <Alert className="border-red-200 bg-red-50">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          Guest not found. Please verify the information and try
                          again.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-3">
                      {scannedGuest.status !== "checked-in" &&
                        checkInStatus !== "success" && (
                          <Button
                            onClick={handleCheckIn}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isLoading ? (
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <UserCheck className="mr-2 h-4 w-4" />
                            )}
                            Check In Guest
                          </Button>
                        )}
                      <Button variant="outline" onClick={resetScanner}>
                        Scan Next Guest
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Activity Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Check-ins</CardTitle>
                <CardDescription>Latest guest arrivals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCheckIns.map((checkin) => (
                  <div key={checkin.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {checkin.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {checkin.ticketType}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {checkin.time}
                        </span>
                      </div>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Mobile Scanner
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Guest List
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <UserX className="mr-2 h-4 w-4" />
                  Check Out Guest
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCheckin;
