+++
title = "Cloudflare AutoRAG: RAG on auto-pilot"
description = "Build a RAG Pipeline with Cloudflare AutoRAG — No Infrastructure Needed"
date = "2025-05-23T17:54:13-07:00"
draft = false
tags = ["ai", "llm", "how-to", "cloudflare"]
topics = ["rag"]
+++

We know that RAG (Retrieval Augmented Generation) is a reliable mechanism to augment LLMs with up-to-date data and ground them on facts relevant to the context of the user query, thereby reducing hallucination. When set up properly, it works pretty well. Companies like Perplexity AI and enterprise applications use RAG extensively. 

However, building a RAG pipeline on your own from scratch can be complex and high maintenance. You need to assemble your data sources, chunk the data, index it, generate embeddings, and store them in a vector database. At inference time, you need to generate an embedding of the user query using an embedding model, retrieve the relevant data from the indexed store and return a meaningful context-aware response to the user. On top of that, any change in the data source means that you need to re-index the data, re-generate embeddings, and update the store. Rinse and repeat.

Now with AutoRAG - Cloudflare's fully managed end-to-end RAG pipeline, almost all of this complexity disappears. All you need to do is gather the right data and upload it to a Cloudflare R2 bucket (equivalent of Amazon S3) and AutoRAG takes care of the rest. It handles data chunking, indexes them and stores the embeddings in a globally distributed vector database ([Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)). During inference with a user query, it retrieves relevant data using semantic search and generates responses using any of the ML models hosted on Cloudflare servers ([Worker AI](https://developers.cloudflare.com/workers-ai/)).

## Intro to AutoRAG

**AutoRAG** is Cloudflare's fully-managed solution for building RAG (Retrieval Augmented Generation) pipelines that provide accurate and up-to-date information to your LLM applications without dealing with the hassles of managing infrastructure on your own. It simplifies the RAG process by doing a few specific things:
- indexes and updates your data source **continuously and automatically** 
- exposes the AutoRAG instance via the familiar **Worker binding** [syntax](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/)
- provides **multitenancy** that allows data segmentation based on customer, user or workspace to support

