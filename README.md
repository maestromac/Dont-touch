# Don't touch!

## Minimum Viable Product

Don't touch is a browser game. The goal of the game is for the player to follow a given path and avoid touching the wall with their cursor and last as long as possible. My game should:

- [ ] actively detect player's cursor and replace it with a red dot.
- [ ] render maze like path downward for users to tunnel through.
- [ ] let player know how many second has passed.
- [ ] score player base on how many seconds the player survived.
- [ ] raise difficulty the longer the player is alive.

## Technologies, Libraries, APIs

This project only require vanilla JS and HTML.

## Wireframes

[View Wireframes][views]

[views]: docs/views

## Implementation Timeline

### Phase 1: Cursor detection

**Objective:** Set up cursor detection

- [x] track cursor location
- [x] stylistically replace traditional cursor with a red dot.
- [ ] render score on the corner of the frame.

### Phase 2: Generate Path

**Objective:** Set up the moving path/maze.

- [x] set up a block-like maze path
- [x] maze path should be falling down.
- [x] create an algorithm to automatically generate path base on the seconds player lasted.

### Phase 3: Complete project

**Objective:** Set up intro start page and end page.

- [ ] create a intro page.
- [ ] render final score page, and play again.
- [ ] create a ranking score board.
