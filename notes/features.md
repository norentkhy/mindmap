this serves

- as a backlog
- to define the region of work for each feature
- to clarify how to organise the coming rebase

# linked list nodes

- this would make it easier and more straight-forward
  - to select family members, such as
    - parents
    - succeeding sibling
    - proceeding sibling
  - this is actually already done for children
    - and it works like a breeze

# infinite mind canvas

- this has already been prototyped @proofs-of-concept/InfiniteScrollView

# placement of root nodes

- only root nodes are created and placed in an absolute sense
- right now they are placed according to left-top of root-element
  - should be placed according to left-top of center-of-element

# speedboost via state management optimisations

- figure out ways to only trigger re-renders of changed nodes
- probably using mobx, but this should be a late decision!
  - can check out how mobx optimises for this though!
