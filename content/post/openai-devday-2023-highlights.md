+++
title = "OpenAI DevDay 2023 - Highlights"
description = "My notes and key takeaways from the OpenAI DevDay"
date = "2023-11-09T05:32:13-08:00"
draft = false
tags = ["gpt","generative-ai", "llm", "conferences"]
topics = []
+++

This week I attended the [Open AI Dev Day](https://devday.openai.com/) on 6 Nov 2023 at SVN West, San Francisco. This event was special in many ways - for me, this is the first conference I attended since the pandemic and the first one during my new journey; for OpenAI, this is their first developer conference ever! So I think it deserves a dedicated blog post to share the highlights, key takeaways and my observations, right? Right! 

I will split this into two posts - Part 1 (this post right here) which gives a comprehensive list of all the announcements in the event and Part 2 as a fast follow [OpenAI DevDay 2023 - Observations & Learnings](/post/openai-devday-2023-observations-learnings/) which has my observations, learnings from the networking with folks and trying out some of the capabilities hands-on. So, let's go!

Note - There are a lot of links and references in this post so that everyone (myself included) can refer to it later. Who doesn't love going down rabbit holes😉? You will also find a lot of content in italics, which are mostly my monologue/comments on the topics.

Let's start with the keynote session. It is best to break it down into few parts so that we can cover everything.

## Part 1 - Intro

Sam Altman, the CEO of OpenAI, opened the keynote without any fluffy intro, he said Welcome to Dev Day and cut to the chase. Oh, he did call out one thing that San Francisco has always been home for OpenAI from day one and they are looking forward to continuing to grow here. Pretty cool to give the city some love - ok, got it!

- He startd with a reminder that ChatGPT was released on 30 Nov (*can you believe it is not even a year since then*), then GPT-4 a few months later and then voice, vision, DALL-E, ChatGPT Enterprise edition. 
- Then some stats - ChatGPT has 100M weekly active users, 2M developers are using the OpenAI APIs, more than 92% of Fortune 500 companies are using their products (*who are the other 8% companies?*).
- Then he showed a video of many customer testimonials, three of which really stood out to me:
    1. a high-achieving student (and parent of four kids) saying "it gave me a life back that I could learn myself"
    2. a 100-year old person saying "I discovered it on my 100th birthday and it is a wonderful thing"
    3. an artist saying "this technology has level set the field - it opened my mind to what every creative could do if they had a person helping them out."

## Part 2 - Introducing the new model - GPT-4 Turbo
The new version of GPT is here - **GPT-4 Turbo**. It is better and more capable than GPT-4, and offers six capabilities:
1. **Higher context length of 128K tokens** - this is 16 times longer than GPT-4's default 8K context. The new model is also more accurate over the longer context. Nice!
2. **More control for developers** - The model now supports **JSON Mode** which ensures that the model responds with a valid JSON which makes it much easier to call APIs. The model has **gotten better at function calling** to support parallel invocations, i.e. you can call many functions at once. The new model supports **reproducible outputs** - you can send in a [seed parameter](https://platform.openai.com/docs/api-reference/chat/create#chat-create-seed) which constrains the model to return consistent outputs and use the [system_fingerprint response parameter](https://platform.openai.com/docs/api-reference/completions/object#completions/object-system_fingerprint), both of which offers control towards determinitic outputs.
3. **Better world knowledge** - (*this is the killer*)
   * Retrieval augmented generation **(RAG) is built into the platform**, so you can fetch additional data from docs or DB. (*there was another session that clearly explained when to use RAG vs. fine-tuning, more on that soon!*).
   * This new model has the **world knowledge upto April 2023**. Sam also mentioned that they will try to never let it get that out of date again - *keep the promise, ok?*
4. **New modalities** - DALL-E 3, GPT-4 Turbo with vision and a new text-to-speech (TTS) model are available via API
	* you can use the [DALL-E API](https://platform.openai.com/docs/guides/images?context=node) to generate images, edit them and create variations. Coke is using this API to launch a Diwali campaign to let customers design custom Diwali cards.
	* GPT-4 Turbo is available via the API as `gpt-4-1106-preview`. It can accept images as input through the API and generate captions, classifications and data analysis.
	* [New TTS model](https://platform.openai.com/docs/guides/text-to-speech) can generate natural sounding audio from text and you can choose from six preset voices. (*this will be great for language learning - DuoLingo!*)
	* [Whisper](https://github.com/openai/whisper), the open source speech recognition model also gets a new version - Whisper V3
5. Customization - they launched a new experimental access program **Custom Models** where OpenAI researchers will work with companies and help them make a custom model specific to their domain (including custom pre-training, custom reinforcement learning etc.). *This is very likely to be expensive, but good to see that they are trying different monetization approaches.*
6. **Higher rate limits** - the [rate limits](https://platform.openai.com/account/limits) have been doubled for GPT-4 customers, and you can request even further increase through the playground. They also announced **Copyright Shield** program where OpenAI will defend ChatGPT Enterprise and API customers and pay the cost incurred if they face claims on copyright infringement. Sam also reminded everyone - we do not train on your data from API or ChatGPT Enterprise.
7. And one more thing (*cliche*) - Pricing (a big request from developers and OpenAI heard it loud and clear) - they reduced price across the board - here is the full rundown:
	* GPT-4 Turbo is **three times cheaper than GPT-4** - 3X less for prompt tokens (i.e. \\$0.01 for 1000 tokens) and 2X less for output tokens (\\$0.03 for 1000 tokens)
	2. GPT-3.5 16K model became so cheaper (reduced by 3X) that it is cheaper than the previous vrsion GPT 3.5 4K
	3. Fine-tuning with GPT-3.5 Turbo has also become cheaper now

## Part 3 - Hello Satya!
Then comes Satya Nadella to share a few thoughts on the partnership with OpenAI. The good thing was this was done in an interview style with Sam, so it was less formal than a presentation. 

Sam asked how Microsoft is thinking of the OpenAI partnership (and jokingly added - I don't want to take too much of your time). Satya said "we love you guys! It has been fantastic. I still remember the first time you reached out to me asking 'hey do you have some Azure credits' and we have come a long way from there. What you have built is magical.
*(My monologue - did Sam reach out to Google or AWS also at the time and if so, what was their response? Would they be regretting it now?)*

Satya emphasized that the OpenAI's workloads are different and new - the training jobs are synchronous, large and data parallel. In order to build an infrastructure that supports it, Microsoft had to change the systems. This has drastically and rapidly changed the shape of Azure. He also said that his own conviction of LLMs changed when he first saw GitHub Copilot on GPT. Microsoft want to build their Copilot, Github Copilot using OpenAI APIs. *That right there is a win, win!*

Satya reiterated that they fully commit to ensure that OpenAI will have the best systems for training and inference, and the best compute to push the limits of what is possible. He said - AI is useful only if it empowers everyone, so we need to make sure that the benefits of AI are disseminated across the world. *Amen!*

## Part 4 - ChatGPT Enhancements

ChatGPT now uses the latest GPT-4 Turbo - with the latest knowledge cut-off and improvements. It can browse the web, run code, generate analysis and generate images. All of this available now. (*I verified then and there*).

And now the bomb - introducing **GPTs** - tailored versions of ChatGPT built for specific purpose (aka build agents of your own)! People can build personal, customizable AI agents to do anything. GPTs have three parts - Instructions, Expanded knowledge and Actions.

Sam also gave a big prologue on safety saying that iterative development is the best way to address the safety challenges of AI, so we are starting small with GPTs and we should move carefully. Then he shared a few examples:
* [code.org](https://code.org/) built a **Lesson Planner GPT** that helps teachers build customizable lessons for their students
* [Canva](https://www.canva.com/) built a GPT that lets you design a site by saying what you want.
* There was was a live demo of **Zapier AI Actions** - a GPT built by [Zapier](https://zapier.com/) that lets you perform actions across their 6000 app integrations. They showed this custom GPT side-by-side with a calendar on the phone. The GPT asked permission to access the calendar and gave some insights on the schedule. The best part - the presenter asked the GPT to send a message to Sam and he received it on his phone immediately and he showed it to the audience. *I think (and hope) that this was live code, but you never know.*

Sam also gave a live demo of building a custom GPT from scratch using their **GPT Builder**. It suggested a name (**Startup Mentor**), generated a profile picture and took instructions on the purpose of the GPT (in this case, an advisor for startup founders). He also uploaded docs to the GPT so that it can answer questions on that as well.

You can create these GPTs and use for your own needs, share with your trusted circle, or public or event to the company if you are on Enterprise version.

OpenAI will release a GPT store at the end of this month where developers can make these GPTs available and participate in revenue sharing. *Ahem! The App Store moment for GPTs?*

*I tried the GPT Builder today and made a custom GPT - Bug Hunter. It was super easy - so magical that I coudn't resist posting a thread on Twitter instantly - [tweet link](https://twitter.com/annjose/status/1722677077286260945). You can try out [Bug Hunter here](https://chat.openai.com/g/g-fa1XjkATp-bug-hunter).*

## Part 5 - API
Introducing **Assistants API**, the new API to create custom GPTs and AI chatbot within any application! This makes it easy for developers to build custom assistants and agent-like experiences, for example custom assistants like [Shopify's Sidekick](https://www.shopify.com/magic), [Discord's Clyde](https://support.discord.com/hc/en-us/articles/13066317497239-Clyde-Discord-s-AI-Chatbot) and [Snapchat's My AI](https://newsroom.snap.com/sps-2023-whats-next-for-my-ai).

This new [Assistants API](https://platform.openai.com/docs/assistants/overview) supports persistent threads (to maintain conversation history), has built-in retrieval, code interpreter and function calling.

*This will be game changer - we don't need to worry about conversation history, independent RAG, chunk documents into smaller chunks etc. - all of that comes out of the box with the API*. 

*Here is an overview of Assistants API - https://platform.openai.com/docs/assistants/overview - pretty straightforward APIs - you create an assistant, create a thread, add a message to a thread and then run it. The pricing for this is not fully clear - one of the OpenAI team members said that it maybe per run.*

They showed a demo of this new API in a travel planner app Wanderlust planning a trip to Paris. They showed uploading big documents, managing the conversation history, and function calling which answered a question and dropped pins on the map at the same time. They also showed the code interpreter doing a calculation within this sandbox environment. Pretty rad!
They showed a mobile app that used the Whisper API, Assistants API and the new TTS model - that was fun. And as cherry on top, he also announced $500 credits to all the attendees.

Assistant API is available today - confirmed that I see it in my account in the playground.

## Part 6 - Closing thoughts
Sam summarized all the announcements and took a moment to thank the team that built all of this. He said OpenAI has a high talent density, but it takes a lot of hardwork and coordination to make this happen. Great job OpenAI team!

He said hope we will come back next year and that what we launched today will look quaint relative to what we are busy creating now. *If we look at the amazing work done by OpenAI in the last 11 months, that is very much possible.*