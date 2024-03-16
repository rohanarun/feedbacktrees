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
 let ip = req.headers.get('x-real-ip')
    if(!ip){
   return true; 
  }
  console.log("key");
  console.log(requestBody.key);
var model= "mistralai/mixtral-8x7b-instruct:nitro";
   
  var mode = "gpt4";
  
  if("mode" in requestBody){
    if(requestBody["mode"] == "32k"){
      model = "mistralai/mixtral-8x7b-instruct:nitro";
    mode = "32k";
    }
    if(requestBody["mode"] == "website"){
      model = "mistralai/mixtral-8x7b-instruct:nitro";
    mode = "gpt4";
    }
       if(requestBody["mode"] == "website2"){
      model = "mistralai/mixtral-8x7b-instruct:nitro";
    mode = "32k";
    }
//"compress"    
  }


/*  let url = new URL("https://cheatlayer.com");
  url.pathname = "/user/checkTasks";

  const res2 = await fetch(url.href, {
    headers: {
      "Content-Type": "application/json"    },
    method: "POST",
    body: JSON.stringify({id:requestBody.id, mode: mode}),
  });

  const responseData = await res2.json();
*/
var messages = requestBody.input;
var new_messages = [];

  for(var kk = 0; kk < messages.length; kk++){
    if(messages[kk]["role"] == "user"){
      messages[kk]["content"] = messages[kk]["content"].substring(0,10000);
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

    stream: true  };
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

   if(requestBody["mode"] == "website"){
outpayload = payload;

   }
  
   if(requestBody["mode"] == "website2"){

outpayload = payload3;

   }
     if(requestBody["mode"] == "social"){
       outpayload = payload4;


   }

    if(JSON.stringify(requestBody.input).length < 20000){
  
  const stream = await OpenAIStream(outpayload, requestBody.key,  requestBody.input);
  return new Response(stream);
    }else{
return new Response("Request too big");
  
    }

  
}
