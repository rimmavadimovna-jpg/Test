import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Генератор задач ЕГЭ №6",
  description: "Алгоритмическая генерация задач по долям и процентам"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <div className="page">
          <header className="header">
            <h1>Генератор задач №6 ЕГЭ (база)</h1>
          </header>
          <main className="main">{children}</main>
          <footer className="footer">© Тестовое задание Риммы Раппопорт</footer>
        </div>
      </body>
    </html>
  );
}
