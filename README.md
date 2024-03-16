## Feedback Trees
Drop this form in your website, and customers can submit feedback in parallel that instantly generates the code for the feature and triggers a pull request in your private github!

This enables customers to help build the product rapidly in parallel with feedback, and developers only need to test and approve the feature requests. 



The PRs are instantly generated here after you submit feedback on the form:  https://github.com/rohanarun/feedbacktrees/pulls

To add it to your own project, edit the environment variables in vercel to match your github repo and add your openAI and github API keys. Then drop a link or iframe to the form anywhere on your website.  

This tool was entirely generated using Cheat Layer Live Mode in ~3 hours.
 

## Get Started

1) Click use this template, and create a repository.
2) Setup a new project in vercel, and import this repo.
3) Set up environment variables by copying the variables below and editing them.
4) Deploy your application and give Vercel a moment to complete the deployment process.
5) Visit your web app in your web browser, and share it to your friends. 🥳
   
## Setting up Environment Variables

You can customize your application by using environment variables. Here are all available variables and the usages:

```env
# Client side

# The app logo url.
APP_LOGO=""
# The name of the app.
APP_NAME=""
# Summary your app's behavoir and show the users how to use it.
APP_SUMMARY=""
# Example input that shows user how to use the app.
EXAMPLE_INPUT=""

# Server side

# Required, the API key got from OpenAI (https://platform.openai.com/account/api-keys)
OPENAI_API_KEY=""
REPO=""
GITHUB_KEY=""
# Optional, the agent server of OpenAI API. Use this when the offical OpenAI API server is unreachable.
OPENAI_API_BASE_URL=""
# Optional, the system message helps set the behavior of the assistant. (Learn more from https://platform.openai.com/docs/guides/chat/introduction)
SYSTEM_MESSAGE=""
# Optional, the message template to wrap the user inputs, the `{{input}}` string in the template will be replaced by user inputs.
MESSAGE_TEMPLATE=""
```

You can edit the example file located in the root directory of this project named `.env.example`. Once you have made the necessary changes, you can then copy and paste the entire content of the file into the "Environment Variables" input field on the Vercel console.

