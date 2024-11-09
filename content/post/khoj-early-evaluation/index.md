+++
title = "Khoj - an early hands-on evaluation "
description = "Evaluating Khoj, the open source AI assistant"
date = "2024-05-01T21:12:23-07:00"
draft = true
tags = ["LLM", "how-to", "tech-explorations", "generative-ai"]
topics = []
+++

(This is a **DRAFT** post. It is not complete and is not worth completing it. So I want to retain this as Draft itself).

### What is Khoj
[Khoj](https://khoj.dev/) is an open-source, personal AI application that helps you get answers to your questions, whether they be in your own notes or online. You can use it to get answers that are grounded in reality, references included.

### My observations

**UI is very limited** - When I just hit the enter button (up arrow), it went through the steps of udnerstanding the query, default mode etc. and then said 'looks like your query is cut off'. But acutally, the input was empty, so there was no need to try to infer it at all.

**Images** - I clicked the attachment icon and selected a jpg image, it said sorry the file is not supported. Tried it with many jpg and png files - none of it worked. All of these had worked with ChatGPT or GPT-4 directly.

**However, it worked with PDF** - I uploaded the treasury iBond PDF - it said indexed successfully. Then I asked how much did I take iBond this year?
Answer: I don't have any current notes or information about your purchase of Treasury I Bonds this year. If you've made such a purchase and would like me to remember this for future reference, please provide the details, including the amount and the date of purchase. If you're asking for general information on how to check your Treasury I Bond purchases, you can typically do this by logging into your account on the TreasuryDirect website or reviewing your bank statements if the purchase was made through a financial institution.

**My next prompt** - "I had smoothie on three days this week - Sunday, Tuesday and today."
It show the same steps 'understanding query', 'default response", 'looking for information'. This makes me wonder how much does it really understand. Also, it said it can remember stuff, but can it really?

It converts parts of the query to a date filter, for example when I asked 'did I have smoothie yesterday', it tooks some time, showed the usual sterps as follows:

``` sh
👀 Understanding Query: Did I have smoothie yesterday
Chose Data Sources to Search: notes
🧑🏾‍💻 Decided Response Mode: default
🔍 Searching Documents for:
Did I have a smoothie on 2024-05-01 dt>='2024-05-01' dt<'2024-05-02'
```

Then it gave the response - which is pretty good - the answer was correct. I love that it gave the reasoning also.
Based on the information you provided earlier, you had a smoothie on Sunday, Tuesday, and today (Thursday, May 2, 2024). Since yesterday was Wednesday, May 1, 2024, you did not have a smoothie yesterday.

**Automating a task** - I was able to schedule an email to be sent to me. It didn't ask for my email address (perhaps it will take it from the Google account I connected, let's see)

**Real time data retrieval**. I gave the prompt - who is the president of US now?

Response:

```sh
As of now, in 2024, Joe Biden is the current President of the United States. 
He is running for re-election in the 2024 United States presidential election.

👀 Understanding Query: when does his term end and when is the next election? 
Who are the contenders for the post
🗃️ Chose Data Sources to Search: online
🧑🏾‍💻 Decided Response Mode: default
🔍 Searching Documents for:

Joe Biden term end date
2024 United States presidential election date
Contenders for 2024 United States presidential election

🌐 Searching the Internet for: Joe Biden term end date
🌐 Searching the Internet for: 2024 United States presidential election date
🌐 Searching the Internet for: 2024 United States presidential election contenders
📖 Reading web pages:


https://ballotpedia.org/Joe_Biden
https://en.wikipedia.org/wiki/2024_United_States_presidential_election
https://www.nytimes.com/interactive/2023/us/politics/presidential-candidates-2024.html
```

Content retrieval seems to be working well, but it took some while. And then suddenly, it showed red icon on the left panel 'Reconnect to server'. After a few minutes, it came back, but the query seemed to just hung - it kept showing progress bar and didn't give a response.

It also showed 13 references:
```sh
2024 United States presidential election - Wikipedia
Who Is Running for President in 2024? - USNews.com
US election 2024: Who are the presidential candidates? - Reuters
National : President: general election : 2024 Polls | FiveThirtyEight
```

When I refreshed the page, the chat history remained intact, but this last question was not there.
I gave the same query again and hit the Enter button.

Interesting that it showed current agent as "khoj'. You can select another agent (Teacher, Professor, Marvin) when you start a new chat.
I chose 'Technical Lead' and asked 'who is the us president'

**Does it save the chat history?** - No. After chatting for some time, I opened a new chat window and it was empty. There were no messages shown in the left panel.

**What all data can you feed into Khoj**
- documents - in pdf form. You can chat or Search 
- your github repositories
- Notion - chat/search in your notion workspace. 
- they have an [Obsidian pugin Khoj](https://docs.khoj.dev/clients/obsidian/) - so you use it from within Obsidian, not from within Khoj - #setup


They have a blog - but very limited content and images are generated - https://blog.khoj.dev/posts/ai-risks-safety-and-mitigation/