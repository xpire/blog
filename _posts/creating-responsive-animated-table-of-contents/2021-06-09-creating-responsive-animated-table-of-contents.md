---
toc: true
layout: post
description: How I decided to build a TOC from scratch with jekyll
categories: [css,jekyll,javascript,frontend,markdown]
title: Creating Responsive Animated Table of Contents
comments: true
---

Hello! If you are reading this sentence, the Table of Contents (TOC) will be right above this sentence if you are on mobile, or if you are using a computer, it will be to the right of this text! If you scroll a bit, click on some of the links, you'll find that the TOC is sticky, animated and just straight up looks so sick. Today I'll talk about my process in getting this to work~

# Inspiration

I've always been a fan of those animated Table of Contents I've seen in many blogs before ([joshwcomeau.com](https://www.joshwcomeau.com/react/dark-mode/), [material-ui.com](https://material-ui.com/components/text-fields/), just to name a few). I had recently built this blog using [fastpages](https://fastpages.fast.ai/), and one of the benefits was a fully bootstrapped frontend that allowed you to use Markdown, word and jupyter notebooks as blog sources. I had resigned to the fact that I wouldn't have to make much changes to the UI as I wanted to get the website up and running quickly, but then I came across the following Jekyll website: [huangxuan.me](https://huangxuan.me/2015/05/25/js-module-loader/). I was amazed, there was a Jekyll blog that had this amazing Table of Contents code implemented and it was actually possible! I finally had the confidence to try recreate this effect in my own blog.


![]({{ site.baseurl }}/images/huangxuan.me.png "huangxuan's website")

# How it works

The custom TOC is made up of 3 major parts: the HTML, CSS and javascript. I'll go through each briefly before deep diving into the journey and decisions.

## HTML

The HTML changes are actually really small, and only required [splitting the TOC and content](https://github.com/toshimaru/jekyll-toc#advanced-usage) like so:

```html
  <div class="main">
    <nav class="post-nav post-content">
      {\%\ toc \%\}
    </nav>
    <div class="post-main post-content e-content" itemprop="articleBody">
     {\{\ content \}\}
    </div>
  </div>
```

{% include info.html text="I've had to escape the special characters to prevent accidental html injection into the example." %}

## CSS

New CSS code can be injected into the `_sass/minima/` folder so I created a new file there thats imported into the `_sass/minima/custom-styles.scss` file. This new file contains the following CSS:

```scss
// smooth scrolling
html {
	scroll-behavior: smooth;
}
// transistion
.post-nav a {
    transition: all 100ms ease-in-out;
}
// hide bullet points
.post-nav ul {
    list-style: none;
}
// allow transitions to apply individually
.post-nav li > a {
    display: inline-block;
}
```

A lot of this code came from a guide I was following by [bram.us](https://www.bram.us/2020/01/10/smooth-scrolling-sticky-scrollspy-navigation/). The comments explain whats going on. The cool thing is with the way we've designed the HTML is that the behaviour of the TOC is mobile first. The following code controls what happens when a device is wide enough to fit the sticky animated TOC:

```scss
@media screen and (min-width: 1200px) {
    // format grid with nav next to it
    .main {
        display: grid;
        grid-template-columns: 70% auto;
        grid-template-rows: auto;
        grid-template-areas: "post-main post-nav";
    }

    .post-main {
        grid-area: post-main;
    }

    .post-nav {
        grid-area: post-nav;
        // makes nav sticky
        position: sticky;
        top: 2rem;
        align-self: start;
    }

    // only show active CSS if large screen
    .post-nav li.active > a {
        color: $high-emph;
        font-weight: 500;
        transform: translateX(5px);
    }
}
```

I tried a lot of things, but it was `display: grid` that ended up working the best. I tried `display: flex` first, but that screwed up the max width of the blog itself, and I ran into so many issues just getting this column split to function as expected. The most powerful part of this design is the fact that I'm able to use the same TOC for both mobile and desktop displays! 

It was also pretty easy to make the TOC sticky, and the final CSS applies the visual effect when the active class is present. Now for the javascript to wire everything up correctly.

## JS

Jekyll lets you inject javascript into the document with an include statement, which references a javascript script in the `_includes` folder. The main problem I was facing that didn't occur with bram.us's code, was that his code was designed so that all the titles and it's contents were wrapped in sections, so he only needed to keep track of whether a section was intersecting the screen to highlight that TOC element. For my output, there was no such design, and as soon as the Heading was out of view, the TOC element for that heading would also stop highlighting, which was a problem. However, google came to the rescue, as I found an amazing blog: [tj.ie](https://tj.ie/building-a-table-of-contents-with-the-intersection-observer-api/). I have to really thank him for writing an awesome blog on how he solved the exact problem I was having. 

```js
<!-- this handles current visible status in toc-->
<script>
window.addEventListener('DOMContentLoaded', () => {
    
  let previousSection = null;
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.intersectionRatio > 0) {
        document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add('is-visible');
        previousSection = id;
        // console.log(`previousSection set to ${previousSection}`)
      } else {
        document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove('is-visible');
      }
    });
    
    let firstVisibleLink = document.querySelector('.is-visible > a').getAttribute('href');
    
    // console.log(`firstVisible: ${firstVisibleLink}`)
    // console.log(`previousSection: ${previousSection}`)
  
    document.querySelectorAll('.active').forEach(elem => elem.classList.remove('active'))
  
    if (firstVisibleLink) {
      document.querySelector(`.is-visible > a[href="${firstVisibleLink}"]`).parentElement.classList.add('active')
      // console.log(`firstVisible should be active`)
    }
  
    if (!firstVisibleLink && previousSection) {
      document.querySelector(
        `a[href="#${previousSection}"]`
      ).parentElement.classList.add('active')
      // console.log(`previousSection should be active`)

    }
  });
  
  // Track all sections that have an `id` applied
  document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach((section) => {
    observer.observe(section);
  });

});
</script>
```

The solution involved storing a global variable `previousSection`, which kept track of the previously highlighed section. Thus, when an Observer updated and all headings were out of sight after scrolling a bit, the code would know that we are still in the previous section and keep that TOC heading highlighted. Please read the blog for more information.

# Conclusion

I'm just writing a more lines so the TOC can be truly showcased XD

But I'm very happy with the overall result, and if there was one improvement I could make, it would be to emulate the amazing animated highlighting line in this concept by [lab.hakim.se](https://lab.hakim.se/progress-nav/).

# References

- [huangxuan.me](https://huangxuan.me/2015/05/25/js-module-loader/)
- [bram.us](https://www.bram.us/2020/01/10/smooth-scrolling-sticky-scrollspy-navigation/)
- [tj.ie](https://tj.ie/building-a-table-of-contents-with-the-intersection-observer-api/)