---
title: Multiple blog types in Gatsby
date: 2020-09-06T19:36:39.292995
description: 'How I configured blogs and project pages written in markdown to show on their respective pages'
tags: ['gatsby']
---

`graphql` is was very confusing for me to use at first, but with the `___graphql` tool available during `gatsby develop`, I found that I could quickly learn how it works as I used it more and more. One of the issues I came across lately was trying to maintain two different markdown folders for blogs and projects respectively.

From my research, I found another guide on how to do this, but their guide was for gatsby version 1, and I found that the requirement of providing metadata for project markdown files was a bit redundant, as you will see below. So here is my guide for creating a projects folder for your project markdown files to be serve on gatsby.

# Criteria

- You are using a set up similar to the the [gatsby starter blog](https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog/).
- You want a file structure like this

```
src
├── content
│   ├── blog
│   │   ├── blog1
│   │   │   └── index.md
│   │   └── blog2
│   │       └── index.md
│   └── projects
│       ├── project1
│       │   └── index.md
│       └── project2
│           └── index.md
└── src
    └── templates
        ├── BlogPost.tsx
        └── ProjectPost.tsx
```

Thats it! (nothing redundant like requiring a field to be added to each projects' `index.md`...)

# Setting up Gatsby

In `gatsby-config.js`, add the following code in the plugins array:

```js
  plugins: [
    ...
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/projects`,
        name: `projects`,
      },
    },
    ...
  ]
```

Next, in `gatsby-node.js`, we don't need to change the graphql query at all! Instead, we need to conditionally create pages and nodes based on the path to the markdown files!

Assuming your graphql takes the `fileAbsolutePath` field from `allMarkdownRemark / edges / nodes` like so:

```js
const result = await graphql(
  `
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
            }
            fileAbsolutePath
            frontmatter {
              title
              tags
            }
          }
        }
      }
    }
  `,
);
```

Then we can simply check this property to figure out whether to render this as a blog post or as a project post!

```jsx
exports.createPages = async ({ graphql, actions }) => {
  const blogPost = path.resolve(`./src/templates/BlogPost.tsx`);
  const tagPage = path.resolve(`./src/templates/TagsPage.tsx`);
  const projectPost = path.resolve(`./src/templates/ProjectPost.tsx`);

  /* graphql query from above goes here */

  if (result.errors) {
    throw result.errors;
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges;

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;

    createPage({
      path: post.node.fields.slug,
      component: /blog/.test(post.node.fileAbsolutePath)
        ? blogPost
        : projectPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    });
  });
};
```

Finally, to ensure slugs get properly created, we need to use `createFilePath` to create the slugs for the above command conditionally like so:

```js
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value: `/${
        /blog/.test(node.fileAbsolutePath) ? 'blog' : 'projects'
      }${value}`,
    });
  }
```

## Hooking up the frontend

This is most of the "backend" work done, and the rest of the work consists of using this data. You can probably reuse the code examples given in the first resource I have linked below, or check out the [source code for this blog you're reading right now](https://github.com/xpire/website/tree/master/src/templates). The harder part in my opinion was knowing how to use the absolute path in graphql in the page creation phase, as I really disliked having to label the `projects` markdown pages with an explicit field when I have already put it in its own folder.

## Resources

- [building gatsby with multiple post types](https://desktopofsamuel.com/building-gatsby-with-multiple-post-type)
- [making multiple content types in gatsby](https://chipcullen.com/making-multiple-content-types-in-gatsby/)
