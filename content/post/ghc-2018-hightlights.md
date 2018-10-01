+++
title = "GraceHopper 2018 Highlights"
date = "2018-09-30T21:17:46-07:00"
draft = false
tags = ["ghc-2018", "highlights"]
topics = []
description = "Learnings and Experience of Grace Hopper Celebration 2018"
+++

{{< figure src="https://ghc.anitab.org/wp-content/themes/ghc-gracehopper/library/images/footer-ghc.png" alt="Grace Hopper Celebration 2018">}}

I am at the Houston IAH airport waiting to board the flight to go home after 3 days of inspiration, motivation, technology, friendship and pure awesomeness. Yes, I was at [Grace Hopper Celebration 2018 (aka GHC 2018)](https://ghc.anitab.org/), the world's biggest gathering of women technologists. This year, GHC has 20,000 attendees representing 90 countries. It was such an inspiring experience for me that I thought I should share my experiences and learnings with you my friends. Hope you enjoy reading this and be inspired yourself. Also, if you  attended GHC this year, please share your experience as well - either in the comment below or even better, write a blog and share the link!

## Day 1 - Let's Get Started
The first day was kicked off by Brenda Wilkerson, President and CEO, [AnitaB.org](https://anitab.org/). She announced this year's GHC theme "We are Here". Whether you are the little girl writing code in grade school, or the woman who is embarking on her fourth of fifth career in technology, whether you majored in Engineering, or stumbled into technology from another stream, whether you are the seasoned savvy technologist or a brilliant boot camper, you are at the right place. This is your Home. We are Here For You. 

{{< figure src="/img/ghc-2018-kickoff.jpg" alt="Brenda Wilkerson, President and CEO of AnitaB.org" width="800" height="100">}}

The first keynote was given by [Padmasree Warrior](https://ghc.anitab.org/2018-speakers-honorees/2018-speakers/padmasree-warrior/), CEO of NIO US. She emphasized the need to build a career by embracing the opportunities proactively. The key lessons that she shared with the audience were:

* Open doors and go through them; don't wait until they close on you. There is no perfect door. Be intellectually curious and intellectually humble. 
* Eyes on the stars, feet on the ground. Be decisive but listen to opinion / feedback from people around you.
* Work and learn across boundaries. Learn more than your primary discipline. 

The second keynote was from [Jessica .O. Matthews](https://ghc.anitab.org/2018-speakers-honorees/2018-speakers/jessica-o-matthews/), the CEO /co-founder of Unchartered Power. She described her life journey, starting from an engineering class assignment that resulted in a power generating soccer ball, to founding of Unchartered Power, to making the core technology an energy harvesting system that can be used in many more products. The two key takeaways from her talk were: 

> Just because it's not your plan doesn't mean it's not your destiny

> If I tried to be anything but who I am, I wouldn't be here.

Another highlight of the day was that the 2018 Technical Leadership Abie Award was awarded to Rebecca Parsons, the CTO of ThoughtWorks, a company that I always admire for being the pioneers in software engineering practices and the annual [Technology Radar](https://www.thoughtworks.com/radar) that gives insights into technology trends.

I attended many session during the day, but two of them stood out as unique. One was a session on cybersecurity "Think Like a Hacker. Defend Like a Pro" where we played a game as an employee of a hypothetical company "HackExchange", we have to hack into the hypothetical bank named "Bank of Azgard" and withdraw money from the account. The game had multiple stages, each of which presents you some information and a strategy to choose in order to infiltrate the bank's network. Based on which strategy you pick, you get to the next stage and are presented with other strategies to go deeper into the system. After completing all 5 stages, you get the result of 10 thousand dollars, a million dollars or 10 million dollars, depending on how successful your strategy was. My team got a million dollars, so not that bad. This was a fun and informative way to learn the concepts, far better than going through slide deck.

The other session that I thoroughly enjoyed was "Hands-on Exploratory Data Analysis" in which  two senior Data Scientists from Apple explained how to analyze huge amounts of data to answer important questions and draw insights - the process is known as Exploratory Data Analysis (shortened as EDA). Using dataset from [Museum of Modern Art (MOMA)](https://www.moma.org), they walked through each stage of the process starting from forming the hypotheses, data wrangling, profiling, identifying outliers, identifying relationships between variables and finally exploring the data across dimensions. It was interesting to know that this is not a linear process, instead it is like a tree where you start with one question, execute the first step, and then find more questions, branch off another small EDA on that and so on. Another key learning from this session was that EDA helps uncover things that may initially look like a bias, but has a completely different root cause. For example, the data showed that the museum acquired a huge number of artwork from male artists in the 1970's, so one would think that the Director at that time was more biased to men, but the actual reason is that in 1968, around 4900 artworks from a single artist, a French photographer, were donated to the museum. This example reiterates the principle "Correlation is not the same as Causality".

The day ended with a wonderful dinner with all Intuit folks who were attending GHC. To me, it was like a high school reunion for me as I met many of my friends/colleagues from Consumer Group which I was part of, until January. We took the iconic group photo, thanked the organizers who made all this happen, had lots of fun. Finally we went back to our hotels fully exhausted, but also excited about the next day.

## Day 2 - Bring It On
I started the day with a lot of excitement to attend the [Open Source Day at GHC](https://ghc.anitab.org/2018-attend/schedule-overview/open-source-day/) where I had signed up as a mentor to help the participants contribute to any open source project. Honestly, I was a little nervous about mentoring because the project that I was assigned to was [an Android mobile app project](https://github.com/systers/mentorship-android), which I am not as comfortable as iOS. But I thought this is a good opportunity to help people who are new to open source, help them get over the hump of submitting their first PR, give them the confidence to contribute to more projects. I went there prepared with the development environment setup and a good understanding of the code. 

{{< figure src="https://ghc.anitab.org/wp-content/uploads/sites/2/2018/08/systers-logo-700x127.png" title="" >}}

There were around 100 participants and around 10 mentors at the event. Participants could choose from a shortlisted set of projects and they were assigned mentors to help them. The projects were as follows:

* FixMe - Mozilla's Open Source Student Network tool
* Oppia education platform that creates interactive lessons for children
* Mentorship Android app by Systers group
* Using OpenStack cloud to support humanitarian efforts
* Women's P2P network that creates a digital support system for women candidates
* Using RedHat's OpenShift Container platform  

More details on these projects can be found at https://ghc.anitab.org/2018-attend/schedule-overview/open-source-day/.

My assigned project was the [Systers mentorship app](https://github.com/systers/mentorship-android) which was developed by an amazing student Isabel Costa, as part of Google Summer of Code. Our objective for the day was to tackle the bugs or implement the enhancements mentioned in the GitHub issues. All of my team members were new to Android, so I helped everyone set up their dev environment got the app running on the emulator. Then we rolled up our sleeves and started coding!

At the end of 4 hours of hacking, we were able to [submit 4 PRs](https://github.com/systers/mentorship-android/pulls) and gave a demo of the work to the other teams. The most exciting thing was that for all the participants, this was their first pull request ever. So was it for every team who presented at the podium. It was great to see how proud they were of their accomplishment. Today's experience could turn out to be a new trajectory in their career. For me personally, this was a very fulfilling experience helping the teams and helped me get over the anxiety of mentoring at a live hackathon. Definitely a get-out-of-your-comfort-zone experience.

{{< figure src="/img/ghc-opensource-day-team.jpg" title="My Mentorship App Team" height="300" width="600">}}

The other exciting thing for the day was the booth duty at the Intuit booth at GHC. The Intuit booth was pure awesome sauce, built on the theme of the Intuit giant and women in technology. It captured everyone's attention as they walked by our booth. A lot of people came to our booth to submit their resumes and to know about our work culture, tech stack, learning opportunities etc. The good thing was that I didn't have to prepare for this at all. Intuit is such a great company that I had to just speak my mind and give my honest opinion, and that excited everyone who visited our booth.

At the end of the day, I went for the Intuit recruiting event which was yet another arena for non-Intuit folks to meet us and ask questions in a much smaller, focused environment. It gave them a forum to ask questions that are more tailored for their situations like early-career, mid-career, architecture or data science. I had a lot of 1:1 conversations with people who were eager to know how to get to the next level in their career, find a mentor or sponsor who can give them a 360 degree view and how to maintain the work life balance. What I learned was that many people are overwhelmed by the fast pace of technological advancements and they don't have anyone to give guidance on what to do. My advice to them was to learn the fundamentals, spend a small amount of time everyday learning something so that it adds up to have the compound effect. The other common question was how to claim genuine credit for the work that they do without bragging about it. I encouraged them to write down everything, share it with their team and ask for feedback. Do this for everything - be it a simple idea, a design proposal, or a potential solution to a customer problem. I believe this gives everyone an equal ground to collaborate and contribute.

## Day 3 - Time to Wind Down
This was the last day of the conference, and it is time to wind down, reflect about the last two days and say adieu. One of the highlights for this day was the excellent talk by Prof. Anita Hill recounting her experience speaking the truth and combating sexual harassment at the workplace. The key takeaway was that more women are organizing, speaking up against the challenges in the workplace. As she rightly said "We move cones".

The day ended with the Closing Keynote with Nora Denzel as the MC. Nora was so funny and entertaining as usual. It is amazing to see her on stage, so comfortable, but at the same time serious about introducing the speakers and winners with due respect. I remember seeing her when she was the VP of Engineering at Intuit six years ago, I was awe-struck then and so was today. 

During the keynote, they also announced the results of the [PitcHER contest](https://ghc.anitab.org/2018-anitab-org-pitcher/) where women entrepreneurs can pitch their idea and win a prize for top three and Audience favorite. The winners were young entrepreneurs who took the leap of faith to start a business on their own and became successful. The key takeaways from the panel discussion with the winners:

> "You have to play the game to change the game"

> "As a founder, you are lifting the weight that many can't; so own that and be proud of it"

> "You are doing the things because nobody else well. If you don't do it, then who?". 

> "Invest in networking proactively rather than waiting for the need to come, so that when you need it, you have the people around you that can help". 

The Keynote session ended with a great talk by Megan Smith, the third CTO of US. She put forth a lot of interesting - for example, that Ida Wells used data to fight lynching and investigate journalism, that two-thirds of code-breakers at Bletchley Park were women, that Ada Lovelace, the world's first computer programmer said in 1844 that "I hope to bequeath to the future generations calculus of the nervous system". Megan remarked "that looks like AI to me". It was yet another inspiring talk. In fact, after the talk, I was interested in knowing more about Ada Lovelace and found this good article [Untangling the tale of Ada Lovelace](http://blog.stephenwolfram.com/2015/12/untangling-the-tale-of-ada-lovelace/). Megan also urged everyone to use computer science for all topics - remove poverty, sustainable environment etc. She also announced the initiative [TimesUp for Tech](https://timesup.tech/) which aims to use technology to solve safety, equity and dignity issues in the tech workplace.

## So What's Next?
{{< figure src="https://ghc.anitab.org/wp-content/uploads/sites/2/2018/09/IMG_0316.jpg" alt="GHC - Our Time Gallery" width="600" height="300">}}

This year's GHC was a truly inspirational experience. Even though I consider myself a very independent woman, I was amazed and felt comfortable in the midst of the diverse community of people who are willing to support each other and help others build their career. GHC showed me that nobody is alone; there is a sea of people that understand you, are willing to support you and they also need your help.

After reflecting on what is the one thing I can do differently from now on, I have decided to help and encourage people to contribute to open source. Even though Open Source a great place to learn and gives everyone the equal opportunity to contribute, most people are afraid to step in to this world. Submitting the first pull request is a daunting thought for them. I want to help them get over that fear and doubt. I will also strive to help everyone in my team, especially the quite people so that they have a voice, give them the confidence to speak up and contribute back to the community. That is my mission from now until next GHC. 
