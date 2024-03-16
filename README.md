
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';

const Home: NextPage = () => {
  const [name, setName] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const responseData = await fetch('/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, feedback }),
    }).then((res) => res.json());
    
    setResponse(responseData.data);
    setName('');
    setFeedback('');
  };

  return (
    <div>
      <Head>
        <title>Feedback Trees</title>
        <meta name="description" content="Rapid Customer-Driven Development" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Feedback Trees</h1>
        <p>Your feedback is instrumental in helping us evolve. Thank you!</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="feedback">Feedback:</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          ></textarea>

          <button type="submit">Submit Feedback</button>
        </form>

        {response && <div>{response}</div>}
      </main>
    </div>
  );
};

export default Home;
