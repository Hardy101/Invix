import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

// Local imports
import { EventFormData } from "../../constants/interfaces";
import Hr from "../hr";
import NavButton from "../navbutton";
import { useModalState } from "../../store/useModalStore";
import axios from "axios";
import { useToastStore } from "../../store/useToastStore";
import { url } from "../../constants/variables";
import { fetchEventDetails } from "../../utils/functions";

interface EventInfoProps {
  guestList: Array<{ id: string; name: string; tags: string }>;
  setGuestList: React.Dispatch<
    React.SetStateAction<Array<{ id: string; name: string; tags: string }>>
  >;
}

const EventInfo: React.FC<EventInfoProps> = ({ setGuestList }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setIsModalActive } = useModalState();
  const [isFormActive, setIsFormActive] = useState(false); // Track if form is active to show/hide action buttons
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    date: "",
    location: "",
    time: "",
    expected_guests: 0,
  });

  const [isFormChanged, SetisFormChanged] = useState(false); // Track if form is changed to enable the update button

  // Change function for events details
  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetisFormChanged(true);
    setFormData({ ...formData, [name]: value });
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await axios.delete(`${url}/event/delete/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "success",
          text: "Event deleted successfully!",
          subtext: "Navigate to home to view all events",
        });
        navigate("/home");
      } else {
        console.error("Error deleting event:", response.data);
      }
    } catch (err: any) {
      console.error(`Error: ${err}`);
    }
  };

  const updateEventDetails = async () => {
    if (!isFormChanged) return;
    else {
      try {
        const response = await axios.put(
          `${url}/event/update/${id}`,
          formData,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setIsFormActive(false);
          useToastStore.getState().setToastState({
            isToastActive: true,
            type: "success",
            text: "Event updated successfully!",
            subtext: "You have successfully updated the event details",
          });
        } else {
          console.error("Error updating event:", response.data);
        }
      } catch (err: any) {
        console.error(`Error: ${err}`);
      }
    }
  };

  // Load Event Details on initial load
  useEffect(() => {
    if (id) {
      fetchEventDetails(id, setGuestList, setFormData);
    }
  }, [id]);

  return (
    <div className="body mt-4">
      <div className="event-info rounded-xl overflow-clip">
        <img
          src={`${url}/event/event-image/${id}`}
          alt="image of an event"
          className="w-full md:w-1/5"
        />
      </div>

      <h1 className="py-4">
        <input
          readOnly={!isFormActive}
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleEventFormChange}
          className={`w-full rounded-2xl text-xl font-poppins-bold outline-none ${
            isFormActive
              ? "border border-black rounded-2xl p-3"
              : "bg-transparent text-black"
          }`}
        />

        <span
          className={`block font-poppins text-gray-1 ${
            isFormActive ? "mt-2" : ""
          }`}
        >
          <input
            readOnly={!isFormActive}
            id="location"
            name="location"
            value={formData.location}
            onChange={handleEventFormChange}
            className={`w-full outline-none ${
              isFormActive
                ? "border border-black rounded-2xl p-3"
                : "bg-transparent text-black"
            }`}
          />
        </span>
      </h1>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex gap-2 items-center">
          <i className="fa-solid fa-calendar-week"></i>
          <input
            readOnly={!isFormActive}
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleEventFormChange}
            className={`w-full p-2 outline-none ${
              isFormActive ? "border rounded-2xl" : "bg-transparent text-black"
            }`}
          />
        </div>

        <div className="flex gap-2 items-center">
          <i className="fa-solid fa-users"></i>
          <input
            readOnly={!isFormActive}
            type="text"
            id="expected_guests"
            name="expected_guests"
            value={formData.expected_guests}
            onChange={handleEventFormChange}
            className={`w-full p-2 outline-none ${
              isFormActive ? "border rounded-2xl" : "bg-transparent text-black"
            }`}
          />
        </div>

        <div className="col-span-2 flex gap-2 items-center">
          <i className="fa-solid fa-clock"></i>
          <input
            readOnly={!isFormActive}
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleEventFormChange}
            className={`w-full p-2 outline-none ${
              isFormActive ? "border rounded-2xl" : "bg-transparent text-black"
            }`}
          />
        </div>
      </div>

      <Hr />

      {/* Action buttons for editing event details */}
      {isFormActive ? (
        <p
          id="formActions"
          className="animate__animated animate__fadeInUp grid grid-cols-2 md:flex justify-start gap-4 text-sm mt-4"
        >
          <button
            onClick={handleDeleteEvent}
            className="flex gap-2 items-center justify-center text-white bg-red p-2 rounded-md font-poppins-medium my-auto md:m-0"
          >
            Delete event
            <i className="fa-solid fa-trash"></i>
          </button>
          <button
            onClick={() => setIsFormActive(false)}
            className="flex gap-2 items-center justify-center bg-gray-1/30 p-2 rounded-md font-poppins-medium my-auto md:m-0"
          >
            Cancel changes
            <i className="fa-solid fa-xmark"></i>
          </button>
          <button
            onClick={updateEventDetails}
            className={`${
              !isFormChanged ? "bg-gray-1/30 cursor-not-allowed" : "bg-primary text-white"
            } col-span-2 flex gap-2 items-center justify-center p-2 rounded-md font-poppins-medium md:ml-auto`}
          >
            Update event
            <i className="fa-solid fa-pen-nib"></i>
          </button>
        </p>
      ) : (
        <div className="actionBtns flex items-center gap-4 mt-4">
          <NavButton
            onClick={() => setIsFormActive(true)}
            classNames="ml-auto bg-gray-1"
            text="Edit"
          />
          <NavButton
            onClick={() => {
              setIsModalActive(true);
              window.scrollTo(0, 0);
            }}
            classNames="grow bg-primary py-2 ml-auto"
            text="See Guest List"
          />
        </div>
      )}
    </div>
  );
};

export default EventInfo;
