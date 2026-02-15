+++

title = "GPT-4 Technical Report Highlights"
description = "My key insights and takeaways from the GPT-4 Technical Report"
date = "2023-04-09T12:59:18-08:00"
draft = false
tags = ["gpt","generative-ai", "llm", "tech-explorations"]
topics = []
+++

OpenAI published the [GPT-4 Technical Report](https://cdn.openai.com/papers/gpt-4.pdf) on 27 Mar 2023. I wanted to read it immediately but was intimidated by the fact that it is a 100-page document. It turns out that it was not as difficult as I anticipated, it can be easily read over a weekend. The best part is that this report describes the key terminologies and methodologies used in the development of GPT-4. It's always beneficial to obtain this information directly from the source.

The main content of the technical report is only about 14 pages, and the rest of the report is filled with citations and appendix sections that describe the exam benchmark methodologies. The final section includes a system card detailing safety challenges with GPT-4 and the safety processes developed by OpenAI to prepare GPT-4 for deployment.. This section is lengthy but provides valuable information on improving safety, including examples of prompts, responses, and instructions.

In this blog post, I intend to share my key takeaways from the main technical report. It will begin with a summary before delving into the report's three main topics from the report. I hope that sharing my key takeaways from the report will inspire you to read it and deepen your understanding of the exciting advancements in large-language models and generative AI in general.

## Summary
GPT-4 is a large-scale multimodal model that can accept **image and text inputs** and produce text outputs. It is a transformer-based model pretrained to predict the next token in a document. It is trained on publicly available data and data licensed from third-party providers. with a cut-off date of Sep 2021. It lacks knowledge of events that occured after that date.

The pretrained model was fine-tuned using **Reinforcement Learning with Human Feedback** (RLHF) to improve alignment with user intent - i.e. produce responses that were better aligned iwth user's intent. The post-training alignment process enhances performance on factuality and adherence to the desired behavior. This helped the GPT-4 team accomplish the primary goal of improving the model's ability to understand and generate natural language text, especially in complex and nuanced scenarios. 

They also developed deep learning infrastructure and optimizations that behave predictably across a wide range of scales. This helped them predict the expected performance of GPT-4 using less than 1/1000th of the compute of GPT-4. 

## Capabilities
GPT-4 was tested on a diverse set of benchmarks - simulating exams that were designed for humans. Exam questions included multiple-choice and free-response questions. Some questions included images as well. The model was not given specific training for these exams. The model saw a small set of these exams during training. But they tested with **two variants** - one with these questions included and the other with these questions removed, and they took the lowest of the two scores. This prevents data contamination issues where the test data appears in the training set.

| Exam Type          | GPT-4          | GPT-3.5        |
| ------------------ | -------------- | -------------- |
| Uniform Bar Exam   | 90th (198/400) | 10th (213/400) |
| SAT                | 93rd           | 87th           |
| GRE (Quantitative) | 80th           | 25th           |
| AP Calc BC         | 4/5            | 1/5            |
| AP Physics 2       | 4/5            | 3/5            |
| Leetcode Easy      | 31/41          | 12/41          |
| Leetcode Hard      | 3/45           | 0/             |

These capabilities on exams seem to be because of the pre-training process and not from RLHF.

### Visual Inputs
GPT-4 takes images and text as inputs which can be arbitrarily interlaced (documents with text and photographs, diagrams, screenshots). A good demo of this  capability was done by giving the three-panel image of a VGA adapter connected to an iPhone charging port ([original post in Reddit](https://www.reddit.com/r/hmmm/comments/ubab5v/hmmm/) to GPT-4 along with the prompt `What is funny about this image? Describe it panel by panel.` Not only did GPT-4 describe the image in each panel, it also understood the humor in the image and included that nuance in the response - the absurdity of plugging in a large legacy adapter into a modern smartphone charging port.

## Limitations
GPT-4 is not fully  reliable, has a limited context window and does not learn from experience. The report says..

> Care should be taken when using the output of GPT-4, particularly in the context where reliability is important.

GPT-4 has significantly reduced hallucinations compared to GPT 3.5 models (19 points higher than GPT-3.5 on adversarially-designed factuality evaluations). It can be confidently wrong in its predictions, not taking care to double-check the work. 

[System card](https://cdn.openai.com/papers/gpt-4-system-card.pdf) describes the safety risks they foresee around bias, disinformation, over-reliance, privacy, and cybersecurity. It also describes the interventions made by OpenAI to mitigate potential harms - they gave an additional set of safety-relevant RLHF prompts and a rule-based reward model (RBRM). They also used deployment-time safety techniques that monitor for abuse.

## Risks and Mitigations
The report claims that OpenAI put in a lot of effort to improve the safety and alignment of GPT-4 and used a varierty of techniques such as..

1. **Adversarial testing via domain experts** - they engaged 50 experts from various domains (long-term AI alignment risks, cybersecurity, biorisk etc.) to adversarially test the model. The model was improved using the recommendations and training data from these experts, for example, to refuse requests on how to synthesize dangerous chemicals.

2. **Model-assisted safety pipelines** - despite RLHF, the model could exhibit undesired behaviors on safe and unsafe inputs (eg: advising on committing crimes). This could arise due to underspecified instructions given to labelers during the reward model data collection process in RLHF. This was resolved in GPT-4 using an additional set of safety-relevant RLHF prompts and **Rule-Based Reward Models (RBRMs)**. RBRMs are a set of zero-shot classifiers that provide an additional reward signal to the model for correct behaviors. It takes three inputs 1) a prompt, 2) the model's output and 3) a human-written rubric that defines how the output should be evaluated. A rubric is a set of rules in multiple-choice style - it instructs the model to classify the output in one of those categories (eg: refusal in a desired style, refusal in an undesired style, safe non-refusal response).tructs the model to classify the output in one of those cateogories (eg: refusal in a desired style, refusal in undesired style, safe non-refusal response).

These safety and alignment techniques have improved the safety metrics of GPT-4 significantly compared to GPT-3.5 For example, it reduced the model's tendency to respond to requests for disallowed content like medical advice and self-harm by 82% compared to GPT-3.5.

## Conclusion
GPT-4 significantly outperforms existing LLMs and a vast majority of state-of-the-art systems on a wide range of tasks. It has a huge potential to influence human society in good ways as well as harmful ways, which is a big risk. OpenAI has taken a series of measures to improve its safety and alignment.

OpenAI has also open-sourced the [OpenAI Evals](https://github.com/openai/evals), a framework to evaluate OpenAI models and an open-source registry of benchmarks. You can use Evals to create and run evaluations that use datasets to generate prompts, measure the quality of completions and compare performance across different models.

However, all of this is only the beginning, there is a lot more work to be done. The AI community should continue to understand, assess and mitigate the safety risks of these models.