+++
date = "2016-09-24T07:49:00-07:00"
draft = false
title = "Display mathematical expressions in blog"
tags = ["how-to"]
topics = ["machine-learning","hugo"]
+++

As part of my Machine Learning course, I learned a useful trick which I will share hoping that it may help someone or I myself can refer to it later. The problem at hand was how to display the mathematical expressions that calculate cost function, gradient descent etc. in a blog or web page. In OneNote, you can do it using [OneNote Equation tool](https://support.office.com/en-us/article/Insert-a-mathematical-equation-in-OneNote-2016-for-Mac-08969f84-ed02-4baf-8a77-7ab3c1e26afe) earlier, but I wanted to do the same in my blog posts. After trying many options, here is what worked for me.

First of all, I had to find a good JavaScript library that can display mathematical expressions described in a LaTeX-style syntax in the HTML (or Markdown) source of a web page. It turns out that the best such library is [MathJax](http://www.mathjax.org/). It produces high quality typesetting that scales to full resolution which renders beautifully on the web page. More importantly, it uses web-based fonts, so the person who views the HTML page does not have to install any plugin to view those equations. MathJax is very easy to use, you just include a script tag in the HTML to load the JavaScript from a CDN, configure your preferences and start writing mathematical expressions in your content. Here are the detailed steps on [how to get started with MathJax](https://docs.mathjax.org/en/latest/).

Then my question was how do I use it with my blog engine [Hugo](https://gohugo.io/). With a quick Googling, I found this good article [MathJax Support](https://gohugo.io/tutorials/mathjax/) on Hugo site itself. Lovely! It turns out that writing mathematical expressions is a very popular requirement. The instructions are easy to follow and I could set it up in a few minutes. One thing I realized is that in order to show inline style mathematics, MathJax uses the syntax of a single backslash followed by parentheses. But in Hugo, I have to use double backslash followed by parentheses. If you are using any other blog engine like Tumblr, TypePad, Weebly etc., [check out this article](http://checkmyworking.com/2012/01/how-to-get-beautifully-typeset-maths-on-your-blog).

So now, my blog is ready to display mathemtical expressions. Here is a sample expression of quadratic equation that shows both inline and display expressions:

When $a \ne 0$, there are two solutions to \\(ax^2 + bx + c = 0\\) and they are as follows:
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}$$