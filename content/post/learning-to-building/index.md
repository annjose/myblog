+++
title = "From Learning to Building"
description = "A milestone in my Reimagine journey"
date = "2024-01-27T20:13:13-07:00"
draft = false
tags = ["new-beginning", "personal-growth", "career", "building"]
topics = []
+++

It's been a while since I last shared an update on my [Reimagine journey](/tags/new-beginning/) that started three months ago. Initially, I used to share my progress every week and it helped me build momentum during the early stages. But after some time, this weekly ritual became tedious - sometimes taking up an entire day for a single post. So I decided to share updates based on significant **milestones** rather than tying them to specific **points in time**. 

Today, I am thrilled to share a significant milestone of my journey - I am transitioning from the phase of learning 📚 to building 🛠️ - as a maker, a coder.

### The Transition
Technology has always been my passion and my 18-year tenure as an individual contributor — working across desktop, full-stack, and mobile development — built my love for coding and developed an intuition to look under the hood. However, ever since I took on people leadership responsibilities, I had to give up my coding time. This shift was necessary for my job *and* the right thing to do for my team and the company. During that time, I continued to follow technology news and occassionally dabbled on small coding experiments, but none of it came close to spending long periods of uninterrupted coding - a passion I wanted to renew. That is why I set out the primary objective of my [Reimagine journey](/post/new-beginning/) to revive my identity as a **Tech Builder** - to be fully hands-on with code and build technical solutions. 

