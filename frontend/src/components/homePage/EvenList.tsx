import { useNavigate } from "react-router-dom";

// Local imports
import { useEventStore } from "../../store/useEventsStore";
import { img } from "../../constants/media";
import { formatDate } from "../../utils/functions";

const EventList = () => {
  const navigate = useNavigate();
  const { events } = useEventStore();
  return (
    <ul
      id="events"
      className="mt-8 text-black grid md:grid-cols-4 items-start gap-8"
    >
      {events.map((event) => (
        <li
          onClick={() => navigate(`/event/${event.id}`)}
          key={event.id}
          className="relative aspect-[3/2] flex flex-col rounded-3xl p-3 font-dmserif cursor-pointer"
        >
          <button id="linkout" className="absolute -bottom-2 -right-2 z-5">
            {/* <Link
              to={`/event/${event.id}`}
              className="flex bg-primary border-2 border-white py-2 px-3 rounded-full text-white text-4xl"
            >
              <i className="fa-solid fa-arrow-up-long rotate-45"></i>
            </Link> */}
          </button>
          <img
            src={img.bd}
            alt="image of a birthday"
            className="absolute top-0 left-0 w-full h-full rounded-3xl z-1"
          />
          <div className="overlay bg-black/30 absolute top-0 left-0 w-full h-full rounded-3xl z-2"></div>
          <div className="txt mt-auto z-4">
            <h3 className="text-2xl text-white">{event.name}</h3>
            <p className="w-fit bg-white rounded-full px-4 py-1">
              {formatDate(event.date).month} {formatDate(event.date).day}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EventList;
