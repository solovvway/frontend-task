
export default function Home() {
  const now = new Date().toISOString();
  return (
    <main>
      <h1>Server-Side Rendering Demo</h1>
      <p>Текущее время (сгенерировано на сервере):</p>
      <p>{now}</p>
    </main>
  );
}
