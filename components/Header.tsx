import Link from "next/link";

export default function Header() {
  return(
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
      <nav>
        <ul style={{ display: "flex", gap:"20px", listStyle: "none", margin: 0, padding: 0}}>
          <li><Link href="/">ホーム</Link></li>
          <li><Link href="/menu">メニュー</Link></li>
          <li><Link href="/">アクセス</Link></li>
          <li><Link href="/">お知らせ</Link></li>
          <li><Link href="/reservation">日付予約</Link></li>
          <li><Link href="/">お問い合わせ</Link></li>
        </ul>
      </nav>
    </header>
  )
}
