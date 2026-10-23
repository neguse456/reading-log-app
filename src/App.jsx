import { useState, useEffect, lazy, Suspense } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import useBooks from "./hooks/useBooks";
import Navbar from "./components/Navbar";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import Login from "./components/Login";

// グラフ（chart.js）は統計ページを開いたときに読み込む
const Statistics = lazy(() => import("./components/Statistics"));

// UIライブラリ
import { Container, Box, Snackbar, Alert, CircularProgress } from "@mui/material";

function Loading() {
  return (
    <Box display="flex" justifyContent="center" mt={10}>
      <CircularProgress />
    </Box>
  );
}

export default function App() {
  // undefined: 確認中 / null: 未ログイン
  const [user, setUser] = useState(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) return <Loading />;
  if (!user) return <Login />;
  // ユーザーが変わったら状態をリセットする
  return <ReadingLog key={user.uid} user={user} />;
}

function ReadingLog({ user }) {
  const [page, setPage] = useState("一覧");
  const { books, loading, error, addBook, updateBook, deleteBook } = useBooks(user.uid);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" }); // 通知設定

  //通知を表示するヘルパー関数
  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  // 成功・失敗の通知付きで実行。成功したら true を返す
  const run = async (action, successMessage, errorMessage, severity) => {
    try {
      await action();
      showNotification(successMessage, severity);
      return true;
    } catch (e) {
      console.error(e);
      showNotification(errorMessage, "error");
      return false;
    }
  };

  const handleAddBook = (book) => run(() => addBook(book), "本を登録しました！", "登録に失敗しました");
  const handleUpdateBook = (id, book) => run(() => updateBook(id, book), "変更を保存しました！", "更新に失敗しました");
  const handleDeleteBook = (id) => run(() => deleteBook(id), "削除しました", "削除に失敗しました", "info");

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", pb: 4 }}>
      <Navbar currentPage={page} setCurrentPage={setPage} user={user} onLogout={() => signOut(auth)} />

      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 } }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>データの読み込みに失敗しました。再読み込みしてください。</Alert>}
        {loading ? (
          <Loading />
        ) : (
          <>
            {page === "一覧" && (
              <>
                <BookForm onAdd={handleAddBook} />
                <BookList
                  books={books}
                  onDelete={handleDeleteBook}
                  onUpdate={handleUpdateBook}
                />
              </>
            )}
            {page === "統計" && (
              <Suspense fallback={<Loading />}>
                <Statistics books={books} />
              </Suspense>
            )}
          </>
        )}
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
