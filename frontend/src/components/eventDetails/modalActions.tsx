import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { GuestResponse, Guest } from "../../constants/interfaces";
import { copyToClipboard, fetchEventDetails } from "../../utils/functions";
import ActionButton from "../actionbutton";
import { icons } from "../../constants/media";
import { url } from "../../constants/variables";
import { useParams } from "react-router";
import { useToastStore } from "../../store/useToastStore";

const formFieldClass =
  "border border-gray-400 placeholder:font-poppins p-3 text-sm rounded-xl focus:border-primary focus:outline-none";

const ModalActions: React.FC = () => {
  const { id } = useParams();
  const [guest, setGuest] = useState<Guest>({
    name: "",
    tags: "",
    email: "",
    errors: "",
  });
  const textRef = useRef<HTMLAnchorElement | null>(null);
  const [singleGuest, setSingleGuest] = useState(true); // Track if single guest is selected
  const [guestDetails, setGuestDetails] = useState<GuestResponse>({
    id: 0,
    name: "",
    tags: "",
    qr_token: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [guestList, setGuestList] = useState([{ id: "", name: "", tags: "" }]); // Updates guest list
  const [activeStep, setActiveStep] = useState("guestList");
  const [copied, setCopied] = useState(false);

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file") as File;

    if (!file) return;

    try {
      const response = await axios.post(
        `${url}/event/guests-bulk/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200 && id) {
        fetchEventDetails(id, setGuestList);
        setActiveStep("guestList");
        setSelectedFile(null);
      }
      console.log(response.status);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleGuestFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuest({ ...guest, [name]: value });
  };

  const handleGuestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/event/add-guest/${id}`, guest, {
        withCredentials: true,
      });

      if (response.status === 200 && id) {
        setGuestDetails(response.data);
        setActiveStep("success");
        fetchEventDetails(id, setGuestList);
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "success",
          text: "Guest added successfully!",
          subtext: "Navigate to guest list to view all guests",
        });
      } else {
        console.error("Error adding guest:", response.data);
      }
    } catch (err: any) {
      if (err.response) {
        console.error(`Error: ${JSON.stringify(err.response.data)}`);
        setGuest((prev: Guest) => ({
          ...prev,
          errors: err.response.data.detail,
        }));
      } else {
        console.error(`Error: ${err.message}`);
      }
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    try {
      const response = await axios.delete(
        `${url}/event/delete-guest/${guestId}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200 && id) {
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "success",
          text: "Guest deleted successfully!",
          subtext:
            "The selected guest has been successfully deleted from the system.",
        });
        fetchEventDetails(id, setGuestList);
      } else {
        console.error("Error deleting guest:", response.data);
      }
    } catch (err: any) {
      console.error(`Error: ${err}`);
    }
  };

  const resetModal = () => {
    setGuest({ name: "", tags: "", email: "", errors: "" });
    setSelectedFile(null);
  };
  // Load Event Details on initial load
  useEffect(() => {
    if (id) {
      fetchEventDetails(id, setGuestList);
    }
  }, [id]);

  return (
    <>
      {activeStep == "guestList" && (
        <div className="text-black h-full flex flex-col">
          <h3 className="font-poppins-bold text-xl">Guest List</h3>
          <ul className="grow flex flex-col gap-2 divide-y divide-secondary-2 mt-6 text-xs overflow-y-auto">
            {guestList.map(({ id, name, tags }) => (
              <li
                // onClick={() => setActiveStep("guestDetails")}
                key={id}
                className="grid grid-cols-2 flex-col pb-2 cursor-pointer hover:bg-secondary"
              >
                <span>{name}</span>

                <button
                  onClick={() => handleDeleteGuest(id)}
                  className="flex items-center gap-2 ml-auto bg-red text-right text-white px-2 py-2 rounded-sm hover:bg-red-2"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
                <span className="col-span-2 font-poppins-bold text-primary">
                  {tags}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex gap-4 justify-between">
            <ActionButton
              onClick={() => setActiveStep("addGuest")}
              icon="fa-solid fa-paper-plane"
              text="Send invitations"
              classNames="bg-primary text-white rounded-full"
            />
            <ActionButton
              onClick={() => setActiveStep("addGuest")}
              icon="fa-solid fa-user-plus"
              text="Add guest"
              classNames="bg-primary text-white rounded-full"
            />
          </div>
        </div>
      )}

      {activeStep == "guestDetails" && (
        <div className="text-black grid grid-cols-2">
          <div className="grid">
            <h3 className="font-poppins-bold text-lg">Scarlett Johansson</h3>
            <p className="inline-flex items-center justify-between gap-2 mx-auto text-xs">
              <span className="text-gray-1 underline">
                {`${url}/event/qrcode/${guestDetails.qr_token}`}
              </span>
              <button
                onClick={() => {
                  copyToClipboard(textRef.current).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  });
                }}
                className="bg-primary text-white rounded-md px-2 py-1"
              >
                {copied ? "copied!" : "copy"}
              </button>
            </p>
          </div>

          <img
            src={icons.qrcode}
            alt="Image of a qr code scan"
            className="w-1/2 ml-auto"
          />

          <div className="col-span-2 flex gap-8 items-center justify-between">
            <ActionButton
              onClick={() => setActiveStep("addGuest")}
              text="Edit"
              classNames="grow bg-primary text-white rounded-full"
            />
            <ActionButton
              onClick={() => setActiveStep("addGuest")}
              text="Delete"
              classNames="bg-white text-primary rounded-full border-2 border-primary"
            />
          </div>
        </div>
      )}

      {activeStep == "addGuest" && (
        <div className="text-black">
          <h3 className="font-poppins-bold text-xl">Add guest to list</h3>
          <p className="relative md:w-1/3 mx-auto grid grid-cols-2 text-sm font-poppins-medium text-center bg-primary/10 rounded-2xl p-1 mt-6">
            <span
              className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] bg-primary rounded-2xl transition-transform duration-300 ease-in-out z-0 ${
                singleGuest ? "translate-x-0" : "translate-x-full"
              }`}
            ></span>
            <button
              onClick={() => {
                setSingleGuest(true);
              }}
              type="button"
              className={`py-2 z-10 ${singleGuest ? "text-white" : ""}`}
            >
              Single Guest
            </button>
            <button
              onClick={() => {
                setSingleGuest(false);
                resetModal();
              }}
              type="button"
              className={`py-2 z-10 ${singleGuest ? "" : "text-white"}`}
            >
              Multiple Guests
            </button>
          </p>
          {singleGuest && (
            <form onSubmit={handleGuestSubmit} className="mt-6">
              <div className="form-control grid gap-2">
                <p className="text-red font-poppins-bold">{guest.errors}</p>
              </div>
              <div className="form-control grid gap-2">
                <input
                  type="text"
                  name="name"
                  value={guest.name}
                  onChange={handleGuestFormChange}
                  placeholder="Enter guest name"
                  className={formFieldClass}
                  required
                />
              </div>
              <div className="form-control grid gap-2 mt-4">
                <input
                  type="text"
                  name="tags"
                  value={guest.tags}
                  onChange={handleGuestFormChange}
                  placeholder="Enter tags"
                  className={formFieldClass}
                  required
                />
              </div>
              <div className="form-control grid gap-2 mt-4">
                <input
                  type="email"
                  name="email"
                  value={guest.email}
                  onChange={handleGuestFormChange}
                  placeholder="Enter guest email"
                  className={formFieldClass}
                  required
                />
              </div>

              <div className="form-control flex gap-4 mt-10">
                <ActionButton
                  text="Add Guest"
                  icon="fa-solid fa-user-plus"
                  classNames="w-full bg-primary text-white rounded-full"
                />
                <ActionButton
                  type="button"
                  onClick={() => {
                    setActiveStep("guestList");
                    resetModal();
                  }}
                  text="back"
                  icon="fa-solid fa-arrow-left"
                  classNames="bg-white text-primary border-2 border-primary rounded-full"
                />
              </div>
            </form>
          )}

          {!singleGuest && (
            <form onSubmit={handleFileUpload}>
              <div className="form-control mt-4 flex flex-col gap-4">
                <label className="text-sm font-poppins-medium">
                  Upload Guest List
                </label>
                <label
                  htmlFor="file"
                  className={`${formFieldClass} bg-secondary cursor-pointer`}
                >
                  {selectedFile ? selectedFile.name : "No file uploaded"}
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  accept=".csv,.xls,.xlsx"
                  className={`bg-secondary cursor-pointer hidden`}
                  onChange={handleFileChange}
                />
              </div>
              <div className="form-control mt-8 flex gap-4">
                <ActionButton
                  text="Upload guest list"
                  icon="fa-solid fa-paper-plane"
                  classNames="w-full bg-primary text-white rounded-full"
                />

                <ActionButton
                  type="button"
                  onClick={() => {
                    setActiveStep("guestList");
                    setSingleGuest(true);
                    resetModal();
                  }}
                  text="back"
                  icon="fa-solid fa-arrow-left"
                  classNames="bg-white text-primary border-2 border-primary rounded-full"
                />
              </div>
            </form>
          )}
        </div>
      )}

      {activeStep == "success" && (
        <div className="text-center flex flex-col gap-4">
          <span className="mt-8 text-2xl font-poppins-bold">{guest.name}</span>
          <img
            src={`${url}/event/qrcode/${guestDetails.qr_token}`}
            alt="QR code of profile created successfully"
            className="w-2/3 md:w-1/5 mx-auto"
            style={{
              pointerEvents: "none",
            }}
          />
          <p className="w-full flex items-center flex-col md:flex-row gap-2 mx-auto">
            <a
              href={`${url}/event/qrcode/${guestDetails.qr_token}`}
              target="_blank"
              ref={textRef}
              className="w-full text-gray-1 underline break-all"
            >
              {`${url}/event/qrcode/${guestDetails.qr_token}`}
            </a>
            <button
              onClick={() => {
                copyToClipboard(textRef.current).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              className="w-3/5 bg-primary text-white rounded-md px-2 py-1 text-sm mx-auto md:mx-0 md:w-auto"
            >
              {copied ? "copied!" : "copy"}
            </button>
          </p>
          <div className="form-control mt-8 flex gap-4">
            <ActionButton
              onClick={() => {
                setActiveStep("addGuest");
                setGuest({ name: "", tags: "", email: "", errors: "" });
              }}
              text="Add More Guests"
              classNames="grow bg-primary text-white rounded-full"
            />
            <ActionButton
              onClick={() => {
                setActiveStep("guestList");
                setGuest({ name: "", tags: "", email: "", errors: "" });
              }}
              text="back"
              classNames="text-white bg-red rounded-full"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ModalActions;
