// Local imports
import Navbar from "../components/navbar";
import Overlay from "../components/overlay";
import CustomSelect from "../components/customSelectField";
import Hr from "../components/hr";
import CheckInBarChart from "../components/barCharts";
import AttendancePieChart from "../components/analytics.tsx/pieCharts";
import NavMenu from "../components/eventDetails/navMenu";
import ActivityLog from "../components/analytics.tsx/activityLogs";

const options = [
  { text: "Birthday Party", value: "birthdayparty" },
  { text: "Meeting", value: "meeting" },
];

const chartOptions = [
  { text: "Bar Chart", value: "barchart" },
  { text: "Line Chart", value: "linechart" },
];

const checkInData = [
  { time: "18:00", guest: 12 },
  { time: "18:15", guest: 25 },
  { time: "18:30", guest: 9 },
  { time: "18:45", guest: 18 },
  { time: "19:00", guest: 5 },
  { time: "19:45", guest: 10 },
  { time: "19:55", guest: 25 },
  { time: "20:00", guest: 50 },
  { time: "20:25", guest: 51 },
];

const analyticsParamsClasses = "grid grid-col-3 items-center gap-x-4 gap-y-2";

const Analytics: React.FC = () => {
  return (
    <div className="relative h-dvh md:px-8 p-4 pb-32">
      <Navbar />
      <Overlay />
      <NavMenu text="Analytics" />
      <Hr />

      <div className="main mt-10">
        <div className="heading flex items-center justify-between">
          <h1 className="text-2xl font-poppins-bold">Dashboard</h1>
          <CustomSelect
            name="eventSelect"
            id="eventSelect"
            options={options}
            customClassNames="font-poppins"
          />
        </div>

        <div className="body mt-10">
          <h2 className="text-xl font-poppins-bold mb-4">Overview</h2>
          <Hr />
          <div className="analytics mt-4 grid grid-cols-2 md:grid-cols-6 gap-y-8">
            <p className={analyticsParamsClasses}>
              <span className="text-gray-1 text-sm">Expected guests</span>
              <span className="text-3xl font-poppins-bold">400</span>
            </p>
            <p className={analyticsParamsClasses}>
              <span className="col-span-3 text-gray-1 text-sm">No-shows</span>
              <span className="text-3xl font-poppins-bold">350</span>
              <span className="flex gap-2 items-center w-fit bg-red-100 text-sm text-black px-4 py-px rounded-full">
                <b className="text-red-500 text-xl">•</b>
                20
              </span>
            </p>
            <p className={analyticsParamsClasses}>
              <span className="col-span-3 text-gray-1 text-sm">Check-ins</span>
              <span className="text-3xl font-poppins-bold">50</span>
              <span className="flex gap-2 items-center w-fit bg-green-200 text-sm text-black px-4 py-px rounded-full">
                <b className="text-green-500 text-xl">•</b>
                20%
              </span>
            </p>
            <p className={analyticsParamsClasses}>
              <span className="col-span-3 text-gray-1 text-sm">Check-outs</span>
              <span className="text-3xl font-poppins-bold">0</span>
              <span className="flex gap-2 items-center w-fit bg-amber-200 text-sm text-black px-4 py-px rounded-full">
                <b className="text-amber-500 text-xl">•</b>
                0%
              </span>
            </p>
          </div>

          {/* Check-in */}
          <div className="checkins bg-gray-100 rounded-xl p-4 mt-16 md:p-8">
            <div className="info flex items-center justify-between">
              <h2 className="text-xl font-poppins-bold mb-8">Check-ins</h2>
              <CustomSelect
                name="eventSelect"
                id="eventSelect"
                options={chartOptions}
                customClassNames="font-poppins"
              />
            </div>
            <CheckInBarChart data={checkInData} />
          </div>

          {/* Attendance */}
          <div className="attendance bg-gray-100 rounded-xl p-8 mt-16">
            <h2 className="text-xl font-poppins-bold mb-8">Attendance</h2>

            <AttendancePieChart />
          </div>

          {/* Activity logs */}
          <div className="activitylogs mt-16 pb-16">
            <h2 className="text-xl font-poppins-bold mb-8">Activity logs</h2>
            <ActivityLog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