This is a brand-new release, announced just a few days ago at [Cloudflare's 2025 Developer Week](https://www.cloudflare.com/developer-week-2025/updates/).

## How to set up AutoRAG with your own data
Setting up AutoRAG with your custom data is easy. I tried it with my blog posts as the data source and it worked out pretty well. Let's walk through this step by step.

### Step 1: Prepare your data
Upload your data to Cloudflare R2, the S3-compatible data storage solution with zero egress free. It offers free storage up to 10 GB/month and then $0.015 per additional GB/month. If you don't have an account, you can create one - you won’t be charged until you exceed the free tier.

The data can be plain text files, config files, source code, PDF, images, CSV files and more. See the [full list of supported files and size limits](https://developers.cloudflare.com/autorag/configuration/data-source/).

I simply created a new R2 bucket and selected the option *Select from computer* -> *Folders* and selected the top folder of my blog content. It had md files, images, text files etc. and that's just fine, no need to filter out any files.

{{< fluid_imgs
  "pure-u-1 pure-u-md-1-3|autorag-r2-bucket-empty.png|R2 bucket - new"
  "pure-u-1 pure-u-md-1-3|autorag-r2-bucket-select-files.png|R2 bucket - select files"
  "pure-u-1 pure-u-md-1-3|autorag-r2-bucket-files-uploaded.png|R2 bucket - files uploaded"
>}}

### Step 2: Create an AutoRAG
Go to [Cloudflare dashboard](https://dash.cloudflare.com/), login with your account and go to **AI** -> **AutoRAG**. Click **Create AutoRAG** button. Select the data source you created in the previous step or any other data source available. Go through the workflow and select the configurations (the default config is good enough for the first iteration).

At the end of this step, your RAG will be created. Now Cloudflare will start indexing the documents you uploaded and they will be marked as *Queued*. This will take a few minutes, so be patient.

{{< fluid_imgs
  "pure-u-1 pure-u-md-1-2|autorag-create-new.png|Create new AutoRAG"
  "pure-u-1 pure-u-md-1-2|autorag-create-select-datasource.png|Select datasource"
>}}

{{< fluid_imgs
  "pure-u-1 pure-u-md-1-2|autorag-create-configure.png|Select configurations"
  "pure-u-1 pure-u-md-1-2|autorag-create-select-name.png|Select the name for the RAG"
>}}

### Step 3: Wait for AutoRAG to index Your data
As the indexing process continues, the status of the document will change to *Success* or *Completed* depending on the result of indexing. When all the docs are indexed, the top level status of the RAG will change to *Ready*.

In my attempts so far, the only time the indexing failed was when I uploaded a file above the size limit or when I uploaded an unsupported file (eg: the GIMP file for an image). I had around 85 files and it took around 5 minutes. Now the fun starts!

{{< fluid_imgs
  "pure-u-1 pure-u-md-1-3|autorag-indexing-queued.png|Indexing - queued"
  "pure-u-1 pure-u-md-1-3|autorag-indexing-completed.png|Indexing - completed"
  "pure-u-1 pure-u-md-1-3|autorag-indexing-errored.png|Indexing - errored"
>}}

### Step 4: Try out your new AutoRAG (no code)
You can do this in the AutoRAG playground by going to the *Playground* tab in your RAG page. Here you will see two options - *Search* and *Search with AI*.
- **Search** - a standard document search that returns links relevant to the user query, similar to classic Google-style results (aka the ‘10 blue links’ experience)

- **Search with AI** - this is the newer LLM-style search result that shows a concise summarized response that answers the user question. In addition to this summary, it shows the citations - the link to the documents where that information is present. It rewrites the user query to be more relevant to an LLM.

You can run the query with any of the models that are available on Cloudflare and listed in the Playground settings panel on the right (eg: Llama 3.3 70B, Llama 3.1 8B etc.). Select the model of your choice.

I tried multiple queries in my RAG and all of them returned accurate response with correct citations. See a few examples below:

{{< fluid_imgs
  "pure-u-1 pure-u-md-1-2|autorag-inference-search.png|Inference - Search"
  "pure-u-1 pure-u-md-1-2|autorag-inference-search-with-ai-1.png|Inference - Search with AI"
>}}

{{< fluid_imgs
  "pure-u-1|autorag-inference-search-with-ai-2.png|Inference - Search main takes"
>}}

### Step 5: Add this RAG to your application.
You can access this RAG by creating a binding in your worker config and refer to it in your application code.

In your wrangler config file, you define the binding for AI.
``` json
// File: wrangler.jsonrc
{
  "ai": {
    "binding": "AI"
  }
}
```

Then in your application code, call the aiSearch API on the AI binding.
``` js
// File: index.js
const response = await env.AI.autorag("ann-blog-rag").aiSearch({
  query: "main takes on web development",
  model: "@cf/meta/llama-3.3-70b-instruct-sd",
  ranking_options: {
    score_threshold: 0.3,
  },
  stream: true,
});
```

## Look under the hood
AutoRAG connects the tools required to index the data, retrieve the relevant context and generate the response for the user query. It keeps the data in sync behind the scenes and responds to the query in real time.

This involves two main processes - **indexing**  and **querying**.

### Indexing
This is the background (asynchronous) process that converts your data into vectors, monitors your data source for changes and automatically updates them when there are changes.

During this process, AutoRAG converts all the data into markdown format in order to ensure consistency across all file types. Interestingly, it also converts images to Markdown text. The extracted text is chunked to smaller pieces, each chunk is embedded (transformed into vectors) using an embedding model and stored in an instance of the Vectorize database.

### Querying
This is the synchronous process triggered by user queries. It retrieves the most relevant content and generates context-aware responses.

The process starts when a request is sent to AutoRAG through either the AI Search or Search options. Optionally, the input query can be rewritten using a Workers AI language model to enhance retrieval quality. Then, the question is turned into a vector using the same model as the one used for the stored data. The system finds the most relevant information by matching this vector against the Vectorize database and pulls the actual content from R2 storage. If regular search is used, this content is sent as a response to the user. If AI Search is used, the retrieved content and the query (original or rewritten) is fed into an LLM to generate a helpful concise answer.

## Cost and Availability
AutoRAG is free to use during its open beta and is available on all Cloudflare plans - both free and paid. It runs on top of other Cloudflare services like R2, Workers AI, Vectorize and AI Gateway, each with its own pricing and usage limits. However, all of these services offer a reasonable free tier, so you will be charged only if you exceed the monthly limits. 

See the full details at [Cloudflare AutoRAG Pricing](https://developers.cloudflare.com/autorag/platform/limits-pricing/).

For reference, everything mentioned in this post was done using the free tiers - I didn’t pay anything.

## Overall impressions
All in all, I love AutoRAG - it is easy to use and powerful. It was amazing how quickly I could set up a semantic search for my blog content with hardly any effort. It will be fun to integrate this into my blog website and front it with a simple search UI - 'my own' RAG implementation 😎.

I was also impressed that Cloudflare has masterfully combined the best of their technologies to build something really powerful. This includes the following:

- [Cloudflare R2](https://developers.cloudflare.com/r2/) - R2 is the S3-compatible data storage solution from Cloudflare with zero egress fees
- [Workers AI](https://developers.cloudflare.com/workers-ai/) - The serverless infrastructure to run AI models on Cloudflare's globally distributed network
- [Vectorize](https://developers.cloudflare.com/vectorize/) - The vector database that is distributed globally and makes querying for embeddings fast, easy and affordable.
- [AI Gateway](https://developers.cloudflare.com/ai-gateway/) - Provides analytics, metrics and caching of your AI applications so that you can monitor all the requests made on any of the services

## A final thought

I've been using various Cloudflare products for a while now and found them to be solid and reliable, but some of them were not beginner-friendly. I remember struggling with the R2 storage API when building a photo gallery for the first time. The compatibility with S3 API made it powerful, but it made the learning curve steeper than I expected.

But AutoRAG feels different - it is polished, intuitive and just works from the get go. It took me just a few minutes to set up a RAG pipeline with my blog content and start running queries in the playground. The documentation was clear and detailed. It’s clear that Cloudflare is now prioritizing developer experience in addition to its focus on reliability. That's awesome ❤️.

## References
- [Cloudflare's announcement of AutoRAG](https://blog.cloudflare.com/introducing-autorag-on-cloudflare/)
- [AutoRAG documentation](https://developers.cloudflare.com/autorag/)
- [Good video - First look at AutoRAG](https://www.youtube.com/watch?v=JUFdbkiDN2U)