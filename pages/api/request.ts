// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import server from "../../config-server";
import { NextRequest } from "next/server";
import { OpenAIStream } from "../../helpers/openai-stream";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const requestBody = await req.json();
  var auto_prompt = "";
  let ip = req.headers.get('x-real-ip');
  
  if (!ip) {
    return true; 
  }
  
  console.log("key");
  console.log(requestBody.key);
  var model= "mistralai/mixtral-8x7b-instruct:nitro";
  var mode = "gpt4";
  
  if ("mode" in requestBody) {
    if (requestBody["mode"] == "32k") {
      model = "mistralai/mixtral-8x7b-instruct:nitro";
      mode = "32k";
    }
    if (requestBody["mode"] == "website") {
      model = "mistralai/mixtral-8x7b-instruct:nitro";
      mode = "gpt4";
    }
    if (requestBody["mode"] == "website2") {
      model = "mistralai/mixtral-8x7b-instruct:nitro";
      mode = "32k";
    }
  }

  var messages = requestBody.input;
  var new_messages = [];

  for (var kk = 0; kk < messages.length; kk++) {
    if (messages[kk]["role"] == "user") {
      messages[kk]["content"] = messages[kk]["content"].substring(0, 10000);
    }
  }
  
  // Handle form submission
  if (requestBody.action === "submitForm") {
    const { feedback, fileName } = requestBody;

    try {
      // Search for the file using the GitHub API
      const response = await fetch(`https://api.github.com/search/code?q=${fileName}+in:path+repo:owner/repo`);
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
            Authorization: "Bearer YOUR_API_KEY",
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
            Authorization: "Bearer YOUR_GITHUB_ACCESS_TOKEN",
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
        return new Response(JSON.stringify({ success: false, message: "File not found in the repository." }));
      }
    } catch (error) {
      console.error("Error:", error);
      return new Response(JSON.stringify({ success: false, message: "An error occurred while processing the request." }));
    }
  }

  var payload = {
    model: model,
    messages: messages,
    temperature: 0.0,
    transforms: ["middle-out"], // Compress prompts > context size. This is the default for all models.
    stream: true
  };

  var payload2 = {
    model: "mistralai/mixtral-8x7b-instruct:nitro",
    messages: messages,
    temperature: 0.0,
    max_tokens: 1000,
    transforms: ["middle-out"], // Compress prompts > context size. This is the default for all models.
    stream: true
  };

  var payload3 = {
    model: "mistralai/mixtral-8x7b-instruct:nitro",
    messages: messages,
    temperature: 0.0,
    stream: true,
    transforms: ["middle-out"], // Compress prompts > context size. This is the default for all models.
    max_tokens: 1000
  };

  var payload4 = {
    model: "mistralai/mixtral-8x7b-instruct:nitro",
    messages: messages,
    temperature: 1.0,
    stream: true,
    transforms: ["middle-out"], // Compress prompts > context size. This is the default for all models.
    max_tokens: 2000 
  };

  var outpayload = payload;

  if (requestBody["mode"] == "website") {
    outpayload = payload;
  }
  
  if (requestBody["mode"] == "website2") {
    outpayload = payload3;
  }

  if (requestBody["mode"] == "social") {
    outpayload = payload4;
  }

  if (JSON.stringify(requestBody.input).length < 20000) {
    const stream = await OpenAIStream(outpayload, requestBody.key,  requestBody.input);
    return new Response(stream);
  } else {
    return new Response("Request too big");
  }
}
