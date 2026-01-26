import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function Navbar({ currentPage, setCurrentPage }) {
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          📚 読書ログ
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            startIcon={<LibraryBooksIcon />}
            onClick={() => setCurrentPage("一覧")}
            sx={{ borderBottom: currentPage === "一覧" ? "2px solid white" : "none" }}
          >
            一覧
          </Button>
          <Button 
            color="inherit" 
            startIcon={<BarChartIcon />}
            onClick={() => setCurrentPage("統計")}
            sx={{ borderBottom: currentPage === "統計" ? "2px solid white" : "none" }}
          >
            統計
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}