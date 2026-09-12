/* ============================================================
   app.js — all the logic.

   THE ONE PATTERN THAT RUNS THIS WHOLE APP:

       change STATE  ->  save()  ->  render()

   Nothing ever edits the page directly. If you want the screen to
   change, you change STATE and call render(). The DOM is only ever
   a picture of STATE — it is never where the truth lives.

   If you have written Unity: STATE is your game state object,
   render() is the function that rebuilds the UI from it, and
   localStorage is PlayerPrefs.

   -----------------------------------------------------------
   JATIN — THE THREE THINGS YOU MUST BE ABLE TO EXPLAIN:
     1. toggleVote()    section 8 — state change + the guard
     2. visibleIdeas()  section 5 — filter + sort pipeline
     3. the grid click listener, section 10 — event delegation
   Everything else you can read off the screen in an interview.
   Those three you should be able to talk through from memory.
   -----------------------------------------------------------
   ============================================================ */

/* ---------- 1. STORAGE KEY ---------- */
const STORE_KEY = "pitcharena.v1";

/* Comment rules, kept in one place so the form and the validator
   can never disagree about them. */
const NOTE_MIN = 10;
const NOTE_MAX = 140;

/* ---------- 2. STATE ---------- */
/* Everything the app needs to know, in one object. */
const STATE = {
  votes: {},        // { messmate: 37 }             -> current count per idea
  voted: {},        // { messmate: true }           -> has this user voted here
  notes: {},        // { messmate: [{id,text,at}] } -> this user's comments
  theme: "light",
  query: "",
  category: "All",
  sort: "votes",
  openId: null,     // which idea the modal is showing, if any
  noteDraft: "",    // what's typed in the comment box but not posted
  noteError: ""     // validation message for the comment form
};

/* ---------- 3. ELEMENTS (grabbed once, reused) ---------- */
const el = {
  grid: document.getElementById("grid"),
  chips: document.getElementById("chips"),
  search: document.getElementById("searchInput"),
  sort: document.getElementById("sortSelect"),
  empty: document.getElementById("empty"),
  resultLine: document.getElementById("resultLine"),
  leaderboard: document.getElementById("leaderboard"),
  modal: document.getElementById("modal"),
  modalBody: document.getElementById("modalBody"),
  themeBtn: document.getElementById("themeBtn"),
  themeIcon: document.getElementById("themeIcon"),
  resetBtn: document.getElementById("resetBtn"),
  clearBtn: document.getElementById("clearFiltersBtn")
};

/* ---------- 4. PERSISTENCE ---------- */
/* localStorage only stores strings, so objects go through JSON. */

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;                      // first ever visit
    const saved = JSON.parse(raw);
    STATE.votes = saved.votes || {};
    STATE.voted = saved.voted || {};
    STATE.notes = saved.notes || {};
    STATE.theme = saved.theme || "light";
  } catch (err) {
    // Corrupt or hand-edited data. Don't crash the app — start clean.
    console.warn("Saved data was unreadable, starting fresh.", err);
    localStorage.removeItem(STORE_KEY);
  }
}

function save() {
  try {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({
        votes: STATE.votes,
        voted: STATE.voted,
        notes: STATE.notes,
        theme: STATE.theme
      })
    );
  } catch (err) {
    // Private browsing or storage full. App still works, just won't persist.
    console.warn("Could not save.", err);
  }
}

/* ---------- 5. DERIVED VALUES ---------- */
/* Never store what you can calculate. Vote share, the leaderboard
   order and the totals are all worked out at render time, so they
   can never drift out of sync with the counts. */

function voteCount(idea) {
  // Saved count if it exists, otherwise the seed value from data.js
  return STATE.votes[idea.id] ?? idea.baseVotes;
}

function totalVotes() {
  return IDEAS.reduce((sum, idea) => sum + voteCount(idea), 0);
}

