import { useEffect, useState } from "react";

// Local imports
import Overlay from "../components/overlay";
import { useEventStore } from "../store/useEventsStore";
import LoadingComponent from "../components/loading";
import Navbar from "../components/navbar";
import EventList from "../components/homePage/EvenList";
import TopNavigation from "../components/homePage/topNavigation";
import CreateEventForm from "../components/homePage/createEventForm";

const Home: React.FC = () => {
  const { events, isLoading, fetchEvents } = useEventStore();
  const [isCreateEventActive, setIsCreateEventActive] = useState(false);

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

      <div className="body mt-10 font-poppins-bold px-4 md:px-8">
        {/* Upcoming events div */}
        <div className="w-fit flex flex-col gap-y-8 bg-primary px-4 py-8 rounded-3xl text-white">
          <span className="w-fit px-2 rounded-full text-3xl text-primary bg-white">
            {events.length}
          </span>
          <span className="text-xl">Upcoming events</span>
        </div>

        <h2 className="text-2xl mt-8">Events this month</h2>

        {isLoading ? <LoadingComponent /> : <EventList />}
      </div>
    </div>
  );
};

export default Home;
