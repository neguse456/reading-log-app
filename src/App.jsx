import { useState } from "react";
import Navbar from "./components/Navbar";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import Statistics from "./components/Statistics";

export default function App() {
  const [page, setPage] = useState("一覧");
  const [books, setBooks] = useState([]);

  return (
    <>
      <header style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "56px", background: "#fff", borderBottom: "1px solid #ccc", zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", lineHeight: "56px" }}>
          <h1 style={{ margin: 0 }}>📚 読書ログ</h1>
        </div>
      </header>

      <nav style={{ position: "fixed", top: "56px", left: 0, width: "100%", height: "48px", background: "#f3f3f3", borderBottom: "1px solid #ccc", zIndex: 90 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
          <Navbar currentPage={page} setCurrentPage={setPage} />
        </div>
      </nav>

      <main style={{ marginTop: "104px", padding: "16px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {page === "一覧" && (
            <>
              <BookForm books={books} setBooks={setBooks} />
              <BookList books={books} setBooks={setBooks} />
            </>
          )}
          {page === "統計" && <Statistics books={books} />}
        </div>
      </main>
    </>
  );
}
