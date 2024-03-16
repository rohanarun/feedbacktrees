import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulating a POST request to an API for saving feedback
      // This is a placeholder, in real application, this should be an API call
      console.log(`Sending feedback: ${feedback}`);
      setMessage('Thank you for your feedback!');
      setFeedback(''); // Clearing the feedback input after submission
    } catch (error) {
      setMessage('Failed to send feedback. Please try again.');
    }
  };

  return (
    <div>
      <Head>
        <title>Feedback Trees</title>
        <meta name="description" content="Submit your feedback about Feedback Trees" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Feedback Trees</h1>

        <p>Have something to share? We are all ears!</p>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="feedback">Your Feedback:</label><br />
          <textarea
            id="feedback"
            name="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          ></textarea>
          <br />
          <button type="submit">Submit Feedback</button>
        </form>
        
        {message && <p>{message}</p>}

        <Link href="/about">
          <a>About Feedback Trees</a>
        </Link>
      </main>
    </div>
  )
}