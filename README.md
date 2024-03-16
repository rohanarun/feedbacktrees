
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRef, useState } from 'react'

const Home: NextPage = () => {
  const [feedback, setFeedback] = useState<string>('')
  const feedbackRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!feedbackRef.current) return

    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedback: feedbackRef.current.value }),
    })

    if (response.ok) {
      setFeedback('')
      alert('Feedback submitted successfully')
    } else {
      alert('Failed to submit feedback')
    }
  }

  return (
    <div>
      <Head>
        <title>Feedback Form</title>
        <meta name="description" content="Submit your feedback" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to our feedback form
        </h1>

        <p>Your feedback is important to us</p>

        <form onSubmit={handleSubmit}>
          <textarea
            ref={feedbackRef}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here"
          />
          <button type="submit">Submit Feedback</button>
        </form>

        {/* Test */}
        <div>Test</div>
      </main>
    </div>
  )
}

export default Home
