+++
title = "The Apple of AI"
description = "Apple Intelligence: Highlights from Apple WWDC24"
date = "2024-06-11T20:14:23-07:00"
draft = false
tags = ["ai", "tech-explorations", "generative-ai", "llm"]
topics = []
+++

The standout feature unveiled at this week's Apple WWDC 2024 event was [Apple Intelligence](https://www.apple.com/newsroom/2024/06/introducing-apple-intelligence-for-iphone-ipad-and-mac/), a personal intelligence system that will be integrated into multiple platforms - iOS 18, iPadOS 18 and macOS Sequoia. 

## What is Apple Intelligence?
Apple Intelligence comprises of multiple highly-capable and efficient generative models - large language models and diffusion models. These models include on-device models as well as server-based foundation models. 

The foundation models are trained on [Apple's open-source AXLearn library](https://github.com/apple/axlearn) for deep learning, built on top of [JAX](https://jax.readthedocs.io/en/latest/) (Python library for accelerated computing and transformation) and [XLA](https://www.tensorflow.org/xla) (Accelerated Linear Algebra, an open-source ML compiler). The branding of Apple Intelligence is intriguing, positioning it as Apple's take on "AI". 

Apple Intelligence looks very promising and stands out as unique in four distinct ways....

### 1. On-device AI

Apple Intelligence has a 3 billion parameter language model that **runs on the user's device** - phone, tablet or macOS - performing local inference without collecting data or sending it over the network to remote servers. This model was compressed using low-bit palletization maintaining high quality using a framework that uses LoRA adapters and implements a quantization strategy at just 3.5 bits per weight. This optimization enabled Apple to run these models on an iPhone 15 with high accuracy and speed. 

This is a huge leap forward, promising secure, low latency inferences directly on the device. Can't wait to see this capability made available to app developers. Incredible! 💪

### 2. Privacy-first design

The new system is built using a **privacy-first design** in multiple ways. First, the on-device model handles the simple operations securely using user's personal context such as messages, emails and notes, ensuring that everything remains on the device itself, without leaving the device. 

For more complex operations beyond the device's capabilities, tasks are routed to the server-based larger language models running on Apple's [Private Compute Cloud](https://security.apple.com/blog/private-cloud-compute/), leveraging secure trustworthy hardware in Apple's own data centers. 

If the task requires broader world knowledge not available in either of the Apple foundational models, it routes the request to [GPT-4o](https://openai.com/index/hello-gpt-4o/) OpenAI's latest flagship model, always with explicit permission from the user.

This seamless flexibility between on-device and server-based processing strikes an optimal balance between performance and privacy. Fantastic! 🎉

### 3. Security & Performance

The machines in the Private Cloud Compute (PCC) are **hardened with security measures** to ensure that user's data is not tampered with and is not stored anywhere any time. For instance, the software that runs on these machines are stateless, as in the server/node is rekeyed and wiped clean after every reboot. The user's data is not persisted anywhere, even in the event of errors. All the metrics and the transparency logs of the software running on PCC will be made publicly available for independent security researchers to verify. For a detailed assessment of this approach, read [this thread by a security expert at Johns Hopkins](https://x.com/matthew_d_green/status/1800291897245835616).

The two language models from Apple (3B on-device and the server-based model) were **benchmarked against various language models** - open-source models (Gemma-2B, Gemma-7B, Phi-3-mini, and Mistral-7B) as well as commercial models (DBRX-Instruct, GPT 3.5 Turbo, and Mixtral 8x-22B). They outperformed or matched the performance of these models in human evaluation, safety and helpfulness. See the details of the benchmarks in the [Apple research blog](https://machinelearning.apple.com/research/introducing-apple-foundation-models).

### 4. Ubiquitious AI

Apple will integrate this new system **across their ecosystem** - spanning multiple devices (iPhones, iPads and macOS) and integrating with various applications (Notes, Messages, Mail, Pages and more). 

Text generation system is utilized in Writing Tools, a subsystem designed for summarizing, editing and rewriting text content. It also implements more language features such as transcribing notes and prioritizing notifications based on content.

Image generation capabilities will be leveraged in two areas - Genmoji to generate emojis from simple text in three artistic styles and the Image playground to create images based on the surrounding content. Fun fact - the keynote session talked about Genmoji without ever mentioning generative AI 🙃.

## And one more thing...
Finally, a special mention to Siri - Apple declared that 'Siri enters a new era' where Siri will be integrared deeply into the system with richer language understanding, smarter and more contextually relevant - going far beyond setting an alarm. You can chat with Siri through text as well. Another fun fact - the task demonstrated with Siri during the keynote was ‘set an alarm for 10am.’. 😎

Yes I understand that the revamped Siri could become a big deal (and not just a minor thing), but I'll need to see it in action to believe it.

## In conclusion
Well, all said and done, the proof is in the pudding. The real results are yet to be seen when these capabilites will come to life later in the fall. Until then, we wait and watch....

In the meantime, I am eager to hear more about the following in Apple Intelligence - when will they be available for prime time use?
* When will the coding model be integrated into Xcode to enhance developer productivity?
* What are the plans for integrating audio and video capabilities into Apple Intelligence?
* How critical will text-to-speech functionality be for enhancing Siri's capabilities?

Looking forward to hearing more updates on these exciting developments! 😎
