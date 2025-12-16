import React from "react";

const StatCard = ({ icon: Icon, title, value, trend, trendUp = true }) => {
  return (
    <div className="p-6 bg-base-100 shadow rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trendUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {trendUp ? "↑" : "↓"} {trend}% from last month
            </p>
          )}
        </div>
        {Icon && <Icon className="text-4xl text-primary opacity-60" />}
      </div>
    </div>
  );
};

export default StatCard;
