+++
date = "2016-09-24T07:26:19-07:00"
draft = true
title = "Math symbols test (Draft)"
+++

This page is deliberately kept as a draft in order to test the rendering of Latex content.

### Equations
The equation \\(ax^2 + bx + c = 0\\) has two solutions when $a \ne 0$, or \\(a \ne 0\\): 
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}$$

### Text formatting
- Text Color - with orange $\color{orange} ax + by = c$, lightgreen $\color{lightgreen} ax + by = c$, plum $\color{plum} ax + by = c$  - [all named colors](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color)
- Font-size (large, huge, small, tiny) - $abc$, $\large abc$, $\Large abc$, $\LARGE abc$, $\huge abc$, $\Huge abc$, $\small abc$, $\frac a b$, $\large \frac a b$, $\huge \frac a b$
- Font in fractions - In a regular polygon,  $\displaystyle\frac{180*(n-2)}{n}$  Syntax: `$\displaystyle\frac{180*(n-2)}{n}$`
- Spacing inside text $a + b ~~~~~~~~=~~~~~~~~ 21$

### Probability
- Given `n` objects taken `r` at a time, number of permutations = $_nP_r = P(n,r) = \large \frac{n!}{(n-r)!}$

### Logarithms
* $log_b(x) = y$  means that $b^y = x$. `$log_b(x) = y$` means that `$b^y = x$`.
* $log(N)$ = y and $2^{y+1}$ = $2^y * 2$ means that  - when $2^{y}$ changes to $2^{y+1}$,  log(N) ==>  log(N+1)

### Miscellaneous

* **square root, exponents** - example of Not polynomials - $\sqrt x$, $x ^ {-2}$, $m ^ {-1/2}$  . Syntax: `$\sqrt x$, $x ^ {-2}$, $m ^ {-1/2}$`
- **element of, union, open/closed parentheses** - if intervals overlap, `x > 3 OR x <= 5` = $x \in (3, \infty) \cup (- \infty, 5]$ => $x \in (-\infty, \infty)$ => $-\infty < x < \infty$
* **Line segments** - Above the text arrow $\overrightarrow {AB}$ and a line segment $\overline {AB}$