---
toc: true
layout: post
description: Something seemingly simple to implement becomes the most annoying thing to implement ever.
categories: [frontend, gatsby]
title: The Quest for a cool header design
comments: true
---

When I first came up with the idea to highlight the current page with a rounded box, it sounded really easy to implement. I even decided to go really simple and make it just invert the background. So in `light` mode, it would be a black box which had white text insde, and the opposite for dark mode. What could go wrong?

> everything.

Lets go through some of the blood sweat and tears I went through so you don't have to go through the same!

# Inverting Colors

Essentially, I saw this css-tricks article about [contrasting text backgrounds](https://css-tricks.com/methods-contrasting-text-backgrounds/) which involved using the `mix-blend-mode: difference;` CSS on the foreground so that it would invert its background. This would work flawlessly for the dark background with white foreground, and its also the example they gave in this article:

```css
header {
  background: url(black-and-white-image.jpg);
}

h2 {
  color: white;
  mix-blend-mode: difference;
}
```

However, try to do it for the opposite case and things come crashing down.

## Try 1: backdrop-filter

I initially tried using this CSS, which applies a filter to the background of this image - this is actually how I have blurred everything when a user clicks the sandwich menu in mobile view. When combined with `contrast(2)` I was able to get commendable results on chrome. However, as soon as I tried using the website with firefox, the backdrop filter was no where to be found! This is because Mozilla Firefox have [hidden the feature behind an experimental flag](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)...

## Try 2: back to mix-blend-mode

So I went back to the original method, and decided on figuring out how to have this inverted color idea work for both light and dark modes. Essentially, I've found that I need to do the following things:

- color the text normally
- color the inverting div **white**, with `mix-blend-mode: difference`
- **wrap everything in a div which provides the colors:**
  - `background: var(--color-background)`
  - `color: var(--color-text)`
  - transitions to make toggling the color easier on the eye

These things in **bold** took me very long to figure out~

Especially the **div that provides colors**, you can't apply the color to the body, it needs to be in a div you style, or else in Chrome it results in the `mix-blend-mode` failing, BUT IT WORKS FINE IN FIREFOX!!

So many times, it would either only work in chrome, only work in firefox, only dark mode works, only light mode works. Shout out to my [friend](https://atharvdamle.com/) who provided me support in my darkest moments, he was the one to suggesting making the inverting div **white**, very smart guy.

In code, here is a watered down example consisting only the color variables required to pull off this effect (note that `Underline` should have absolute position and overlap with the text in `StyledLink`):

```jsx
// styles
const ColorProvider = styled.div`
  background: var(--color-background);
  color: var(--color-text);
  transition: all 0.25s linear;
`;

const Underline = styled(motion.div)`
  mix-blend-mode: difference;
  background-color: white;
`;

const StyledLink = styled(Link)`
  color: var(--color-text);
`;

// code
<ColorProvider>
  <Underline />
  <StyledLink>Home</StyledLink>
</ColorProvider>;
```

# FOUC

Flash of Unstyled Content is a prominent problem in Gatsby, as part of the reason why it can serve content so fast is because it prebuilds all the html. Because it can serve the html so fast, more often than not, the html loads first before CSS styles are loaded in, resulting in blank white unstyled content flickering before the styles load in. I did not like this.

## Try 1 - Maybe Material-ui?

I was using `material-ui` as its my goto web-ui toolkit. However, I nearly considered giving up this toolkit while making this website. It appeared that whenever I used their `themeProvider`, it would completely break my styles, display a FOUC, and transitions applied to the body did not apply to any `material-ui` components.

However, I soon learnt that I was mistaken, as I had followed the documentation for `material-ui` blindly, and used the `<CssBaseline />` component because they used it. Short answer - this will screw up the original css in the page. This was particularly bad for my case, as I needed to define the themes with css variables or else a FOUC would occur on every page load as Gatsby would not know about the style.

However, even without `<CssBaseline />`, things were still going sour, FOUC was showing, I was still awake at 2am trying to fix this.

## Try 2 - styled(components)

TURNS OUT: I've been applying global styles through a component `createGlobalStyle` from `'styled-components'`. This applied a style to the body which set the `background-color` and `color`. It doesn't seem to work immediately on page load, resulting in a flash of white in dark mode, before a transition to the proper color. So now, I create my own div styled with in-line CSS defining those color css variables. The result works like a charm!

```jsx
const ColorProvider = styled.div`
  background: var(--color-background);
  color: var(--color-text);
  transition: all 0.25s linear;
`;

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <ColorProvider>
        <Header />
        {children}
        <Footer />
      </ColorProvider>
    </>
  );
};
```

This is only the stuff I remembered that I fixed, there was so much trial and error, and me reloading the site 100 times, that I've probably forgotten half of the stuff I tried to do to fix these problems I had.
