import { useState } from "react";

// shadcn
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  X,
  Upload,
  Calendar,
  MapPin,
  Users,
  FileText,
  Plus,
  Trash2,
  ImageIcon,
  Star,
  Save,
  Eye,
} from "lucide-react";

// Local imports
import {
  CreateEventFormProps,
  EventFormData,
} from "../../constants/interfaces";
import { useNavigate } from "react-router";
import { useModalState } from "../../store/useModalStore";
import { useEventStore } from "../../store/useEventsStore";
import axios from "axios";
import { url } from "../../constants/variables";

const CreateEventForm: React.FC<CreateEventFormProps> = ({
  isCreateEventActive,
  setIsCreateEventActive,
}) => {
  const { fetchEvents } = useEventStore();
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    date: "",
    time: "",
    location: "",
    expected_guests: 0,
  });
  const [files, setFiles] = useState<{
    image?: File;
    guest_list?: File;
  }>({});
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const { setIsModalActive } = useModalState();

  const refreshEvents = () => {
    fetchEvents();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles?.[0];
    if (!file) return;
    console.log(files);

    setFiles((prev) => ({ ...prev, [name]: file }));
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("date", formData.date);
    form.append("location", formData.location);
    form.append("expected_guests", formData.expected_guests.toString());

    if (formData.time) form.append("time", formData.time);
    if (formData.image) form.append("image", formData.image);
    if (formData.guest_list) form.append("guest_list", formData.guest_list);

    try {
      const response = await axios.post(`${url}/event/add`, form, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response && response.status === 200) {
        const eventId = response.data.id;
        resetForm();
        setIsModalActive(false);
        navigate(`/event/${eventId}`);
        refreshEvents();
      }
    } catch (err: any) {
      console.error(err?.response?.data);
      setFormError(
        err.response.data.detail ||
          err.response.data.message ||
          "An error occurred"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      location: "",
      expected_guests: 0,
      time: "",
      image: undefined,
      guest_list: undefined,
    });
    setFormError("");
    setFiles({});
  };

  const [highlights, setHighlights] = useState([{ id: 1, text: "" }]);
  const [guestList, setGuestList] = useState<File | null>(null);

  const addHighlight = () => {
    setHighlights([...highlights, { id: Date.now(), text: "" }]);
  };

  const removeHighlight = (id: number) => {
    setHighlights(highlights.filter((h) => h.id !== id));
  };

  const updateHighlight = (id: number, text: string) => {
    setHighlights(highlights.map((h) => (h.id === id ? { ...h, text } : h)));
  };

  return (
    <div
      className={`min-h-screen bg-gray-50/50 p-4 fixed w-full h-full top-0 ${
        isCreateEventActive ? "scale-100" : "scale-0"
      } left-0 bg-white font-poppins overflow-y-auto z-20 transition-all ease-in-out duration-500`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Event
            </h1>
            <p className="text-gray-600 mt-1">
              Fill in the details to create your event
            </p>
          </div>
          <Button
            onClick={() => {
              setIsCreateEventActive(false);
              resetForm();
            }}
            variant="ghost"
            size="icon"
            className="h-10 w-10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter the essential details about your event
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name *</Label>
                  <Input
                    id="eventName"
                    name="name"
                    placeholder="Enter your event name"
                    className="text-base"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Event Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="party">Party</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Date & Time
                </CardTitle>
                <CardDescription>
                  When will your event take place?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      name="date"
                      className="text-base"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      name="time"
                      className="text-base"
                      value={formData.time}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Capacity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  Location & Capacity
                </CardTitle>
                <CardDescription>
                  Where will your event be held?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Venue *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter venue name or address"
                    className="text-base"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expected_guests">Expected Guests *</Label>
                    <Input
                      id="expected_guests"
                      name="expected_guests"
                      type="number"
                      placeholder="0"
                      min="1"
                      className="text-base"
                      value={formData.expected_guests}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  Event Highlights
                </CardTitle>
                <CardDescription>
                  Add key features or activities (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {highlights.map((highlight, index) => (
                  <div key={highlight.id} className="flex gap-2">
                    <Input
                      placeholder={`Highlight ${index + 1}`}
                      value={highlight.text}
                      onChange={(e) =>
                        updateHighlight(highlight.id, e.target.value)
                      }
                      className="flex-1"
                    />
                    {highlights.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeHighlight(highlight.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addHighlight}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Highlight
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-purple-600" />
                  Event Image
                </CardTitle>
                <CardDescription>
                  Upload a cover image for your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept=".png,.jpg"
                  onChange={handleFileChange}
                  hidden
                />
                <label
                  htmlFor="image"
                  className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors"
                >
                  {files.image ? (
                    <div className="space-y-2">
                      <img
                        src={
                          files.image
                            ? URL.createObjectURL(files.image)
                            : "/placeholder.svg"
                        }
                        alt="Event preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFiles({ ...files, image: undefined })}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-purple-600 mx-auto" />
                      <p className="text-sm text-gray-600">
                        Drag & drop or click to upload
                      </p>
                      <Button variant="outline" size="sm">
                        Select Image
                      </Button>
                    </div>
                  )}
                </label>
              </CardContent>
            </Card>

            {/* Guest List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Guest List
                </CardTitle>
                <CardDescription>
                  Upload a CSV file with guest information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  name="guest_list"
                  id="guest_list"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  hidden
                />

                <label
                  htmlFor="guest_list"
                  className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors"
                >
                  {files.guest_list ? (
                    <div className="space-y-2">
                      <FileText className="h-8 w-8 text-green-600 mx-auto" />
                      <p className="text-sm font-poppins-medium">
                        {files.guest_list.name}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGuestList(null)}
                      >
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-purple-600 mx-auto" />
                      <p className="text-sm text-gray-600">Upload CSV file</p>
                      <Button variant="outline" size="sm">
                        Select File
                      </Button>
                      <p className="text-xs text-gray-500">
                        <a href="#" className="text-purple-600 hover:underline">
                          Download template
                        </a>
                      </p>
                    </div>
                  )}
                </label>
              </CardContent>
            </Card>

            {/* Event Status */}
            <Card>
              <CardHeader>
                <CardTitle>Event Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select defaultValue="draft">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Draft
                      </div>
                    </SelectItem>
                    <SelectItem value="published">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Published
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 px-8">
              Create Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateEventForm;
