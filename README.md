# Pitch Arena

A startup idea voting board built for the NSUT IIF Tech Team recruitment task
(1st year — Option 2: Startup Pitch Arena).

**Live site:** https://hirenpawar.github.io/pitch-arena
**Repository:** https://github.com/HirenPawar/pitch-arena

---

## Overview

Pitch Arena presents a set of startup ideas as interactive cards. Visitors can
read each pitch, open a detailed view, and vote for the ideas they would back.
Votes persist in the browser, so the board reflects your choices when you come
back to it. A live leaderboard re-ranks the top three as votes come in.

Every pitch was written for a real gap in the Indian market rather than filled
with placeholder text.

## Features

- **Data-driven cards** — every card is generated from a JavaScript array. Adding
  an idea means adding one object; no HTML is touched.
- **Instant voting** — the count, the vote-share meter, and the leaderboard all
  update on click with no page reload.
- **Persistent votes** — counts and your voting history are saved to
  `localStorage` and survive a refresh or a browser restart.
- **One vote per idea, with undo** — the button shows a voted state and clicking
  it again removes your vote and steps the count back down.
- **Notes** — leave a one-line reason for your vote on any pitch. Validated on
  length, escaped on output, stored per pitch, and deletable. Each card shows
  its note count.
- **Detail view** — clicking a card opens a modal with the problem, solution,
  market and current traction. Closes on the × button, a backdrop click, or Escape.
- **Live search** — filters by name, tagline and tags as you type.
- **Category filters** — chips generated from the data itself, so new categories
  appear automatically.
- **Sorting** — by votes, newest, most discussed, or alphabetical.
- **Vote-share meter** — each card shows its share of all votes cast.
- **Live leaderboard** — the current top three, re-sorting as votes land.
- **Dark mode** — toggled and remembered across sessions.
- **Empty state** — a clear message and a reset action when filters match nothing.
- **Reset board** — clears your votes and notes after a confirmation, returning
  the board to its seed values.
- **Progress line** — shows how many of the twelve pitches you have backed.
- **Keyboard accessible** — cards are focusable and open with Enter, the modal
  closes with Escape, Ctrl+Enter posts a note, and focus outlines are visible
  throughout.
- **Responsive** — a single-line CSS Grid declaration adapts from one column on
  phones to four on wide screens.
- **Reduced motion respected** — animations are disabled for users who ask for it.

## Tech stack

| Layer | Choice |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 — custom properties, Grid, Flexbox |
| Logic | Vanilla JavaScript (ES6+) |
| Persistence | Web Storage API (`localStorage`) |
| Fonts | Bricolage Grotesque, Inter (Google Fonts) |
| Hosting | _Vercel / Netlify / GitHub Pages — state which_ |

No frameworks, no UI libraries, no pre-built templates. All components and
styling were built for this project.

## Project structure

```
startup-pitch-arena/
├── index.html    Page structure and the empty containers JS fills
├── style.css     Design tokens, layout, components, dark mode
├── data.js       The startup ideas — single source of content
├── app.js        State, rendering, voting, persistence, filtering
└── README.md
```

## Setup

No build step and no dependencies.

```bash
git clone <your-repo-url>
cd startup-pitch-arena
```

Then either open `index.html` directly in a browser, or serve it locally:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve
```

Visit `http://localhost:8000`.

## Design and architecture decisions

**One state object, one render function.** All application data lives in a single
`STATE` object. The DOM is never treated as storage — it is redrawn from `STATE`
whenever something changes. The flow is always: change `STATE` → `save()` →
`render()`. This means there is exactly one path to the screen, so the UI can
never disagree with the data behind it.

**Event delegation.** `render()` destroys and rebuilds every card, which would
also destroy any listeners attached to individual vote buttons. Instead, one
click listener sits on the grid container and uses `event.target.closest()` to
work out what was clicked. The container is never replaced, so the listener
survives every re-render.

**Derived values are calculated, not stored.** Vote share, the leaderboard order
and the total are computed at render time from the vote counts. Storing them
would mean keeping several numbers in sync and eventually failing to.

**Input is validated in one place.** `validateNote()` takes a string and returns
an error message or an empty string. It touches no DOM at all, so the rule can be
reasoned about and tested on its own, and the form and the save path can never
disagree about what counts as valid.

**Content is separated from logic.** `data.js` holds only pitches; `app.js` holds
only behaviour. Anyone can add an idea without reading a line of application code.

**Escaping on output.** Cards and the modal are built as HTML strings, so every
piece of text passes through an escape function first. This matters most for
notes, which are user input: without escaping, a note containing a `<script>` tag
would execute instead of displaying. The ampersand is replaced first, otherwise it
would double-escape the entities produced by the later replacements.

**One exception to the redraw rule.** Typing in the note box updates the character
counter directly rather than calling `render()`. A full redraw would replace the
textarea and throw away the cursor position mid-sentence. The draft text still
lives in `STATE`, so a failed validation redraws the form without losing what was
typed.

**Defensive loading.** Reading from `localStorage` is wrapped in `try/catch`. If
the stored JSON is missing, corrupt or manually edited, the app clears it and
starts from the seed data instead of failing to boot.

## Known limitations

Votes and notes are stored per browser via `localStorage`, so they are local to
one device and can be cleared by the user. This is the right tool for the task as
specified, but it is not vote prevention in any real sense, and notes are not
shared between visitors. Genuine one-vote-per-person enforcement and a shared
comment thread both need a server with user accounts, which would be the first
thing to build next.

## Author

Hiren Pawar — 1st year, Mechanical Engineering, NSUT
