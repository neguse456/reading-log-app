import { useState } from "react";
import { 
  Paper, Typography, TextField, MenuItem, Grid, Card, CardContent, 
  CardActions, Button, IconButton, Rating, Box, Chip, CardMedia 
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const GENRES = [
  "小説・文学", "ビジネス・経済", "歴史・社会", "科学・技術", 
  "教育・学習", "哲学・思想・宗教", "趣味・実用", 
  "芸術・デザイン・エンタメ", "その他"
];

export default function BookList({ books, onDelete, onUpdate }) {
  const [filterGenre, setFilterGenre] = useState("すべて");
  const [filterMonth, setFilterMonth] = useState("");
  
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);

  const startEdit = (book) => {
    setEditId(book.id);
    setEditData({ ...book });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData(null);
  };

  const saveEdit = () => {
    onUpdate(editId, editData);
    setEditId(null);
    setEditData(null);
  };

  const filteredBooks = books.filter((b) => {
    if (filterGenre !== "すべて" && b.genre !== filterGenre) return false;
    if (filterMonth && !b.date.startsWith(filterMonth)) return false;
    return true;
  });

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, bgcolor: "#e3f2fd" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="ジャンルで絞り込み" value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} size="small" sx={{ bgcolor: 'white' }}>
              <MenuItem value="すべて">すべて</MenuItem>
              {GENRES.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="month" label="月で絞り込み" InputLabelProps={{ shrink: true }} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} size="small" sx={{ bgcolor: 'white' }} />
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom>
        登録数: {filteredBooks.length}冊
      </Typography>

      <Grid container spacing={2}>
        {filteredBooks.map((b) => (
          <Grid item xs={12} key={b.id}>
            <Card elevation={2} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
            
              {b.thumbnail && (
                <CardMedia
                  component="img"
                  sx={{ width: { xs: '100%', sm: 120 }, height: { xs: 200, sm: 'auto' }, objectFit: "contain", bgcolor: "#f0f0f0", p: 1 }}
                  image={b.thumbnail}
                  alt={b.title}
                />
              )}
              
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  {editId === b.id ? (
                    // ===== 編集モード=====
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <TextField fullWidth label="タイトル" value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth type="date" value={editData.date} onChange={(e) => setEditData({...editData, date: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth select label="ジャンル" value={editData.genre} onChange={(e) => setEditData({...editData, genre: e.target.value})}>
                          {GENRES.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6} display="flex" alignItems="center">
                        <Rating value={editData.rating} onChange={(e, val) => setEditData({...editData, rating: val})} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth multiline value={editData.memo} onChange={(e) => setEditData({...editData, memo: e.target.value})} />
                      </Grid>
                    </Grid>
                  ) : (
                    // ===== 通常表示モード =====
                    <>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="caption" color="textSecondary">{b.date}</Typography>
                          <Typography variant="h6" component="div" fontWeight="bold">
                            {b.title}
                          </Typography>
                          <Chip label={b.genre} size="small" color="primary" variant="outlined" sx={{ mt: 0.5, mb: 1 }} />
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                          <Rating value={b.rating} readOnly size="small" />
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-wrap', bgcolor: '#f9f9f9', p: 1, borderRadius: 1 }}>
                        {b.memo || "（メモなし）"}
                      </Typography>
                    </>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', bgcolor: '#fafafa' }}>
                  {editId === b.id ? (
                    <>
                      <Button startIcon={<SaveIcon />} variant="contained" color="success" size="small" onClick={saveEdit}>保存</Button>
                      <Button startIcon={<CancelIcon />} variant="outlined" color="error" size="small" onClick={cancelEdit}>キャンセル</Button>
                    </>
                  ) : (
                    <>
                      <IconButton color="primary" onClick={() => startEdit(b)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => onDelete(b.id)}><DeleteIcon /></IconButton>
                    </>
                  )}
                </CardActions>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}