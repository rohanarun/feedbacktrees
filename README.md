
import type { NextPage } from 'next'
import { useState } from 'react'

const Home: NextPage = () => {
  const [input, setInput] = useState('');
  const [data, setData] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    const responseData = await response.json();
    setData(responseData.result);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input">Your Input:</label>
        <input
          id="input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {data && <div>Result: {data}</div>}
      <p>Thanks</p>
    </div>
  )
}

export default Home
