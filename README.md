
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

const Home: NextPage = () => {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!feedback.trim()) {
      setMessage('Please fill in the feedback field.');
      return;
    }

    // Logic to handle feedback submission (e.g., API call) would be here
    // For demonstration purposes, we'll just set a success message
    setMessage('Feedback submitted successfully! Thank you.');
    setFeedback('');
  };

  return (
    <div>
      <Head>
        <title>Feedback Form</title>
      </Head>

      <main>
        <h1>
          Welcome to FeedbackTrees!
        </h1>

        <p>Your feedback is valuable to us. Please let us know how we can improve your experience.</p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here"
          />
          <button type="submit">Submit Feedback</button>
        </form>

        {message && <p>{message}</p>}
      </main>
    </div>
  )
}

export default Home
