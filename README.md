# uiuiqkjn.github.io

This repository keeps the Hexo blog source and the published GitHub Pages output on separate branches.

## Branches

- `source`: Hexo source backup. Edit posts, theme config, and project files here.
- `main`: generated static site published by `hexo deploy`.

## Daily Workflow

```bash
git switch source
cd hexo-blog
npm run server
```

Save source changes:

```bash
cd ..
git add README.md hexo-blog/_config.yml hexo-blog/package*.json hexo-blog/source hexo-blog/themes hexo-blog/scaffolds
git commit -m "update blog source"
git push
```

Publish the site:

```bash
cd hexo-blog
npm run publish
```
