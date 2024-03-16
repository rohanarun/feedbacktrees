
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';

const Home: NextPage = () => {
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedback }),
    });

    const data = await response.json();

    if (data.success) {
      setMessage('Feedback submitted successfully!');
      setFeedback('');
    } else {
      setMessage('Failed to submit feedback. Please try again.');
    }

    setSubmitting(false);
  };

  return (
    <div>
      <Head>
        <title>Feedback Form</title>
        <meta name="description" content="Submit your feedback" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Submit your feedback</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here..."
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        {message && <p>{message}</p>}
        {"Test"}
      </main>
    </div>
  );
};

export default Home;
