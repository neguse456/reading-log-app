export default function Navbar({ currentPage, setCurrentPage }) {
  const pages = ["一覧", "統計"];

  return (
    <div style={{ display: "flex", gap: "12px", height: "48px", alignItems: "center" }}>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setCurrentPage(p)}
          style={{
            padding: "6px 12px",
            background: currentPage === p ? "#4CAF50" : "#fff",
            color: currentPage === p ? "#fff" : "#000",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
