
import type { NextPage } from 'next'
import { useState } from 'react'

const Home: NextPage = () => {
  const [feedback, setFeedback] = useState('')
  const [data, setData] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const response = await fetch('/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: feedback }),
    })

    const data = await response.json()
    setData(data.result)
  }

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
      {data && <div><p>Result:</p><div>{data}</div></div>}
    </div>
  )
}

export default Home
