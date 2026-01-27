import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { Paper, Typography, Grid } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Statistics({ books }) {
  if (books.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography>まだ読書記録がありません。</Typography>
      </Paper>
    );
  }

  const monthlyCount = {};
  books.forEach((book) => {
    const month = book.date.slice(0, 7);
    monthlyCount[month] = (monthlyCount[month] || 0) + 1;
  });
  const monthLabels = Object.keys(monthlyCount).sort();
  const monthData = monthLabels.map((m) => monthlyCount[m]);
  const monthlyChartData = {
    labels: monthLabels,
    datasets: [{ label: "月別読書数", data: monthData, backgroundColor: "#4CAF50" }]
  };

  const genreCount = {};
  books.forEach((book) => { genreCount[book.genre] = (genreCount[book.genre] || 0) + 1; });
  const genreLabels = Object.keys(genreCount);
  const genreData = genreLabels.map((g) => genreCount[g]);
  const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336", "#009688"];
  const genreChartData = {
    labels: genreLabels,
    datasets: [{ data: genreData, backgroundColor: genreLabels.map((_, i) => COLORS[i % COLORS.length]) }]
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        📊 読書データの統計
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "400px" }}>
            <Typography variant="h6" align="center" gutterBottom>月別読書数</Typography>
            <div style={{ height: "300px" }}>
              <Bar data={monthlyChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "400px" }}>
            <Typography variant="h6" align="center" gutterBottom>ジャンル別割合</Typography>
            <div style={{ height: "300px" }}>
              <Pie data={genreChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}