The past three months have been dedicated to the '**learning mode**' - focused on refreshing and mastering the fundamentals of web development. Starting with the plain vanilla HTML/CSS/JS, I progressed through TypeScript, React and NextJS gradually and exploring a few CSS frameworks. Throughout this time, I was not only learning concepts, but also writing a lot of code - mostly examples and exercises from the courses I was doing, all of which is published in my github repo [https://github.com/annjose](https://github.com/annjose). This immersive experience solidified my understanding of fundamentals gave me the confidence to take the next step.

At the beginning of this year, I decided to switch from learning mode to the '**building mode**', with the goal to develop the skill of quickly translating ideas into code - combining a few APIs, tools and a simple UI to see them in action. Three weeks into the year now, I am confident that I have made the transition, based on a few instances described below.

### A few examples

- I came across a tool named [Asciinema](https://asciinema.org/) that can record terminal sessions in a lightweight text format. It was super easy to use and fun to play with. So I explored it a little bit more and realized that once you create a recording (or *cast* as they call it), you can embed it inside in a web page using [Asciinema Player](https://docs.asciinema.org/manual/player/) and interact with it through a simple API. I wanted to try it out, so I read their [QuickStart guide](https://docs.asciinema.org/manual/player/quick-start/), built a React component to host the player, embedded my cast file in it and added some UI elements to control it from the React component - all in just under an hour!

- During the holidays, my family and I were discussing an idea - what if we set out to visit all the national parks in the US during our lifetime. As a first step, I wanted to see a comprehensive list of all national parks, so I looked up the [National Park Service website](https://www.nps.gov/), but it was not intuitive for my purpose. There was no easy way to search for parks in specific states or specific activities, and I had to go into each page one by one. I was disappointed, but to my surprise, the very next day, there was [a HackerNews post](https://news.ycombinator.com/item?id=39085830) that the [NPS Data API](https://www.nps.gov/subjects/digital/nps-data-api.htm) is available for everyone to use. I was elated. I looked up [their documentation](https://www.nps.gov/subjects/developer/api-documentation.htm), signed up for an API key and tried out the APIs. In under 30 minutes, I managed to write a few lines of code to call the API and get the exact data that I was looking for.

- As my collection of tiny web apps continue to grow (a Tic Tac Toe game, a frontend for [The Movie Database (TMDB) API](https://developer.themoviedb.org/reference/intro/getting-started), the Asciinema player host and more), I decided to build an uber 'playground' app. The goal was to host these tiny apps, all of which had silly UI and simple code, but I wanted to publish them to public domain rather than running them on my local machine. I chose [Vercel](https://vercel.com) as the deployment platform, read [their documentation](https://vercel.com/docs/getting-started-with-vercel) and tweaked my code a little but to match their deployment configuration. It was a pretty straight-forward process - thanks to Vercel's impeccable docs and seamless GitOps implementation. Within an hour, all my tiny apps, along with the playground app, were published successfully and accessible at [https://learn-react-umber-five.vercel.app/](https://learn-react-umber-five.vercel.app/).

Being able to create apps like these quickly and seeing them in action in the public domain was pure joy to me. It was deeply fulfilling to realize that the code I had written was now running in a production environment, regardless of their simplicity. It is almost like a dopamine hit - the day I deployed these apps, I was walking around my home with a wide smile on my face.

### Two key takeaways

Relfecting on the past three months of learning mode, I realize two key things:

- Web development has advanced so much in the past few years - the tools, the programming languages and the frameworks have evolved a lot. The best part if that it is super easy to get started and accessible to everyone. Of course, the tech is evolving at a rapid pace, but once you nail the fundamentals, it is not hard to learn and stay up-to-date. The key is to learn continuously and choose the right tool for the right job.

- When I am deep in the building mode, I enter a state of flow. I feel the world around me disappears and I am in my groove - leaving only my IDE, git and code. I love that feeling and it reminds me much I missed it in the past three years. On a typical day, I manage to spend around 4-5 hours on learning/coding alongside my health routine, home responsibilities and pursuing my hobbies. It is a good balance and enjoy every minute of these sessions.

### A few important updates
My **health routine** is continuing to go steady. I am still continuing the strength exercise routine three days a week and 30 min walking everyday. This month, I started a new routine of rowing 2000m three days a week and running 0.5 miles a day. Many of these routines were hard in the beginning, but have since become easier and starting to be second nature to me. 

**Daily/weekly reflections** and planning my day and week in Obsidian helps a lot. I still follow the bullet journal method - but augmented it with a digital version in Obsidian. I intend to write a dedicated post on how I plan my day and week, and what is working and what is not. There is no 'perfect' way, but I tweak it every day and steadily make progress - one day at a time.

In the realm of hobbies, I picked up a crazy one - **(re)learning Mathematics**. I did my masters in Mathematics two decades ago, but I found a renewed interest in it when I started learning it again through an excellent learning platform called [Math Academy](https://mathacademy.com/) (you can probably guess where I found it? - yes, on HN). They have a lot of Math courses, tons of practice problems and quizzes, uniquely designed for accelerated learning, tailored for children and adults. It incorporates spaced repetition and pre-requisites for each concept. 
* Right now, I am doing the course [Mathematical Foundations - Part I](https://mathacademy.com/courses/mathematical-foundations-i) and I wnat to progress to the course [Mathematics for Machine Learning](https://mathacademy.com/courses/mathematics-for-machine-learning). 
* What I appreciate the most is its singular focus on mathematics – when I'm engrossed in solving problems, that's precisely what I'm doing, without any distractions or unnecessary gamification. There is a leaderboard on the side and you can see your progress, but it is not distracting. 

Who knew I would rekindle my love for Math after all these years! I love it.

Finally, a few weeks ago, I had the fantastic opportunity to **meet my awesome team at Intuit** - some of them during lunch time on campus and other as 1:1 off campus. It was great to reconnect with everyone and catch up like old times. My team has always been a part of me - personally and profressionally. All of them are doing well, advancing in their career, some of them got promoted to the next level(yay!), expanded their roles, are embracing new opportunities and tackling new challenges. Seeing their growth and continuous learning is exciting to me. They asked when I am coming back and I said - it's only been three months; *miles to go before I* ....

### Conclusion
All in all, my journey is going well - with a good mix of learning, building, taking care of health, and cherishing moments with family and friends. Once again, I am very grateful and proud that I am able to pursue this path of personal growth. 

My new year's resolution is to **build a healthy body 💪, active brain 🧠 and relaxed mind 💚**. I feel confident and excited to fulfil that resolution in the year ahead. 🎉