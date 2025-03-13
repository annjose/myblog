+++
title = "How to finetune an LLM with unsloth"
description = "Step by step guide to finetune an LLM with unsloth"
date = "2025-03-13T14:22:15-07:00"
draft = true
tags = ["AI", "LLM"]
topics = ["tech-explorations"]
+++

Outline:
* Unsloth is a library that makes finetuning faster and use less memory
* It can finetune models with large context windows using large context datasets
* It is a Python library that works with Hugging Face Transformers library
* How to install unsloth
  * pip install unsloth
  better to do it through uv
* Use the Google Colab notebook
* Run finetuning on local machine (in this case, I am using a GeForce RTX 2070 with only 8GB of memory)