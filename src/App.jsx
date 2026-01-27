import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import Navbar from "./components/Navbar";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import Statistics from "./components/Statistics";

// UIライブラリ 
import { Container, Box, Snackbar, Alert, CircularProgress, Typography } from "@mui/material";

export default function App() {
  const [page, setPage] = useState("一覧");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" }); // 通知設定

  //Firebaseからデータを取得
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const booksData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  //通知を表示するヘルパー関数
  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  //追加機能
  const handleAddBook = async (newBook) => {
    try {
      const docRef = await addDoc(collection(db, "books"), newBook);
      setBooks([...books, { ...newBook, id: docRef.id }]);
      showNotification("本を登録しました！");
    } catch (e) {
      showNotification("登録に失敗しました", "error");
    }
  };

  //削除機能
  const handleDeleteBook = async (id) => {
    try {
      await deleteDoc(doc(db, "books", id));
      setBooks(books.filter((b) => b.id !== id));
      showNotification("削除しました", "info");
    } catch (e) {
      showNotification("削除に失敗しました", "error");
    }
  };

  //更新機能
  const handleUpdateBook = async (id, updatedBook) => {
    try {
      await updateDoc(doc(db, "books", id), updatedBook);
      setBooks(books.map((b) => (b.id === id ? { ...updatedBook, id } : b)));
      showNotification("変更を保存しました！");
    } catch (e) {
      showNotification("更新に失敗しました", "error");
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", pb: 4 }}>
      <Navbar currentPage={page} setCurrentPage={setPage} />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        
        {loading ? (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
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
            {page === "統計" && <Statistics books={books} />}
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