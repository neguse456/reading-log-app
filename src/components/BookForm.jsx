import { useState } from "react";
import { Paper, Button, Typography, Alert } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BookFields from "./BookFields";
import { emptyBook, validateBook, normalizeBook } from "../bookUtils";

export default function BookForm({ onAdd }) {
  const [book, setBook] = useState(emptyBook);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    const message = validateBook(book);
    if (message) return setError(message);
    setError("");
    setSaving(true);
    const ok = await onAdd(normalizeBook(book));
    setSaving(false);
    //成功したらフォームリセット（ステータスは続けて入力しやすいよう引き継ぐ）
    if (ok) setBook({ ...emptyBook(), status: book.status });
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AddCircleOutlineIcon /> 新しい本を記録
      </Typography>
      <BookFields book={book} onChange={setBook} />
      {error && <Alert severity="warning" sx={{ mt: 2 }}>{error}</Alert>}
      <Button variant="contained" fullWidth size="large" onClick={handleSubmit} disabled={saving} sx={{ mt: 2 }}>
        追加する
      </Button>
    </Paper>
  );
}
