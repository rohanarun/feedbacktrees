```jsx
// pages/index.js

import Head from 'next/head';
import React from 'react';

export default function Home() {
  return (
    <>
      <Head>
        <title>FeedbackTrees</title>
        <meta name="description" content="Gather feedback efficiently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to FeedbackTrees
        </h1>

        {/* Add additional content here */}
      </main>

      <footer>
        {/* Add footer content here */}
      </footer>
    </>
  );
}
```