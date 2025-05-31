// local Imports
import Hr from "../components/hr";
import Modal from "../components/modal";
import { useModalState } from "../store/useModalStore";
import Overlay from "../components/overlay";
import ModalActions from "../components/eventDetails/modalActions";
import NavMenu from "../components/eventDetails/navMenu";
import EventInfo from "../components/eventDetails/eventInfo";
import { useState } from "react";

const EventDetails: React.FC = () => {
  const { setIsModalActive } = useModalState();
  const [guestList, setGuestList] = useState([{ id: "", name: "", tags: "" }]);

  return (
    <div className="relative h-dvh p-4 md:p-8">
      {/* Guest List && Guest Add */}
      <Modal>
        <button
          onClick={() => setIsModalActive(false)}
          className="absolute top-4 right-4 flex bg-black text-white rounded-md py-1 px-2 text-xl transition-all ease-in-out hover:scale-150"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <ModalActions />
      </Modal>
      <Overlay />

      <NavMenu text="Event Details"/>
      <Hr />

      <div className="body mt-4 pb-12">
        <EventInfo guestList={guestList} setGuestList={setGuestList} />
      </div>
    </div>
  );
};

export default EventDetails;
