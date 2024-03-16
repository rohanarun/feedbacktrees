import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import logo from '../public/logo.svg';

const Home: NextPage = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically handle the submission (e.g., posting to a server)
    // Placeholder for submission logic
    console.log(feedback);
    setSubmitted(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(event.target.value);
  };

  return (
    <div>
      <Head>
        <title>Feedback Trees</title>
        <meta name="description" content="Send your feedback about Feedback Trees" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to <a href="#">Feedback Trees!</a>
        </h1>
        
        <p>Your feedback is valued. Share your thoughts with us!</p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            id="feedback"
            name="feedback"
            value={feedback}
            onChange={handleChange}
            placeholder="Enter your feedback here..."
            required
          ></textarea>
          <button type="submit">Submit</button>
        </form>

        {submitted && <p>Thank you for your feedback!</p>}

        <footer>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span>
              <Image src={logo} alt="Feedback Trees Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </main>
    </div>
  );
};

export default Home;