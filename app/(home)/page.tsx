// app/page.tsx (ou onde você definiu o arquivo de página)
'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Por favor, selecione um arquivo de áudio');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/recognizeSong', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setResponse('Erro ao processar o arquivo');
    }
  };

  return (
    <div>
      <h1>Teste de Reconhecimento de Música</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit">Enviar</button>
      </form>
      {response && (
        <div>
          <h2>Resultado:</h2>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}
