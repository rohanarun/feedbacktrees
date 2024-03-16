
import type { NextPage } from 'next';
import { useState } from 'react';

const Home: NextPage = () => {
  const [feedback, setFeedback] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await fetch('/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: feedback }),
    });

    const data = await res.json();
    setResponse(data.result);
  };

  return (
    <div>
      <h1>Cheatlayer Rocks !</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="feedback">Your Feedback:</label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
        <button type="submit">Submit Feedback</button>
      </form>
      {response && <div><p>Server Response:</p><p>{response}</p></div>}
    </div>
  );
};

export default Home;
