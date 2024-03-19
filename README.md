
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';

const Home: NextPage = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ feedback }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(data);
    setFeedback('');
    alert('Feedback submitted');
  };

  return (
    <div>
      <Head>
        <title>Feedback Form</title>
        <meta name="description" content="Submit your feedback" />
      </Head>

      <main style={{ fontSize: '20px' }}> {/* Increased font size */}
        <h1>Feedback Form</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="feedback" style={{ display: 'block' }}>Your feedback:</label>
          <textarea
            id="feedback"
            name="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{ fontSize: '18px', width: '300px', height: '150px', marginBottom: '10px' }} // Increased font size here as well
          ></textarea>
          <br />
          <button type="submit" style={{ fontSize: '18px' }}>Submit</button> {/* Increased font size */}
        </form>
      </main>
    </div>
  );
};

export default Home;
