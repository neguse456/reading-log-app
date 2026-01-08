import { useState } from "react";

const GENRES = [
  "小説・文学",
  "ビジネス・経済",
  "歴史・社会",
  "科学・技術",
  "教育・学習",
  "哲学・思想・宗教",
  "趣味・実用",
  "芸術・デザイン・エンタメ",
  "その他"
];

export default function BookForm({ books, setBooks }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [rating, setRating] = useState(3);
  const [memo, setMemo] = useState("");

  const addBook = () => {
    if (!title || !date) return;

    setBooks([
      ...books,
      {
        id: Date.now(),
        title,
        date,
        genre,
        rating,
        memo
      }
    ]);

    setTitle("");
    setDate("");
    setGenre(GENRES[0]);
    setRating(3);
    setMemo("");
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      <h2>追加</h2>

      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="タイトル" />
      </div>

      <div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div>
        ジャンル：
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div>
        評価：
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} onClick={() => setRating(n)} style={{ cursor: "pointer", fontSize: "20px" }}>
            {n <= rating ? "★" : "☆"}
          </span>
        ))}
      </div>

      <div>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="メモ・感想" />
      </div>

      <button onClick={addBook}>追加</button>
    </div>
  );
}
