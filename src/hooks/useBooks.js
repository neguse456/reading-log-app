import { useEffect, useState } from "react";
import {
  collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

// ログイン中ユーザーの本（users/{uid}/books）をリアルタイムで購読する
export default function useBooks(uid) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = onSnapshot(
      collection(db, "users", uid, "books"),
      (snapshot) => {
        setBooks(snapshot.docs.map((d) => ({ ...d.data(), id: d.id })));
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching books:", err);
        setError(err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [uid]);

  const booksRef = () => collection(db, "users", uid, "books");
  const bookRef = (id) => doc(db, "users", uid, "books", id);

  const addBook = (book) =>
    addDoc(booksRef(), { ...book, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });

  const updateBook = (id, book) => {
    // eslint-disable-next-line no-unused-vars
    const { id: _id, createdAt, ...data } = book;
    return updateDoc(bookRef(id), { ...data, updatedAt: serverTimestamp() });
  };

  const deleteBook = (id) => deleteDoc(bookRef(id));

  return { books, loading, error, addBook, updateBook, deleteBook };
}
