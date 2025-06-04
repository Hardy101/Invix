import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const Charts = () => {
  // Sample data for pie chart
  const guestStatusData = [
    { name: "Checked In", value: 145, fill: "#2a9d90" },
    { name: "Checked Out", value: 89, fill: "hsl(12 76% 61%)" },
    { name: "Pending", value: 23, fill: "hsl(197 37% 24%)" },
  ];

  // Sample data for bar chart
  const checkinData = [
    { time: "9 AM", checkins: 12 },
    { time: "10 AM", checkins: 25 },
    { time: "11 AM", checkins: 18 },
    { time: "12 PM", checkins: 32 },
    { time: "1 PM", checkins: 28 },
    { time: "2 PM", checkins: 15 },
    { time: "3 PM", checkins: 22 },
    { time: "4 PM", checkins: 19 },
  ];
  return (
    <>
      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Guest Status Distribution</CardTitle>
            <CardDescription>
              Current status of all registered guests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                checkedIn: {
                  label: "Checked In",
                  color: "hsl(var(--chart-1))",
                },
                checkedOut: {
                  label: "Checked Out",
                  color: "hsl(var(--chart-2))",
                },
                pending: {
                  label: "Pending",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={guestStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {guestStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Check-ins by Hour</CardTitle>
            <CardDescription>
              Number of guests checking in throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                checkins: {
                  label: "Check-ins",
                  color: "#2a9d90",
                },
              }}
              className="min-h-[300px]"
            >
              <BarChart data={checkinData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="checkins" fill="#2a9d90" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Charts;
