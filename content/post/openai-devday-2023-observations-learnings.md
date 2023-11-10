+++
title = "OpenAI DevDay 2023 - Observations & Learnings"
description = "My observations and learnings from the OpenAI DevDay"
date = "2023-11-09T09:02:53-08:00"
draft = false
tags = ["gpt","generative-ai", "LLM", "conferences"]
topics = []
+++

This is the fast follow (Part 2) of the previous post [OpenAI DevDay 2023 - Highlights](/post/openai-devday-2023-highlights) (aka Part 1) where I shared the highlights and the announcements made at [OpenAI DevDay 2023](https://devday.openai.com/). 

In this post right here, I will share **my observations** - about the event and OpenAI tech - and **my learnings** - from talking to people during the event and by trying out the tech hands-on. So, let's jump in!

## About the event
- I felt that the DevDay had an indie vibe to it, perhaps because most of the people there were startups and OpenAI is a young startup itself. I loved that!
- The attendees mostly were passionate and practitioners of this technology - some were tinkering with the tech, some have built startup business around it.
- The crowd was also very friendly - all the attendees were eager to connect with each other and learn what they are doing. There was a feeling of 'we are in this together, learning and doing'.
- All the sessions were developer friendly - Sam and all the presenters repeatedly said - we heard loud and clear from developers and we made this change because of that.
- All the demos were live on stage - which was really refreshing, especially after a series of pre-recorded tech announcements lately.
- The sessions were well rehearsed and timed. The content was meaningful and relevant to us.
- The food was also great, nice spread of all cuisines and great desserts too!
- My travel to the event was also interesting. I decided to take Caltrain, but it was delayed by an hour, thanks to the electrification work. On the positive side, I made a few acquaintances at the station - all of them are regular commuters and said that the train schedule is awry for the last 2 weeks.
## About the tech of OpenAI
- this company is moving so fast, they are fully benefiting from the first-mover advantage. Yes, other models are also improving quickly, but GPT-4 series will progress further ahead.
- Plugins are replaced by the actions in the GPTs. OpenAI's strategy to bring in the agent experiences with GPTs and make it availabe through ChatGPT and Assistants API.
- I think Completions API will be replaced by the Assistants API. OpenAI has all modalities - text, image, voice (and next video I guess)
- By introducing GPTs with built-in RAG [Retrieval Augmented Generation](https://www.pinecone.io/learn/retrieval-augmented-generation/), OpenAI has taken a giant leap in building agent-like experiences. And you can do it easily- no need to maintain state, conversation history, pass in a ton of context into the prompt. Amazing!
- AI apps and agents are here to stay and OpenAI is making it so easy to do! I can almost hear them saying " Auto GPT - move over! It's show time."
- I remember one of the panelists saying that all the problems that we see now with LLMs like latency, cost etc. will go away very soon. Don't wait for the problems to be solved - in fact, seeing the current pace, OpenAI will solve faster than any of us. So we should focus on using this tech and building the solutions around it. 
- Companies should unlock the power of LLMs completely - the tech is evolving so fast that it would be a mistake to build abstractions around it. Companies who want the competitive edge in the AI space should leverage the full extent of the tech and learn continuously by trying out.
## Learnings from networking
Here is what I learned from talking to OpenAI team and hanging out with the other attendees.
- Heuristics to decide when to use RAG vs Fine-tuning
	- when you want to give new knowledge to LLM, use RAG.
	- when you want LLM to do a new task (with existing knowledge) - fine-tune
	- When you have pushed the boundary of RAG and not getting the results, try RAG + fine-tuning.
- Best approach - start with prompt engineering, if that is not enough, do RAG; if this is also not enough, add fine-tuning
- Heuristics to decide when to use Assistants API this vs. roll your own system.
	- they said if you are building a chatbot that expands its knowledge by calling an API or adding docs, creating embeddings and storing in vector store, your needs will be met just using Assistants API. 
	- If you want to do more custom things, then you can build your own. Of course, you need to check all data protection measures with OpenAI Assistants API.
- a startup founder I met at the event said that most of the things that I have built so far need to be changed all over (for example, ChatGPT plugin to GPTs, but that's ok. He was excited about the reach and agency he is getting with this technology.
## Learnings from hands-on experiments
I made a simple custom GPT using the new GPT Builder. My GPT is "Bug Hunter" which will find bugs in the code. I pasted some code I had written during the JS course and asked 'is there anything wrong with this code' - it understood it correctly and suggested that I test for negative numbers, zeroes and non-integer numbers also! And (wait for it) - it told me 'to make the error message better, you can enhance the error message to include the input params x and y!"  It explained what is wrong in the code, and gave the fix for the bug also. Then I gave another code that works correctly, and it explained it properly too. It showed the output also correctly.

After publishing this custom GPT, I modified its behavior to focus **only on bug hunting** and **not code formatting** - using "Configure" tab in GPT Builder. With this change, it gracefully declines any formatting requests.

The whole experience was so amazing and magical that I wanted to tell someone. Since I was alone at home, I [tweeted about it immediately](https://twitter.com/annjose/status/1722677077286260945).

You can see the custom GPT here - [ChatGPT - Bug Hunter (openai.com)](https://chat.openai.com/g/g-fa1XjkATp-bug-hunter). And you can build your own GPTs with a Plus account or ChatGPT Enterprise.

Overall, it was a great experience attending this event - I learned a lot, met a lot of people and had fun!
