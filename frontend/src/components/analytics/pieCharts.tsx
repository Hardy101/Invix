import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const data = [
  { name: "Checked-in", value: 120 },
  { name: "No-show", value: 30 },
  { name: "Pending", value: 50 },
];

const COLORS = ["#00c951", "#fb2c36", "#FFBB28"];

const AttendancePieChart = () => {
  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        dataKey="value"
        label
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default AttendancePieChart;
