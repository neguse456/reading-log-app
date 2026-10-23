import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu, MenuItem, ListItemIcon } from "@mui/material";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';

const PAGES = [
  { name: "一覧", icon: <LibraryBooksIcon /> },
  { name: "統計", icon: <BarChartIcon /> },
];

export default function Navbar({ currentPage, setCurrentPage, user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ gap: 1 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          📚 読書ログ
        </Typography>
        <Box sx={{ display: 'flex' }}>
          {PAGES.map((p) => (
            <Button
              key={p.name}
              color="inherit"
              startIcon={p.icon}
              onClick={() => setCurrentPage(p.name)}
              sx={{
                borderBottom: currentPage === p.name ? "2px solid white" : "2px solid transparent", borderRadius: 0, minWidth: 0,
                "& .MuiButton-startIcon": { display: { xs: "none", sm: "inherit" } },
              }}
            >
              {p.name}
            </Button>
          ))}
        </Box>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }} aria-label="アカウント">
          <Avatar src={user.photoURL || undefined} alt={user.displayName || ""} sx={{ width: 32, height: 32 }}>
            {(user.displayName || user.email || "?")[0]}
          </Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem disabled>
            <Typography variant="body2">{user.displayName || user.email}</Typography>
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); onLogout(); }}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            ログアウト
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
