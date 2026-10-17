# The Walking Man

A man walks around the world for peace, city to city, in real time. Open the page and you see exactly where he is right now. Everyone who visits sees the same moment, because his position is worked out from the clock. There is no server.

**Live:** https://beepd.github.io/the-walking-man/

## The journey
- **Start:** Sunday 18 October 2026, 9:00 AM IST, from Mumbai.
- **Route:** 36 cities, from Mumbai through Asia, the Americas, Africa and Europe to Dubai. Then he carries on to Mumbai and Pune and begins another lap.
- **Size of a lap:** about 62,000 km and about 1,001 days.
- **Speed:** walking 5 km/h, rowing 3.5 km/h on sea crossings.

### Cities
Mumbai, Pune, Hyderabad, Kolkata, Dhaka, Yangon, Bangkok, Phnom Penh, Hanoi, Beijing, Seoul, Tokyo, Vancouver, Los Angeles, Mexico City, Panama City, Bogotá, Lima, Santiago, Buenos Aires, Rio de Janeiro, Dakar, Accra, Casablanca, Lisbon, Madrid, Paris, London, Amsterdam, Berlin, Vienna, Rome, Athens, Istanbul, Tbilisi, Dubai.

## His day
Times are local solar time where he is (longitude × 4 minutes), so he sleeps and wakes with the sun wherever he is.

| Time | Activity |
|---|---|
| 06:00–08:00 | Walk |
| 08:00–08:30 | Breakfast |
| 08:30–12:30 | Walk |
| 12:30–13:15 | Lunch |
| 13:15–16:30 | Walk |
| 16:30–16:50 | Snack |
| 16:50–19:30 | Walk |
| 19:30–20:15 | Dinner |
| 20:15–22:00 | Walk |
| 22:00–06:00 | Sleep in a tent by a campfire |

Meals are local dishes (vada pav in Mumbai, sushi in Tokyo, and so on).

## What you see
- The city he left on the left (shrinking) and the one he is heading to on the right (growing). When he arrives, the city is bigger than he is and locals welcome him in their own language.
- Day and night follow the local sun. At night there is a tent, a campfire and fireflies.
- Sea crossings are in a rowing boat, with a pier at each end.
- A top bar shows time on the road, a countdown to the next city, distance travelled, and the time where he is.
- A line at the bottom says what he is doing right now.
- Sound (footsteps, sea, crickets, fire) is off until you tap anywhere. The speaker button at top right turns it on and off.
- Best on a phone held sideways. Text colour adapts to the sky for readability.

## Try it
- `?demo` or `?demo=30` — starts a quick demo of walking and arriving (the number is the seconds per leg).
- `?row` — preview the rowing scene.

## Files
| File | What it does |
|---|---|
| `index.html` | Page layout and the SVG scene (the man, tent, campfire, HUD) |
| `style.css` | Look, animations and poses |
| `journey.js` | The clock-driven journey: launch time, daily routine, where he is at any moment |
| `cities.js` | The 36 cities: coordinates, artwork, dishes, greetings |
| `app.js` | Drawing, sound, sky colours, HUD and captions |

No build step. Open `index.html` in a browser, or host the folder on any static host (it runs on GitHub Pages).
