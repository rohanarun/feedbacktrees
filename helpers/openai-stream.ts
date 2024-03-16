// Copy from https://vercel.com/blog/gpt-3-app-next-js-vercel-edge-functions#edge-functions-with-streaming

import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
  // @ts-ignore
} from "eventsource-parser";
import server from "../config-server";

export async function OpenAIStream(payload: object, key: string, input: string) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  let url = new URL(server.openAIAPIBaseURL);
  url.pathname = "/v1/chat/completions";
var openAIKey = server.openAIAPIKey;
  if(key.length > 1){
    openAIKey = key 
  }
  

  var res = await fetch(url.href, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAIKey}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });



  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            if( typeof json.choices != "undefined"){
            const text = json.choices[0]?.delta?.content ?? "";

        
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
            }else{
const queue = encoder.encode(data);
            controller.enqueue(queue);
            counter++;
            
            }
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
