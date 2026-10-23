import { useState } from "react";
import {
  TextField, MenuItem, Rating, Typography, Grid, InputAdornment, IconButton, Avatar, Box,
  Dialog, DialogTitle, DialogContent, List, ListItemButton, ListItemAvatar, ListItemText,
  CircularProgress, ToggleButtonGroup, ToggleButton, Tooltip
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'; // 検索アイコン
import CloseIcon from '@mui/icons-material/Close';
import { GENRES, STATUSES } from "../constants";
import { today } from "../bookUtils";

// APIキーなしだと共有の利用上限にすぐ達するため、公開する場合は .env で設定する
const BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

//Google Books API で本を検索する
async function searchBooks(query) {
  const params = new URLSearchParams({ q: query, maxResults: "10", printType: "books" });
  if (BOOKS_API_KEY) params.set("key", BOOKS_API_KEY);
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`);
  if (res.status === 429) throw new Error("rate-limit");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.items || []).map((item) => {
    const info = item.volumeInfo;
    return {
      id: item.id,
      title: info.title + (info.subtitle ? ` ${info.subtitle}` : ""),
      author: (info.authors || []).join(", "),
      publishedDate: info.publishedDate || "",
      thumbnail: info.imageLinks?.thumbnail?.replace("http://", "https://") || "",
    };
  });
}

export default function BookFields({ book, onChange }) {
  const set = (key) => (value) => onChange({ ...book, [key]: value });
  const [results, setResults] = useState(null); // null: 検索ダイアログを閉じている
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async () => {
    if (!book.title.trim()) {
      setSearchError("タイトルを入力してから検索してください");
      return;
    }
    setSearchError("");
    setSearching(true);
    try {
      const found = await searchBooks(book.title.trim());
      if (found.length === 0) setSearchError("本が見つかりませんでした");
      else setResults(found);
    } catch (error) {
      console.error("検索エラー:", error);
      setSearchError(error.message === "rate-limit"
        ? "検索の利用上限に達しました。時間をおいて試すか、手入力してください"
        : "検索に失敗しました");
    } finally {
      setSearching(false);
    }
  };

  const selectResult = (r) => {
    onChange({ ...book, title: r.title, author: r.author || book.author, thumbnail: r.thumbnail });
    setResults(null);
  };

  const handleStatus = (_, value) => {
    if (!value) return;
    onChange({ ...book, status: value, date: value === "読了" && !book.date ? today() : book.date });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <ToggleButtonGroup value={book.status} exclusive onChange={handleStatus} size="small" color="primary" fullWidth>
          {STATUSES.map((s) => <ToggleButton key={s} value={s}>{s}</ToggleButton>)}
        </ToggleButtonGroup>
      </Grid>
      <Grid size={{ xs: 12, sm: 7 }}>
        <TextField
          fullWidth
          required
          label="タイトル（入力して検索🔍）"
          value={book.title}
          onChange={(e) => set("title")(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); handleSearch(); } }}
          error={Boolean(searchError)}
          helperText={searchError || " "}
          slotProps={{
            input: {
              //検索ボタンを入力欄の中に埋め込む
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Google Booksで検索">
                    <IconButton onClick={handleSearch} edge="end" color="primary" disabled={searching} aria-label="本を検索">
                      {searching ? <CircularProgress size={20} /> : <SearchIcon />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 5 }}>
        <TextField fullWidth label="著者" value={book.author || ""} onChange={(e) => set("author")(e.target.value)} helperText=" " />
      </Grid>
      {book.thumbnail && (
        <Grid size={12}>
          <Box display="flex" alignItems="center" gap={1} mt={-2}>
            <Avatar src={book.thumbnail} variant="rounded" sx={{ width: 40, height: 60 }} />
            <Typography variant="caption" color="text.secondary">表紙</Typography>
            <IconButton size="small" onClick={() => set("thumbnail")("")} aria-label="表紙を外す"><CloseIcon fontSize="small" /></IconButton>
          </Box>
        </Grid>
      )}
      {book.status === "読了" && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth required type="date" label="読了日" slotProps={{ inputLabel: { shrink: true } }} value={book.date} onChange={(e) => set("date")(e.target.value)} />
        </Grid>
      )}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth select label="ジャンル" value={book.genre} onChange={(e) => set("genre")(e.target.value)}>
          {GENRES.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography component="legend" mr={1}>評価:</Typography>
        <Rating value={book.rating ?? null} onChange={(e, value) => set("rating")(value)} />
      </Grid>
      <Grid size={12}>
        <TextField fullWidth multiline minRows={2} label="メモ・感想" value={book.memo} onChange={(e) => set("memo")(e.target.value)} />
      </Grid>

      <Dialog open={results !== null} onClose={() => setResults(null)} fullWidth maxWidth="sm">
        <DialogTitle>本を選択</DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <List>
            {(results || []).map((r) => (
              <ListItemButton key={r.id} onClick={() => selectResult(r)}>
                <ListItemAvatar>
                  <Avatar src={r.thumbnail} variant="rounded" sx={{ width: 40, height: 60, mr: 2 }}>📕</Avatar>
                </ListItemAvatar>
                <ListItemText primary={r.title} secondary={[r.author, r.publishedDate].filter(Boolean).join(" / ")} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}
