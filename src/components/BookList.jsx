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

export default function BookList({ books, setBooks }) {
  const [filterGenre, setFilterGenre] = useState("すべて");
  const [filterMonth, setFilterMonth] = useState("");
  const [editId, setEditId] = useState(null);
  const [editBook, setEditBook] = useState(null);

  const filteredBooks = books.filter((b) => {
    if (filterGenre !== "すべて" && b.genre !== filterGenre) return false;
    if (filterMonth && !b.date.startsWith(filterMonth)) return false;
    return true;
  });

  const saveEdit = () => {
    setBooks(books.map((b) => (b.id === editId ? editBook : b)));
    setEditId(null);
    setEditBook(null);
  };

  return (
    <div>
      <h2>一覧</h2>

      <div>
        ジャンル：
        <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}>
          <option>すべて</option>
          {GENRES.map((g) => <option key={g}>{g}</option>)}
        </select>

        年月：
        <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} />
      </div>

      {filteredBooks.map((b) => (
        <div key={b.id} style={{ border: "1px solid #ccc", padding: "8px", margin: "8px 0" }}>
          {editId === b.id ? (
            <>
              <input value={editBook.title} onChange={(e) => setEditBook({ ...editBook, title: e.target.value })} />
              <input type="date" value={editBook.date} onChange={(e) => setEditBook({ ...editBook, date: e.target.value })} />
              <select value={editBook.genre} onChange={(e) => setEditBook({ ...editBook, genre: e.target.value })}>
                {GENRES.map((g) => <option key={g}>{g}</option>)}
              </select>
              <div>
                評価：
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} onClick={() => setEditBook({ ...editBook, rating: n })}>
                    {n <= editBook.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <textarea value={editBook.memo} onChange={(e) => setEditBook({ ...editBook, memo: e.target.value })} />
              <button onClick={saveEdit}>保存</button>
            </>
          ) : (
            <>
              <strong>{b.title}</strong>
              <div>{b.date}</div>
              <div>ジャンル：{b.genre}</div>
              <div>評価：{"★".repeat(b.rating)}{"☆".repeat(5 - b.rating)}</div>
              <div>{b.memo}</div>
              <button onClick={() => { setEditId(b.id); setEditBook(b); }}>編集</button>
              <button onClick={() => setBooks(books.filter((x) => x.id !== b.id))}>削除</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
