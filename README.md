# HOUSE PLEDGE

A first-person psychological horror game in the style of *Fears to Fathom*.
Realistic horror only — no supernatural elements. The monsters are ordinary
college students given power over other college students.

**Content warning:** hazing, coerced drinking, sleep deprivation, and a student
death. If you or someone you know is being hazed: 1-888-NOT-HAZE (anonymous).

## How to play

Easiest: double-click `index.html` (needs internet once, for the Three.js CDN).

Or serve it locally:

```sh
cd house-pledge
python3 -m http.server 8422
# open http://localhost:8422
```

## Controls

| Key | Action |
|---|---|
| WASD | Move |
| Mouse | Look (click the screen to capture the mouse) |
| Shift | Sprint (limited stamina) |
| E | Interact |
| Tab | Open / close phone |
| Space / Click | Advance narration & dialogue |
| 1–4 | Select dialogue choices / text replies |

## Story

You are Ethan Brooks, a freshman at Waterford University, an elite northeastern
school in the dead of a snowy spring semester. Your roommate Jake wants you both
to rush SAE — the gothic mansion at the end of Greek Row. The game runs from rush
night in late February through St. Patrick's Eve, in seven chapters:

1. **Rush Night** — classes, parties, the campus feels alive
2. **Bid Day / Lineup** — pledging begins
3. **2:58 AM** — the late-night summons start
4. **Attrition** — Noah starts to come apart; Jake wants out
5. **St. Patrick's Eve** — the biggest party of the year, until "House. Now."
6. **The backyard** — a realistic tragedy, and a roomful of people deciding
   whether to call 911
7. **After** — investigations, gossip, and a system that continues

## Tech

- Single-page Three.js (r152) walking sim, no build step, no asset files
- PS1-flavored rendering: low internal resolution, nearest-neighbor dithered
  procedural textures, fog
- VHS overlay: scanlines, animated tape noise, tracking bar, chromatic-aberration
  timestamp
- All audio is synthesized at runtime with WebAudio (wind, muffled party bass,
  crowd murmur, footsteps in snow, heartbeat, text-message buzz)
- iMessage-style phone with threads, unread badges, reply choices, notifications,
  and phone-confiscation states
