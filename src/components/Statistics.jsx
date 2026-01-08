import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Statistics({ books }) {
  if (books.length === 0) {
    return <p>まだ読書記録がありません。</p>;
  }

  /* ===== 月別集計 ===== */
  const monthlyCount = {};
  books.forEach((book) => {
    const month = book.date.slice(0, 7); // YYYY-MM
    monthlyCount[month] = (monthlyCount[month] || 0) + 1;
  });

  const monthLabels = Object.keys(monthlyCount).sort();
  const monthData = monthLabels.map((m) => monthlyCount[m]);

  const monthlyChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "月別読書数",
        data: monthData,
        backgroundColor: "#4CAF50"
      }
    ]
  };

  /* ===== ジャンル別集計 ===== */
  const genreCount = {};
  books.forEach((book) => {
    genreCount[book.genre] = (genreCount[book.genre] || 0) + 1;
  });

  const genreLabels = Object.keys(genreCount);
  const genreData = genreLabels.map((g) => genreCount[g]);

  const COLORS = [
    "#4CAF50",
    "#2196F3",
    "#FF9800",
    "#9C27B0",
    "#F44336",
    "#009688"
  ];

  const genreChartData = {
    labels: genreLabels,
    datasets: [
      {
        data: genreData,
        backgroundColor: genreLabels.map(
          (_, i) => COLORS[i % COLORS.length]
        )
      }
    ]
  };

  return (
    <div>
      <h2>📊 統計</h2>

      <div style={{ marginBottom: "40px" }}>
        <h3>月別読書数</h3>
        <div style={{ height: "300px" }}>
          <Bar
            data={monthlyChartData}
            options={{
              maintainAspectRatio: false
            }}
          />
        </div>
      </div>

      <div>
        <h3>ジャンル別読書割合</h3>
        <div style={{ height: "300px" }}>
          <Pie
            data={genreChartData}
            options={{
              maintainAspectRatio: false
            }}
          />
        </div>
      </div>
    </div>
  );
}
