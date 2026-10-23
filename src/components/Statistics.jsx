import { useState } from "react";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { Paper, Typography, Grid, TextField, MenuItem, Box } from "@mui/material";
import { getStatus } from "../constants";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336", "#009688", "#795548", "#607D8B", "#E91E63"];

function StatTile({ label, value }) {
  return (
    <Paper elevation={2} sx={{ p: 2, textAlign: "center", height: "100%" }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </Paper>
  );
}

export default function Statistics({ books }) {
  const finished = books.filter((b) => getStatus(b) === "読了" && b.date);
  const thisYear = String(new Date().getFullYear());
  const years = [...new Set([thisYear, ...finished.map((b) => b.date.slice(0, 4))])].sort().reverse();
  const [year, setYear] = useState(thisYear);

  if (books.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography>まだ読書記録がありません。</Typography>
      </Paper>
    );
  }

  const yearBooks = finished.filter((b) => b.date.startsWith(year));
  const rated = finished.filter((b) => b.rating);
  const avgRating = rated.length ? (rated.reduce((sum, b) => sum + b.rating, 0) / rated.length).toFixed(1) : "-";
  const countStatus = (s) => books.filter((b) => getStatus(b) === s).length;

  // 選択した年の月別読了数（読んでいない月も0で表示）
  const monthData = Array.from({ length: 12 }, (_, i) =>
    yearBooks.filter((b) => Number(b.date.slice(5, 7)) === i + 1).length
  );
  const monthlyChartData = {
    labels: monthData.map((_, i) => `${i + 1}月`),
    datasets: [{ label: "読了数", data: monthData, backgroundColor: "#4CAF50" }]
  };

  const genreCount = {};
  finished.forEach((book) => { genreCount[book.genre] = (genreCount[book.genre] || 0) + 1; });
  const genreLabels = Object.keys(genreCount).sort((a, b) => genreCount[b] - genreCount[a]);
  const genreChartData = {
    labels: genreLabels,
    datasets: [{ data: genreLabels.map((g) => genreCount[g]), backgroundColor: genreLabels.map((_, i) => COLORS[i % COLORS.length]) }]
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        📊 読書データの統計
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 2.4 }}><StatTile label="読了（累計）" value={`${finished.length}冊`} /></Grid>
        <Grid size={{ xs: 6, sm: 2.4 }}><StatTile label={`${thisYear}年の読了`} value={`${finished.filter((b) => b.date.startsWith(thisYear)).length}冊`} /></Grid>
        <Grid size={{ xs: 4, sm: 2.4 }}><StatTile label="読書中" value={`${countStatus("読書中")}冊`} /></Grid>
        <Grid size={{ xs: 4, sm: 2.4 }}><StatTile label="読みたい" value={`${countStatus("読みたい")}冊`} /></Grid>
        <Grid size={{ xs: 4, sm: 2.4 }}><StatTile label="平均評価" value={avgRating} /></Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3, height: "400px" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">月別読了数</Typography>
              <TextField select size="small" value={year} onChange={(e) => setYear(e.target.value)}>
                {years.map((y) => <MenuItem key={y} value={y}>{y}年</MenuItem>)}
              </TextField>
            </Box>
            <div style={{ height: "300px" }}>
              <Bar
                data={monthlyChartData}
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }}
              />
            </div>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3, height: "400px" }}>
            <Typography variant="h6" align="center" gutterBottom>ジャンル別割合（読了）</Typography>
            <div style={{ height: "300px" }}>
              {genreLabels.length > 0
                ? <Pie data={genreChartData} options={{ maintainAspectRatio: false }} />
                : <Typography color="text.secondary" align="center" mt={10}>読了した本がまだありません</Typography>}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