/* Seeded comments from data.js plus this user's own, newest first. */
function allNotes(idea) {
  const seeded = (idea.seedNotes || []).map(n => ({ ...n, mine: false }));
  const mine = (STATE.notes[idea.id] || []).map(n => ({ ...n, by: "You", mine: true }));
  return [...seeded, ...mine].sort((a, b) => String(b.at).localeCompare(String(a.at)));
}

function noteCount(idea) {
  return (idea.seedNotes || []).length + (STATE.notes[idea.id] || []).length;
}

function votedCount() {
  return Object.keys(STATE.voted).filter(k => STATE.voted[k]).length;
}

function categories() {
  // ["All", "FinTech", "Campus", ...] built from the data itself,
  // so adding an idea in a new category adds a chip automatically.
  return ["All", ...new Set(IDEAS.map(i => i.category))];
}

/* THE FILTER + SORT PIPELINE.
   One function, one path to the screen. Search, category and sort
   all funnel through here rather than each poking at the DOM. */
function visibleIdeas() {
  const q = STATE.query.trim().toLowerCase();

  let list = IDEAS.filter(idea => {
    const matchesCategory =
      STATE.category === "All" || idea.category === STATE.category;

    const haystack = (
      idea.name + " " + idea.tagline + " " + idea.tags.join(" ")
    ).toLowerCase();

    return matchesCategory && haystack.includes(q);
  });

  if (STATE.sort === "votes") {
    list = list.sort((a, b) => voteCount(b) - voteCount(a));
  } else if (STATE.sort === "new") {
    list = list.sort((a, b) => b.added.localeCompare(a.added));
  } else if (STATE.sort === "talked") {
    list = list.sort((a, b) => noteCount(b) - noteCount(a));
  } else {
    list = list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

/* ---------- 6. HELPERS ---------- */

/* We build HTML from strings, so any text going in must be escaped.
   Without this, a comment containing <script> would actually run.
   This is the one line standing between your app and an XSS hole. */
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* "3 minutes ago", "2 days ago". Falls back to the raw date if
   the timestamp can't be parsed. */
function relTime(when) {
  const then = new Date(when).getTime();
  if (Number.isNaN(then)) return "";

  const secs = Math.floor((Date.now() - then) / 1000);
  if (secs < 60) return "just now";

  /* Each pair is "how many of the previous unit fit in this one".
     60 seconds in a minute, 60 minutes in an hour, 24 hours in a
     day, and so on up the chain. */
  const steps = [
    [60, "minute"],
    [60, "hour"],
    [24, "day"],
    [30, "month"],
    [12, "year"]
  ];

  let value = secs;
  let label = "second";
  for (const [size, name] of steps) {
    if (value < size) break;
    value = Math.floor(value / size);
    label = name;
  }

  return `${value} ${label}${value === 1 ? "" : "s"} ago`;
}

/* ---------- 7. RENDER ---------- */

function cardHTML(idea, rank) {
  const count = voteCount(idea);
  const hasVoted = Boolean(STATE.voted[idea.id]);
  const share = totalVotes() ? (count / totalVotes()) * 100 : 0;
  const notes = noteCount(idea);

  return `
    <article class="card ${hasVoted ? "card--voted" : ""}" data-id="${idea.id}" tabindex="0">
      ${rank === 0 ? '<span class="card__badge">Leading</span>' : ""}
      <p class="card__cat">${esc(idea.category)}</p>
      <h2 class="card__name">${esc(idea.name)}</h2>
      <p class="card__tagline">${esc(idea.tagline)}</p>

      <div class="card__meter">
        <div class="card__meter-fill" style="width:${share.toFixed(1)}%"></div>
      </div>

      <div class="card__foot">
        <span class="card__count">
          <strong data-count="${idea.id}">${count}</strong> votes
          <span class="card__notes">· ${notes} note${notes === 1 ? "" : "s"}</span>
        </span>
        <button
          class="btn ${hasVoted ? "btn--voted" : "btn--vote"}"
          data-vote="${idea.id}"
          type="button"
          title="${hasVoted ? "Click to undo your vote" : "Back this idea"}"
          aria-label="${hasVoted ? "Undo your vote for " + esc(idea.name) : "Vote for " + esc(idea.name)}"
        >${hasVoted ? "Voted ✓" : "Vote"}</button>
      </div>
    </article>
  `;
}

function renderChips() {
  el.chips.innerHTML = categories()
    .map(cat => {
      const n = cat === "All"
        ? IDEAS.length
        : IDEAS.filter(i => i.category === cat).length;
      return `
        <button
          class="chip ${STATE.category === cat ? "chip--on" : ""}"
          data-cat="${esc(cat)}"
          type="button"
        >${esc(cat)} <span class="chip__n">${n}</span></button>`;
    })
    .join("");
}

function renderLeaderboard() {
  const top = [...IDEAS].sort((a, b) => voteCount(b) - voteCount(a)).slice(0, 3);

  el.leaderboard.innerHTML = top
    .map(
      (idea, i) => `
      <div class="lb__item">
        <span class="lb__rank">${i + 1}</span>
        <span class="lb__name">${esc(idea.name)}</span>
        <span class="lb__votes">${voteCount(idea)}</span>
      </div>`
    )
    .join("");
}

/* The modal contents. Split out from render() because it also
   needs to redraw on its own after a comment is posted. */
function renderModal() {
  if (!STATE.openId) return;

  const idea = IDEAS.find(i => i.id === STATE.openId);
  if (!idea) return;

  const hasVoted = Boolean(STATE.voted[idea.id]);
  const notes = allNotes(idea);

  const notesHTML = notes.length
    ? notes
        .map(
          n => `
        <li class="note ${n.mine ? "note--mine" : ""}">
          <div class="note__head">
            <span class="note__by">${esc(n.by)}</span>
            <span class="note__when">${esc(relTime(n.at))}</span>
            ${n.mine ? `<button class="note__del" data-delnote="${esc(n.id)}" type="button" aria-label="Delete your note">Delete</button>` : ""}
          </div>
          <p class="note__text">${esc(n.text)}</p>
        </li>`
        )
        .join("")
    : `<li class="note note--none">No notes yet. Be the first to say what you think.</li>`;

  el.modalBody.innerHTML = `
    <p class="sheet__cat">${esc(idea.category)}</p>
    <h2 class="sheet__name" id="modalTitle">${esc(idea.name)}</h2>
    <p class="sheet__tagline">${esc(idea.tagline)}</p>

    <div class="sheet__stats">
      <div><span>${voteCount(idea)}</span> votes</div>
      <div><span>${notes.length}</span> notes</div>
      <div>${esc(idea.founder)}</div>
    </div>

    <button
      class="btn ${hasVoted ? "btn--voted" : "btn--vote"} sheet__vote"
      data-vote="${idea.id}"
      type="button"
    >${hasVoted ? "Voted ✓  ·  click to undo" : "Back this idea"}</button>

    <h3>The problem</h3><p>${esc(idea.problem)}</p>
    <h3>The solution</h3><p>${esc(idea.solution)}</p>
    <h3>Market</h3><p>${esc(idea.market)}</p>
    <h3>Where it stands</h3><p>${esc(idea.traction)}</p>

    <div class="notes">
      <h3 class="notes__title">What people said</h3>

      <div class="noteform">
        <label class="noteform__label" for="noteInput">
          ${hasVoted ? "Why did you back this?" : "What do you make of it?"}
        </label>
        <textarea
          id="noteInput"
          class="noteform__input ${STATE.noteError ? "noteform__input--bad" : ""}"
          rows="2"
          maxlength="${NOTE_MAX}"
          placeholder="One line is enough."
          aria-describedby="noteHint"
        >${esc(STATE.noteDraft)}</textarea>
        <div class="noteform__row">
          <span class="noteform__hint ${STATE.noteError ? "noteform__hint--bad" : ""}" id="noteHint">
            ${STATE.noteError ? esc(STATE.noteError) : `${NOTE_MIN}–${NOTE_MAX} characters`}
          </span>
          <span class="noteform__count" id="noteCount">${STATE.noteDraft.length}/${NOTE_MAX}</span>
          <button class="btn btn--solid" id="notePost" type="button">Post note</button>
        </div>
      </div>

      <ul class="notes__list">${notesHTML}</ul>
    </div>
  `;
}

/* THE one function that redraws the board. */
function render() {
  const list = visibleIdeas();

  document.documentElement.dataset.theme = STATE.theme;
  el.themeIcon.textContent = STATE.theme === "dark" ? "◑" : "◐";
  el.themeBtn.setAttribute(
    "aria-label",
    STATE.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );

  renderChips();
  renderLeaderboard();

  el.empty.hidden = list.length > 0;

  const backed = votedCount();
  el.resultLine.textContent = list.length
    ? `${list.length} pitch${list.length === 1 ? "" : "es"} · ${totalVotes()} votes cast` +
      (backed ? ` · you've backed ${backed} of ${IDEAS.length}` : "")
    : "";

  el.grid.innerHTML = list
    .map((idea, i) => cardHTML(idea, STATE.sort === "votes" ? i : -1))
    .join("");

  renderModal();
}

/* ---------- 8. ACTIONS ---------- */

/* Voting. One vote per idea per browser, and clicking again undoes it.
   The guard is STATE.voted — not the button's disabled attribute,
   because the DOM is never the source of truth. */
function toggleVote(id) {
  const idea = IDEAS.find(i => i.id === id);
  if (!idea) return;

  const current = voteCount(idea);

  if (STATE.voted[id]) {
    // Undo: step the count back down and clear the flag.
    STATE.votes[id] = Math.max(idea.baseVotes, current - 1);
    delete STATE.voted[id];
  } else {
    STATE.votes[id] = current + 1;
    STATE.voted[id] = true;
  }

  save();
  render();

  // Small confirmation animation on the number that just changed.
  const numberEl = el.grid.querySelector(`[data-count="${id}"]`);
  if (numberEl) {
    numberEl.classList.add("pop");
    numberEl.addEventListener("animationend", () => numberEl.classList.remove("pop"), { once: true });
  }
}

/* Comment validation. Returns an error string, or "" if it's fine.
   Kept separate from the DOM so the rule is testable on its own. */
function validateNote(text) {
  const trimmed = text.trim();
  if (!trimmed) return "Write something before posting.";
  if (trimmed.length < NOTE_MIN) return `A bit longer please — at least ${NOTE_MIN} characters.`;
  if (trimmed.length > NOTE_MAX) return `Keep it to one line — ${NOTE_MAX} characters max.`;
  return "";
}

function addNote(id, text) {
  const error = validateNote(text);
  STATE.noteError = error;

  if (error) {
    // Redraw shows the message. The draft survives because it lives
    // in STATE, not only in the textarea. Put the cursor back.
    renderModal();
    const input = document.getElementById("noteInput");
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
    return false;
  }

  if (!STATE.notes[id]) STATE.notes[id] = [];
  STATE.notes[id].push({
    id: "n" + Date.now(),
    text: text.trim(),
    at: new Date().toISOString()
  });

  STATE.noteDraft = "";
  save();
  render();
  return true;
}

function deleteNote(ideaId, noteId) {
  if (!STATE.notes[ideaId]) return;
  STATE.notes[ideaId] = STATE.notes[ideaId].filter(n => n.id !== noteId);
  save();
  render();
}

function resetBoard() {
  const ok = confirm("This clears your votes and notes on this device. Continue?");
  if (!ok) return;

  STATE.votes = {};
  STATE.voted = {};
  STATE.notes = {};
  save();
  render();
}

function openModal(id) {
  STATE.openId = id;
  STATE.noteDraft = "";
  STATE.noteError = "";
  renderModal();

  el.modal.hidden = false;
  document.body.classList.add("locked");
  el.modal.querySelector(".modal__panel").scrollTop = 0;
  document.getElementById("modalClose").focus();
}

function closeModal() {
  el.modal.hidden = true;
  STATE.openId = null;
  STATE.noteDraft = "";
  STATE.noteError = "";
  document.body.classList.remove("locked");
}

/* ---------- 9. EVENT WIRING ---------- */
/* ONE listener on each container, not one per button.

   Why: render() destroys and rebuilds every card. Listeners attached
   to individual buttons would be destroyed with them and stop working
   after the first vote. The container survives, so its listener does
   too. This is called EVENT DELEGATION and it WILL come up in your
   interview. event.target is what was actually clicked; .closest()
   walks up from there to find the element you care about. */

el.grid.addEventListener("click", event => {
  const voteBtn = event.target.closest("[data-vote]");
  if (voteBtn) {
    toggleVote(voteBtn.dataset.vote);
    return;                              // don't also open the modal
  }

  const card = event.target.closest(".card");
  if (card) openModal(card.dataset.id);
});

/* Keyboard access: cards are focusable, so Enter should open them. */
el.grid.addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  const card = event.target.closest(".card");
  if (card) openModal(card.dataset.id);
});

