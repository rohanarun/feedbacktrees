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
              var orig_sha = data.items[0].sha;

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
      "role": "system",
      "content": `You are a professional html nextjs developer. Regenerate the following file based on the user feedback. Do not explain the code and only generate working nextjs code:\n\n ${fileContent}`
    },
    {
      "role": "user",
      "content": `${feedback}`
    }
  ],
  "temperature": 1,
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

   // Step 1: Get the latest commit SHA
    const baseBranchData = await fetch(`https://api.github.com/repos/` + server.REPO + `/git/ref/heads/main`, { headers });
    const baseBranchJson = await baseBranchData.json();
            console.error(baseBranchJson)

    const shaLatestCommit = baseBranchJson.object.sha;
            console.error(shaLatestCommit)

    // Step 2: Create a new branch from the latest commit
      var rand =  Math.random() * (100000 - 1) + 1;
    const newBranchResponse = await fetch(`https://api.github.com/repos/` + server.REPO + `/git/refs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ref: `refs/heads/feedback` + rand ,
        sha: shaLatestCommit,
      }),
    });

          const baseBranchJson2 = await newBranchResponse.json();

            console.error(baseBranchJson2)

    // Step 3: Update or Create a file
    const contentEncoded = Buffer.from(regeneratedContent).toString('base64');
    const prResponse2 = await fetch(`https://api.github.com/repos/` + server.REPO + `/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Init commit on`,
        content: contentEncoded,
        branch: "feedback" + rand,
        sha: orig_sha,
"committer":{"name":" Rohan Arun","email":"rohanarun@gmail.com"},
      }),
    });
    const prData2 = await prResponse2.json();
            console.error(prData2)

    // Step 4: Create a pull request
    const prResponse = await fetch(`https://api.github.com/repos/` + server.REPO + `/pulls`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: `Automated PR from Next.js for feedback`,
        head: "feedback" + rand,
        base: "main",
        body: 'This is an automated pull request.',
        draft: false,
      }),
    });

    const prData = await prResponse.json();

    if (!prResponse.ok) {
     return new Response( `Failed to create PR: ${prData.message}` );
    }

    // Successfully created PR
    return new Response( prData.html_url );
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
