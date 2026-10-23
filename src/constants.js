export const GENRES = [
  "小説・文学", "ビジネス・経済", "歴史・社会", "科学・技術",
  "教育・学習", "哲学・思想・宗教", "趣味・実用",
  "芸術・デザイン・エンタメ", "その他"
];

export const STATUSES = ["読みたい", "読書中", "読了"];

export const STATUS_COLORS = {
  "読みたい": "default",
  "読書中": "warning",
  "読了": "success",
};

// 旧データ（statusなし）は読了扱い
export const getStatus = (book) => book.status || "読了";
