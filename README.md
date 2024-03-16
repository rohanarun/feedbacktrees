
import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'

const Home: NextPage = () => {
  const [feedback, setFeedback] = useState('')
  const [response, setResponse] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const reqBody = { input: feedback }

    const res = await fetch('/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    })

    const data = await res.text()
    setResponse(data)
  }

  return (
    <div>
      <Head>
        <title>FeedbackTrees</title>
        <meta name="description" content="Rapid Customer-Driven Development" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to FeedbackTrees!</h1>
        <p>Yolo</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="feedback-input">Your Feedback:</label>
          <input
            id="feedback-input"
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button type="submit">Submit Feedback</button>
        </form>
        <div>{response}</div>
      </main>
    </div>
  )
}

export default Home
