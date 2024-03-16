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

      -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPO/pulls \
  -d '{"title":"Amazing new feature","body":"Please pull these awesome changes in!","head":"octocat:new-feature","base":"master"}'
        // Submit a pull request with the updated file
        const prResponse = await fetch("https://api.github.com/repos/" + server.REPO + "/pulls", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
                'X-GitHub-Api-Version': '2022-11-28',
Accept: "application/vnd.github+json",
            Authorization: "Bearer " + server.GITHUB_KEY,
          },
          body: JSON.stringify({
            title: "Update file based on feedback",
            body: `Feedback: ${feedback}`,
            head: "octocat:new-feature",
            base: "master"
          }),
        });
      
      console.error(JSON.stringify(prResponse))
          if (prResponse.ok) {
          return new Response(JSON.stringify({ success: true, message: "Pull request submitted successfully!" }));
        } else {
          return new Response(JSON.stringify({ success: false, message: "Failed to submit pull request." }));
        }
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
