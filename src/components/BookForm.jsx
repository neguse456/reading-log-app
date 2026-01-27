import { useState } from "react";
import { 
  Paper, TextField, Button, MenuItem, Rating, Typography, Grid, 
  InputAdornment, IconButton, Avatar, Box 
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search'; // 検索アイコン

const GENRES = [
  "小説・文学", "ビジネス・経済", "歴史・社会", "科学・技術", 
  "教育・学習", "哲学・思想・宗教", "趣味・実用", 
  "芸術・デザイン・エンタメ", "その他"
];

export default function BookForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [rating, setRating] = useState(3);
  const [memo, setMemo] = useState("");
  //画像URLを保存するStateを追加
  const [thumbnail, setThumbnail] = useState("");

  //Google Books API で本を検索する関数
  const handleSearch = async () => {
    if (!title) return alert("タイトルを入力してから検索してください");

    try {
      //API
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}`);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const bookInfo = data.items[0].volumeInfo;
        
        //取得したデータでフォームを埋める
        setTitle(bookInfo.title); //正確なタイトルに上書き
        
        //著者をメモ欄に追記
        const authors = bookInfo.authors ? `著者: ${bookInfo.authors.join(", ")}\n` : "";
        setMemo(authors + memo);

        //画像URLを取得
        if (bookInfo.imageLinks && bookInfo.imageLinks.thumbnail) {
          setThumbnail(bookInfo.imageLinks.thumbnail.replace("http://", "https://"));
        }
      } else {
        alert("本が見つかりませんでした");
      }
    } catch (error) {
      console.error("検索エラー:", error);
      alert("検索に失敗しました");
    }
  };

  const handleSubmit = () => {
    if (!title || !date) return alert("タイトルと日付は必須です");
    
    //thumbnailもデータとして渡す
    onAdd({ title, date, genre, rating, memo, thumbnail });

    //フォームリセット
    setTitle("");
    setDate("");
    setGenre(GENRES[0]);
    setRating(3);
    setMemo("");
    setThumbnail("");
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AddCircleOutlineIcon /> 新しい本を記録
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth 
            label="タイトル（入力して検索🔍）" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            //検索ボタンを入力欄の中に埋め込む設定
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} edge="end" color="primary">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          {thumbnail && (
            <Box mt={1} display="flex" alignItems="center" gap={1}>
              <Avatar src={thumbnail} variant="rounded" sx={{ width: 40, height: 60 }} />
              <Typography variant="caption" color="textSecondary">表紙を取得しました</Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth type="date" label="読了日" InputLabelProps={{ shrink: true }} value={date} onChange={(e) => setDate(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth select label="ジャンル" value={genre} onChange={(e) => setGenre(e.target.value)}>
            {GENRES.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography component="legend" mr={1}>評価:</Typography>
          <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline rows={2} label="メモ・感想" value={memo} onChange={(e) => setMemo(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth size="large" onClick={handleSubmit}>
            追加する
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}