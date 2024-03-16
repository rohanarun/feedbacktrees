// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import server from "../../config-server";
import { NextRequest } from "next/server";
import { OpenAIStream } from "../../helpers/openai-stream";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const requestBody = await req.json();

 
  // Handle form submission
  if (requestBody.action === "submitForm") {
    const { feedback, fileName } = requestBody;

    try {
      // Search for the file using the GitHub API
   // Search for the file using the GitHub API
      const response = await fetch(`https://api.github.com/search/code?q=${fileName}+in:path+repo:` + server.REPO, {
        headers: {
          Authorization: "Bearer " + server.GITHUB_KEY,
        },
      });
      const data = await response.json();
      console.error(JSON.stringify(data))

      if (data.total_count > 0) {
        const fileUrl = data.items[0].url;
        var FILE_PATH  = data.items[0].path;
        const fileResponse = await fetch(fileUrl);
        const fileContent = await fileResponse.text();

        // Regenerate the file using the GPT-4 API
        const gpt4Response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + server.OPENAI_API_KEY,
          },
          body: JSON.stringify({
  "model": "gpt-4-turbo-preview",
  "messages": [
    {
      "role": "user",
      "content": `Regenerate the following file based on the feedback:\n\nFeedback: ${feedback}\n\nFile: ${fileContent}`
    }
  ],
  "temperature": 1,
  "max_tokens": 256,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}),
        });

        const gpt4Data = await gpt4Response.json();
        const regeneratedContent = gpt4Data.choices[0].message.content;
      console.error(regeneratedContent)

    try {
     // Create a new branch
      
      
const headers = {
  'Authorization': `Bearer `+ server.GITHUB_KEY,
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
};

    
// Step 1: Get the SHA of the latest commit on the base branch
fetch(`https://api.github.com/repos/` + server.REPO + `/git/ref/heads/master`, { headers })
  .then(response => response.json())
  .then(data => {
    const shaLatestCommit = data.object.sha;

    // Step 2: Create a new branch from the latest commit
    return fetch(`https://api.github.com/repos/` + server.REPO + `/git/refs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ref: `refs/heads/feedback`,
        sha: shaLatestCommit,
      }),
    });
  })
  .then(response => response.json())
  .then(data => {
    console.log('Branch Created:', data.ref);

    // Step 3: Create or update a file in the new branch (for demonstration)
    const contentEncoded = Buffer.from(regeneratedContent).toString('base64');
    return fetch(`https://api.github.com/repos/` + server.REPO + `/contents/${FILE_PATH}?ref=feedback`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Init commit on feedback`,
        content: contentEncoded,
        branch: feedback,
      }),
    });
  })
  .then(response => response.json())
  .then(data => {
    console.log('File Created/Updated:', data.content.path);

    // Step 4: Create a pull request
     fetch(`https://api.github.com/repos/` + server.REPO + `/pulls`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Demonstration Pull Request',
        head: "feedback",
        base: "master",
        body: 'Please merge my new changes',
        draft: false,
      }),
    });
  })
  .then(response => response.json())
  .then(data => {
    console.log('Pull Request URL:', data.html_url);
    return new Response('Pull Request URL:', data.html_url);
  })
  .catch(error => {
        console.error('Error:', error);

        return new Response('Error:', error);

  });
} catch (error) {
      console.error("Error:", error);
            console.error(JSON.stringify(error))

      return new Response(JSON.stringify({ success: false, message: "An error occurred while processing the request." }));
    }
    
      } else {
        return new Response(JSON.stringify({ success: false, message: "File not found in the repository." + JSON.stringify(data) }));
      }
    } catch (error) {
      console.error("Error:", error);
      return new Response(JSON.stringify({ success: false, message: "An error occurred while processing the request." }));
    }
  }

}
