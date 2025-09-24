'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [data, setData] = useState(null);

  const COLORS = ['#4ade80', '#60a5fa', '#f97316'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/analytics/");
        const analytics = res.data || {};
        setData(analytics);

        const published = Number(analytics.published) || 0;
        const scheduled = Number(analytics.scheduled) || 0;
        const failed = Number(analytics.failed) || 0;

        const values = [published, scheduled, failed];
        const labels = ["Published", "Scheduled", "Failed"];

        // Avoid empty chartData
        const safeValues = values.map(v => (v >= 0 ? v : 1));

        setChartData({
          labels,
          datasets: [
            {
              label: "Posts Status",
              data: safeValues,
              backgroundColor: COLORS,
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        });
      } catch (err) {
        console.error(err);
        // fallback if API fails
        setChartData({
          labels: ["Published", "Scheduled", "Failed"],
          datasets: [
            {
              label: "Posts Status",
              data: [1, 1, 1],
              backgroundColor: COLORS,
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      <div className="bg-white p-4 rounded shadow">
        <Pie data={chartData} />

        <div className="mt-4 text-gray-600">
          <h2 className="font-semibold">AI Insight</h2>
          <p>{data?.ai_insight || "Loading AI insight..."}</p>
        </div>
      </div>
    </div>
  );
}
