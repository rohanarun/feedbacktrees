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
      const response = await fetch(`https://api.github.com/search/code?q=${fileName}+in:path+repo:` + server.REPO);
      const data = await response.json();

      if (data.total_count > 0) {
        const fileUrl = data.items[0].url;
        const fileResponse = await fetch(fileUrl);
        const fileContent = await fileResponse.text();

        // Regenerate the file using the GPT-4 API
        const gpt4Response = await fetch("https://api.openai.com/v1/engines/gpt-4/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + server.OPENAI_API_KEY,
          },
          body: JSON.stringify({
            prompt: `Regenerate the following file based on the feedback:\n\nFeedback: ${feedback}\n\nFile: ${fileContent}`,
            max_tokens: 2048,
            n: 1,
            stop: null,
            temperature: 0.7,
          }),
        });

        const gpt4Data = await gpt4Response.json();
        const regeneratedContent = gpt4Data.choices[0].text;

        // Submit a pull request with the updated file
        const prResponse = await fetch("https://api.github.com/repos/owner/repo/pulls", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + server.GITHUB_KEY,
          },
          body: JSON.stringify({
            title: "Update file based on feedback",
            body: `Feedback: ${feedback}`,
            head: "feedback-branch",
            base: "main",
            changes: [
              {
                files: {
                  [fileName]: {
                    content: regeneratedContent,
                  },
                },
                commit: "Update file based on feedback",
              },
            ],
          }),
        });

        if (prResponse.ok) {
          return new Response(JSON.stringify({ success: true, message: "Pull request submitted successfully!" }));
        } else {
          return new Response(JSON.stringify({ success: false, message: "Failed to submit pull request." }));
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
