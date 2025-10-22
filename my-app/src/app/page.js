export default function Home() {
  const now = new Date().toISOString();
  return (
    <main style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#f83636ff', marginBottom: '10px' }}>
        YTime
      </h1>

      <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#555' }}>
        время с любовью для вас
      </p>
      <p>Текущее время (сгенерировано на сервере):</p>
      <p style={{ fontSize: '1rem', color: '#ffffffff' }}>{now}</p>
    </main>
  );
}