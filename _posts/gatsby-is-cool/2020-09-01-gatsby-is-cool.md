---
toc: true
layout: post
description: Here is explore some of the cool plugins Gatsy has to offer, which have been used to build this blog
categories: [gatsby, frontend, javascript]
title: Gatsby has a lot of cool plugins
comments: true
---

You may have realised that the codeblocks on this blog look really nice...

```python
import string
charset = '' + string.ascii_letters + string.punctuation + string.digits

def generatePassword(index: int):
    current = index
    result = []
    while True:
        remainder = current % len(charset)
        result.append(charset[remainder])
        current = current // len(charset)
    return ''.join(result)
```

Believe it or not, all the blog posts on this page are formatted from a markdown file!

## gatsby-remark-highlight-code

This is what is used to get those really nice looking code outputs. More information including installation can be found [here](https://www.gatsbyjs.com/plugins/gatsby-remark-highlight-code/).

## gatsby-remark-katex

This lets me write latex in markdown!! It can be inline like $a^2+b^2=c^2$, or it can be in full size mode like so:

$$
\begin{aligned}
I  &= \int_{a}^{b} \frac{f(x)}{g(x)} dx \\
\therefore I &= \int_{a}^{b} \frac{f(x)}{f'(x)} \frac{f'(x)}{g(x)} dx
\end{aligned}
$$

One interesting point is that some environments I'm used to using like `\begin{align*} \end{align*)` are unavailable. Here is [a list](https://katex.org/docs/supported.html#environments) of supported latex environments and other commands you can use with $K^AT_EX$.
More information [here](https://www.gatsbyjs.com/plugins/gatsby-remark-katex).

## Future

### mdx

This is something created with Gatsby in mind, a fusion between Markdown `md` and `jsx`, allowing for importing code inside a markdown file for extra utility.

There are some amazing things you can do with it right now, such as [Gatsby Theme Waves](https://www.gatsbyjs.com/plugins/gatsby-theme-waves/), which lets you tell a story by animating changes in code blocks, powerpoints and graphs. A super cool tool, but I just got `remark` to work, so I will probably implement this later when there are more packages I want that require mdx.

To install `mdx`, you may find these links helpful:

- [Gatsby - How to convert an existing Gatsby blog to use MDX](https://www.gatsbyjs.com/blog/2019-11-21-how-to-convert-an-existing-gatsby-blog-to-use-mdx/)
- [Typescript typings](https://mdxjs.com/advanced/typescript)
