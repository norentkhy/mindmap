# intro

curiosity rose from browsing reddit:

- https://www.reddit.com/r/reactjs/comments/mf8438/when_to_use_redux_vs_context_api/
- a redux maintainer commented: https://blog.isquaredsoftware.com/2021/01/context-redux-differences/
- further down, someone mentioned: https://github.com/dai-shi/use-context-selector

# react render

reading this made me curious about the react render

- https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/
- which got me interested in how this works in state management tools with react, such as
  - redux, which suddenly became much more verbose;
  - mobx, which became more desireable

# useContextSelector

https://github.com/dai-shi/use-context-selector

- before knowing anything about it, it seemed nice
- after reading that it requires you to decorate useContext and createContext
- it erks me when I see the example code

# MobX

- https://mobx.js.org/react-integration.html
  - this seems to be what I need
- https://itnext.io/turn-on-time-travelling-for-mobx-c3f267a46f10
  - this convinced me to not use MST (mobx state tree), because syntax
  - how to implement undo/redo
- https://shift.infinite.red/why-infinite-red-uses-mobx-state-tree-instead-of-redux-d6c1407dead
  - original article why I started to prefer mobx

# Redux

- apparently everyone does it differently
  - https://itnext.io/turn-on-time-travelling-for-mobx-c3f267a46f10
- to write for performance, you need to be specific
  - seems to be "should-not-be-necessary" mental energy requirement

# Profiling

- https://kentcdodds.com/blog/profile-a-react-app-for-performance
- apparently in dev mode, react should only be profiled in relative sense.
  - in prod mode, react can of course be profiled also in absolute sense.

# alternative to react, purely using hooks

stumbled upon this, whilst reading about hooks and react render/commit

- https://github.com/getify/TNG-Hooks
- seems neat
- JSX still seems nice to use besides this though
