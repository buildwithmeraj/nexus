import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarChartComponent = ({ data, title, dataKey = "value" }) => {
  return (
    <div className="p-6 bg-base-100 shadow rounded-lg">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