el.chips.addEventListener("click", event => {
  const chip = event.target.closest("[data-cat]");
  if (!chip) return;
  STATE.category = chip.dataset.cat;
  render();
});

el.search.addEventListener("input", event => {
  STATE.query = event.target.value;
  render();
});

el.sort.addEventListener("change", event => {
  STATE.sort = event.target.value;
  render();
});

el.themeBtn.addEventListener("click", () => {
  STATE.theme = STATE.theme === "dark" ? "light" : "dark";
  save();
  render();
});

el.resetBtn.addEventListener("click", resetBoard);

el.clearBtn.addEventListener("click", () => {
  STATE.query = "";
  STATE.category = "All";
  el.search.value = "";
  render();
});

/* Modal: one listener covers closing, voting, posting and deleting. */
el.modal.addEventListener("click", event => {
  if (event.target.dataset.close || event.target.id === "modalClose") {
    closeModal();
    return;
  }

  const voteBtn = event.target.closest("[data-vote]");
  if (voteBtn) {
    toggleVote(voteBtn.dataset.vote);
    return;
  }

  const delBtn = event.target.closest("[data-delnote]");
  if (delBtn) {
    deleteNote(STATE.openId, delBtn.dataset.delnote);
    return;
  }

  if (event.target.id === "notePost") {
    const input = document.getElementById("noteInput");
    addNote(STATE.openId, input.value);
  }
});

/* Live character counter, and Ctrl/Cmd+Enter to post.

   This handler touches the hint and counter directly instead of
   calling render(). That is deliberate: a full redraw would replace
   the textarea and the user would lose their cursor mid-sentence.
   Typing is the one place where redrawing on every keystroke costs
   more than it's worth. */
el.modal.addEventListener("input", event => {
  if (event.target.id !== "noteInput") return;

  STATE.noteDraft = event.target.value;

  const counter = document.getElementById("noteCount");
  if (counter) counter.textContent = `${STATE.noteDraft.length}/${NOTE_MAX}`;

  if (STATE.noteError) {
    STATE.noteError = "";
    const hint = document.getElementById("noteHint");
    if (hint) {
      hint.textContent = `${NOTE_MIN}–${NOTE_MAX} characters`;
      hint.classList.remove("noteform__hint--bad");
    }
    event.target.classList.remove("noteform__input--bad");
  }
});

el.modal.addEventListener("keydown", event => {
  if (event.target.id !== "noteInput") return;
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    addNote(STATE.openId, event.target.value);
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !el.modal.hidden) closeModal();
});

/* ---------- 10. START ---------- */
load();
render();
