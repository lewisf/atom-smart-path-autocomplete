# Smart Path Autocomplete

Given a project, do configurable path completion for javascript packages.

## Setup

Make sure you install fb-watchman

```
brew install watchman --HEAD
```

DO NOT INSTALL IT WITH NPM. If you did:

```
npm uninstall watchman
```

Then run:
```
npm install
apm link
```

## Configuration

TODO

## Todos

- [x] Enable configurable path replacements to handle project-specific needs
- [x] Enable automatically reloating paths when files change.
- [ ] Enable automatic relative pathing when X layers away.
- [ ] Enable for ES6 module import/export syntax
- [ ] Enable configuration of extension ignores
- [ ] Enable prefixing autocompletions depending on extension
