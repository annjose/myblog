+++
date = "2024-10-31T10:11:46-07:00"
draft = false
title = "Evaluating Epsilla RAG platform"
+++

This document captures the details of evaluating the tool [Epsilla](https://epsilla.com/) and how it compares to [Perplexity AI](https://www.perplexity.ai/). Epsilla is a all-in-one RAG tool that can help you create an AI agent that uses your private data and knowledge.

A PDF version of this document is available in Google Drive - [Epsilla Eval Document](https://drive.google.com/file/d/1E1_0BWqYJOYV037k5ubJNVpis3SxWp0-/view?usp=sharing).

### Background

I had tried this tool a few months ago, uploaded a couple of documents and created an application to ask questions about the document. At the time, the product was very nascent and couldn't answer most of the questions. Today when I tried it, I saw a huge improvement. Kudos to the team for making these changes!

### Evaluation Method
I uploaded a document that contains my notes from a JavaScript course I did a few months ago. These notes were very detailed and formatted as md file, so I thought it will be a good input to try Epsilla. I tried various prompts - all related to the document. I uploaded the same file to Perplexity and asked the same questions and compared the results.

### My Observations
Epsilla's answers are always accurate. Of all the questions I tried, it did not hallucinate or get confused about any questions. It always referred to the correct location in the document. When I click on the citation, it opened the correct location most of the times. But the preview of these citations were not formatted.

Perplexity also answered everything correctly. For my first query, it fetched additional information from the internet, but I asked it not to do it. From then on, it used only the info from the document. I found Perplexity's answers to be more meaningful and useful to learn the topic at hand. The response was well structured and formatted such that it was easy to read and you get a holistic viee of the answer. 

**Search History**
Epsilla shows Search history as discrete items instead of as a conversation thread. You can access them from the left side menu, but it is a bit cumbersome.
Perplexity shows it as a conversation, so it is more user-friendly.

**Related questions**
Epsilla's suggestions were ok, but not very meaningful. In one or two instances, the related questions were not related to my question.

**Citations**
Epsilla shows citations for all the questions and it points to the exact location in the document where the answer to the question is available. I checked all of the citations for the questions I asked and 90% of them were accurate (see below for the one time it didn't work). Perplexity does not show the citations as detailed as Epsilla. It shows a 'Sources' section that shows the document. But it does not show the exact location in the document where the answer is retrieved from.

**Quality of response**
While Epsilla answered all questions correctly, I found Perplexity's response to be more meaningful and useful. Epsilla's response is also not always formatted - sometimes, it formats the code snippets, but it doesn't format the main text. This is very different from Perplexity which formats all the responses well and it feels more user-friendly.

**Text formatting**
Overall, I found Epsilla's formatting of text (the response and the preview of citations) could be improved a lot. The response text is not formatted (even if the whole file is written in md format). The preview of the citation text is also not formatted. It would be nice if they are formatted - it is easy to read. When text is the main modality of the response, it makes a huge difference in the user experience and the sense of usefulness of the product. Perplexity has a big advantage here. Their responses are well formatted and structured. So you feel like to reading it fully and exploring more.

**Summarize document**
When asked to summarize the document, Epsilla could not summarize the document, but Perplexity did. See the details of this use case below.

**Out of context questions**
I asked 'who is the president of the united states'. Epsilla and Perplexity said that it doesn't have that information from the source provided, which is correct.

**Feedback of the Epsila application**
My first experience as soon as I logged in was a little confusing. I didn't know where the uploaded document was. The left menu showed 'Current Project' where the default project was chosen. I tried clicking on applications and it showed the app annkb_search i had created last time. I couldn't figure out where to find the document. Then i went to the Knowledge Bases section and I was able to see the document I uploaded.
It will be good if the application page can show a link to the knowledge base page. It shows the name of KB in the dropdown, but you cannot navigate to the KB itself.

When i made edits in the Applications page and clicked on Knowledge Bases, it reminded me if i want to discard the changes. A good reminder to save the changes, although I did not notice the *Save* button when I was on the page.

### Detailed Analysis

See detailed analaysis with the prompts and responses in the PDF doc - [Epsilla Eval Document](https://drive.google.com/file/d/1E1_0BWqYJOYV037k5ubJNVpis3SxWp0-/view?usp=sharing).