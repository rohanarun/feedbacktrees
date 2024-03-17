
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

const Home: NextPage = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    // Assuming an API exists at /api/feedback to handle the submission
    await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback,
      }),
    });
  };

  return (
    <div>
      <Head>
        <title>Feedback Form</title>
        <meta name="description" content="Submit your feedback" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Feedback Form</h1>
        {
          !submitted ? 
          <form onSubmit={handleSubmit}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback"
              required
            />
            <button type="submit">Submit Feedback</button>
          </form> :
          <p>Thank you for your feedback!</p>
        }
      </main>
    </div>
  )
}

export default Home
