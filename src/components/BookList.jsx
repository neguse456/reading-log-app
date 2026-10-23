import { useState } from "react";
import {
  Paper, Typography, TextField, MenuItem, Grid, Card, CardContent, CardActions, Button,
  IconButton, Rating, Box, Chip, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, InputAdornment, Alert
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import BookFields from "./BookFields";
import { validateBook, normalizeBook } from "../bookUtils";
import { GENRES, STATUSES, STATUS_COLORS, getStatus } from "../constants";

// 並べ替え（新しい順は読了日 → 登録日時の順で比較）
const createdMillis = (b) => b.createdAt?.toMillis?.() ?? 0;
const SORTS = {
  "新しい順": (a, b) => (b.date || "").localeCompare(a.date || "") || createdMillis(b) - createdMillis(a),
  "古い順": (a, b) => (a.date || "").localeCompare(b.date || "") || createdMillis(a) - createdMillis(b),
  "評価が高い順": (a, b) => (b.rating || 0) - (a.rating || 0),
  "タイトル順": (a, b) => a.title.localeCompare(b.title, "ja"),
};

const filterFieldSx = { bgcolor: 'white' };

export default function BookList({ books, onDelete, onUpdate }) {
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("すべて");
  const [filterGenre, setFilterGenre] = useState("すべて");
  const [filterMonth, setFilterMonth] = useState("");
  const [sort, setSort] = useState("新しい順");

  const [editData, setEditData] = useState(null); // 編集中の本
  const [editError, setEditError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // 削除確認中の本

  const startEdit = (book) => {
    setEditError("");
    setEditData({ author: "", memo: "", thumbnail: "", ...book, status: getStatus(book), date: book.date || "" });
  };

  const saveEdit = async () => {
    const message = validateBook(editData);
    if (message) return setEditError(message);
    if (await onUpdate(editData.id, normalizeBook(editData))) setEditData(null);
  };

  const confirmDelete = async () => {
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const q = keyword.trim().toLowerCase();
  const filteredBooks = books
    .filter((b) => {
      if (filterStatus !== "すべて" && getStatus(b) !== filterStatus) return false;
      if (filterGenre !== "すべて" && b.genre !== filterGenre) return false;
      if (filterMonth && !(b.date || "").startsWith(filterMonth)) return false;
      if (q && ![b.title, b.author, b.memo].some((s) => (s || "").toLowerCase().includes(q))) return false;
      return true;
    })
    .sort(SORTS[sort]);

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, bgcolor: "#e3f2fd" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={12}>
            <TextField
              fullWidth size="small" placeholder="タイトル・著者・メモで検索" value={keyword}
              onChange={(e) => setKeyword(e.target.value)} sx={filterFieldSx}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField fullWidth select label="ステータス" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} size="small" sx={filterFieldSx}>
              <MenuItem value="すべて">すべて</MenuItem>
              {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField fullWidth select label="ジャンル" value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} size="small" sx={filterFieldSx}>
              <MenuItem value="すべて">すべて</MenuItem>
              {GENRES.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField fullWidth type="month" label="読了月" slotProps={{ inputLabel: { shrink: true } }} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} size="small" sx={filterFieldSx} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField fullWidth select label="並べ替え" value={sort} onChange={(e) => setSort(e.target.value)} size="small" sx={filterFieldSx}>
              {Object.keys(SORTS).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom>
        {filteredBooks.length === books.length ? `登録数: ${books.length}冊` : `${filteredBooks.length}冊 / 全${books.length}冊`}
      </Typography>

      {filteredBooks.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
          {books.length === 0 ? "まだ本が登録されていません。上のフォームから最初の1冊を記録しましょう！" : "条件に合う本がありません。"}
        </Paper>
      )}

      <Grid container spacing={2}>
        {filteredBooks.map((b) => (
          <Grid size={12} key={b.id}>
            <Card elevation={2} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
              {b.thumbnail && (
                <CardMedia
                  component="img"
                  sx={{ width: { xs: '100%', sm: 120 }, height: { xs: 200, sm: 'auto' }, objectFit: "contain", bgcolor: "#f0f0f0", p: 1 }}
                  image={b.thumbnail}
                  alt={b.title}
                />
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                    <Box minWidth={0}>
                      <Typography variant="caption" color="text.secondary">
                        {b.date ? `読了日: ${b.date}` : ""}
                      </Typography>
                      <Typography variant="h6" component="div" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
                        {b.title}
                      </Typography>
                      {b.author && <Typography variant="body2" color="text.secondary">{b.author}</Typography>}
                      <Box display="flex" gap={0.5} flexWrap="wrap" sx={{ mt: 0.5, mb: 1 }}>
                        <Chip label={getStatus(b)} size="small" color={STATUS_COLORS[getStatus(b)]} />
                        <Chip label={b.genre} size="small" color="primary" variant="outlined" />
                      </Box>
                    </Box>
                    {b.rating ? <Rating value={b.rating} readOnly size="small" /> : null}
                  </Box>
                  {b.memo && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word', bgcolor: '#f9f9f9', p: 1, borderRadius: 1 }}>
                      {b.memo}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', bgcolor: '#fafafa' }}>
                  <IconButton color="primary" onClick={() => startEdit(b)} aria-label="編集"><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => setDeleteTarget(b)} aria-label="削除"><DeleteIcon /></IconButton>
                </CardActions>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ===== 編集ダイアログ ===== */}
      <Dialog open={editData !== null} onClose={() => setEditData(null)} fullWidth maxWidth="sm">
        <DialogTitle>本を編集</DialogTitle>
        <DialogContent dividers>
          {editData && <BookFields book={editData} onChange={setEditData} />}
          {editError && <Alert severity="warning" sx={{ mt: 2 }}>{editError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditData(null)}>キャンセル</Button>
          <Button variant="contained" onClick={saveEdit}>保存</Button>
        </DialogActions>
      </Dialog>

      {/* ===== 削除確認ダイアログ ===== */}
      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>本を削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>「{deleteTarget?.title}」を削除します。この操作は取り消せません。</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>キャンセル</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>削除</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
