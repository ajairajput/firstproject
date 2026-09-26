# Home Renovation Tracker

A local Python (Flask) web app for tracking pre-sale home repairs and renovations — built for prepping a home in Quincy, MA for the market. Server-rendered pages, no client-side JavaScript.

## Running it

```
python -m venv .venv
.venv\Scripts\Activate.ps1        # Windows PowerShell (macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt
python app.py
```

Then open http://127.0.0.1:5000 in a browser.

Data is saved to a local SQLite file (`renovation.db`, gitignored) next to `app.py` — survives clearing browser data, but stays on this machine.

## What it does

- Pre-populated checklist of repairs/renovations across 7 categories (Structural & Systems, Exterior, Kitchen, Bathroom, Flooring, Energy Efficiency, Staging & Cosmetic), each tagged **Must-Fix**, **High-ROI**, or **Nice-to-Have** based on resale-value research.
- Dashboard: overall % complete, task counts by status, estimated remaining cost, and progress by category.
- Filter/search the checklist; add, edit, or delete tasks as your plan changes.
- Light/dark theme toggle (server-side, via cookie).

See [docs/QUINCY_SELLING_GUIDE.md](docs/QUINCY_SELLING_GUIDE.md) for the underlying market data, renovation ROI guidance, and Quincy-specific staging/marketing tips.
