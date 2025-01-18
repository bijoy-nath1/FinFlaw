"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
function DoughnutChart({ accounts }: DoughnutChartProps) {
  const data = {
    datasets: [
      {
        label: "Banks",
        data: [1250, 2400, 3750],
        backgroundColor: ["#0747b6 ", " #2265d8 ", "#2f91fa  "],
      },
    ],
    labels: ["Bank1", "bank2", "Bank3", "Bank4 "],
  };
  return (
    <Doughnut
      data={data}
      options={{
        cutout: "70%",
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}

export default DoughnutChart;
