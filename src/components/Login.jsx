import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { Box, Paper, Typography, Button, Alert } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      if (e.code !== "auth/popup-closed-by-user") {
        console.error("Login error:", e);
        setError("ログインに失敗しました。時間をおいて再度お試しください。");
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f5f5f5", px: 2 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, maxWidth: 420, width: "100%", textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>📚 読書ログ</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          読んだ本・読みたい本を記録して、<br />読書の傾向をグラフで振り返ろう。
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>{error}</Alert>}
        <Button variant="contained" size="large" fullWidth startIcon={<GoogleIcon />} onClick={handleLogin}>
          Googleでログイン
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
          記録はあなたのアカウントにだけ保存され、他の人からは見えません。
        </Typography>
      </Paper>
    </Box>
  );
}
