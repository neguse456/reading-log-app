import { GENRES } from "./constants";

export const today = () => new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD（ローカル時刻）

export const emptyBook = () => ({
  title: "", author: "", status: "読了", date: today(), genre: GENRES[0],
  rating: 3, memo: "", thumbnail: "",
});

// 入力チェック。問題なければ null、あればメッセージを返す
export const validateBook = (book) => {
  if (!book.title.trim()) return "タイトルを入力してください";
  if (book.status === "読了" && !book.date) return "読了日を入力してください";
  return null;
};

// 保存前に整える（前後の空白を除く・読了以外は読了日を持たない）
export const normalizeBook = (book) => ({
  ...book,
  title: book.title.trim(),
  author: (book.author || "").trim(),
  date: book.status === "読了" ? book.date : "",
});
