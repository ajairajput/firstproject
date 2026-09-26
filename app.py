import sqlite3
from pathlib import Path

from flask import Flask, g, redirect, render_template, request, url_for

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "renovation.db"

CATEGORIES = [
    "Structural & Systems",
    "Exterior",
    "Kitchen",
    "Bathroom",
    "Flooring",
    "Energy Efficiency",
    "Staging & Cosmetic",
]
PRIORITIES = ["Must-Fix", "High-ROI", "Nice-to-Have"]
STATUSES = ["Not Started", "In Progress", "Done"]

PRIORITY_META = {
    "Must-Fix": {"class": "priority-must-fix", "icon": "▲"},
    "High-ROI": {"class": "priority-high-roi", "icon": "◆"},
    "Nice-to-Have": {"class": "priority-nice-to-have", "icon": "○"},
}
STATUS_META = {
    "Not Started": {"class": "status-not-started", "icon": "○"},
    "In Progress": {"class": "status-in-progress", "icon": "◐"},
    "Done": {"class": "status-done", "icon": "✓"},
}

DEFAULT_TASKS = [
    ("Roof inspection & repair leaks/damaged shingles", "Structural & Systems", "Must-Fix", 800,
     "Inspectors flag this fast; fix before listing, not after an offer."),
    ("Electrical panel & wiring safety check", "Structural & Systems", "Must-Fix", 600,
     "Upgrade if outdated (fuse box, knob-and-tube) — common in older Quincy housing stock."),
    ("Plumbing leak check & repair", "Structural & Systems", "Must-Fix", 400,
     "Check under sinks, water heater, and exterior spigots."),
    ("HVAC/heating system servicing", "Structural & Systems", "Must-Fix", 250,
     "Service + filter/duct check; get a clean-bill-of-health receipt for buyers."),
    ("Foundation & basement moisture inspection", "Structural & Systems", "Must-Fix", 500,
     "Address any cracks or damp signs — big red flag for South Shore buyers near the coast."),
    ("Radon test", "Structural & Systems", "Must-Fix", 200,
     "Common ask in MA home inspections; test early so there is time to mitigate if needed."),
    ("Replace or repaint garage door", "Exterior", "High-ROI", 1200,
     "Consistently the single highest-ROI exterior project."),
    ("Replace or repaint front entry door", "Exterior", "High-ROI", 900,
     "First thing a buyer touches — make it feel solid and new."),
    ("Power wash / repaint siding and trim", "Exterior", "High-ROI", 2500,
     "Removes signs of deferred maintenance at a glance."),
    ("Refresh landscaping & lawn for curb appeal", "Exterior", "High-ROI", 500,
     "Mulch beds, trim shrubs, edge the lawn — cheap and high-impact."),
    ("Repair driveway/walkway cracks", "Exterior", "High-ROI", 400,
     "Sealcoat or patch before photos are taken."),
    ("Clean & repair gutters/downspouts", "Exterior", "High-ROI", 250,
     "Cheap fix, but a clogged gutter reads as neglect during a showing."),
    ("Update kitchen cabinet hardware & fix doors", "Kitchen", "High-ROI", 200,
     "New pulls/hinges make cabinets look updated without a remodel."),
    ("Update kitchen light fixtures", "Kitchen", "High-ROI", 300,
     "Swap dated fixtures for simple, bright, modern ones."),
    ("Fresh caulk/grout, minor backsplash touch-up", "Kitchen", "High-ROI", 350,
     "Minor kitchen refresh, not a full remodel — full remodels rarely recoup cost."),
    ("Re-caulk tub/shower & fix leaks", "Bathroom", "High-ROI", 150,
     "Mold/grime in grout lines is one of the fastest things buyers notice."),
    ("Update faucet, showerhead & bathroom lighting", "Bathroom", "High-ROI", 300,
     "Cheap fixtures that make the whole room feel refreshed."),
    ("Refinish hardwood floors", "Flooring", "High-ROI", 2500,
     "One of the highest-ROI projects available — do this if floors show wear."),
    ("Replace worn carpet in bedrooms", "Flooring", "Nice-to-Have", 1800,
     "Only if visibly worn/stained; neutral tone if replacing."),
    ("Add/upgrade attic insulation", "Energy Efficiency", "Nice-to-Have", 2000,
     "Good talking point for winter heating costs in MA; may qualify for incentives."),
    ("Seal drafty windows & doors", "Energy Efficiency", "Nice-to-Have", 300,
     "Cheap weatherstripping fix, matters during a winter showing."),
    ("Declutter & depersonalize every room", "Staging & Cosmetic", "Must-Fix", 0,
     "Free, and the single highest-leverage staging step."),
    ("Fresh neutral paint throughout interior", "Staging & Cosmetic", "High-ROI", 2500,
     "Recoups close to 100% of cost; use light, neutral tones."),
    ("Deep clean entire home", "Staging & Cosmetic", "Must-Fix", 400,
     "Carpets, windows, grout, baseboards — do this last, right before photos."),
    ("Stage key rooms (living room, primary bedroom, kitchen)", "Staging & Cosmetic", "High-ROI", 800,
     "Focus staging budget on the 3 rooms buyers weight most."),
    ("Hire a professional photographer", "Staging & Cosmetic", "Must-Fix", 350,
     "In a 1.4-month-supply seller's market, listing photos are what earns the first showing."),
    ("In listing copy, highlight beaches/parks/Red Line proximity", "Staging & Cosmetic", "Nice-to-Have", 0,
     "Marketing angle specific to Quincy buyers — see docs/QUINCY_SELLING_GUIDE.md."),
]

app = Flask(__name__)


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(exception=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    with sqlite3.connect(DB_PATH) as db:
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                priority TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'Not Started',
                cost INTEGER NOT NULL DEFAULT 0,
                notes TEXT NOT NULL DEFAULT ''
            )
            """
        )
        count = db.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]
        if count == 0:
            db.executemany(
                "INSERT INTO tasks (title, category, priority, cost, notes) VALUES (?, ?, ?, ?, ?)",
                DEFAULT_TASKS,
            )
        db.commit()


def get_theme():
    theme = request.cookies.get("theme")
    return theme if theme in ("light", "dark") else None


@app.route("/")
def index():
    db = get_db()

    category = request.args.get("category", "")
    priority = request.args.get("priority", "")
    status = request.args.get("status", "")
    search = request.args.get("search", "").strip()

    query = "SELECT * FROM tasks WHERE 1=1"
    params = []
    if category:
        query += " AND category = ?"
        params.append(category)
    if priority:
        query += " AND priority = ?"
        params.append(priority)
    if status:
        query += " AND status = ?"
        params.append(status)
    if search:
        query += " AND (title LIKE ? OR notes LIKE ?)"
        like = f"%{search}%"
        params.extend([like, like])
    query += " ORDER BY id"

    filtered_tasks = db.execute(query, params).fetchall()
    all_tasks = db.execute("SELECT * FROM tasks").fetchall()

    total = len(all_tasks)
    done = sum(1 for t in all_tasks if t["status"] == "Done")
    in_progress = sum(1 for t in all_tasks if t["status"] == "In Progress")
    not_started = total - done - in_progress
    remaining_cost = sum(t["cost"] for t in all_tasks if t["status"] != "Done")
    overall_pct = round((done / total) * 100) if total else 0

    category_progress = []
    for cat in CATEGORIES:
        cat_tasks = [t for t in all_tasks if t["category"] == cat]
        if not cat_tasks:
            continue
        cat_done = sum(1 for t in cat_tasks if t["status"] == "Done")
        pct = round((cat_done / len(cat_tasks)) * 100)
        category_progress.append({"name": cat, "pct": pct})

    return render_template(
        "index.html",
        tasks=filtered_tasks,
        categories=CATEGORIES,
        priorities=PRIORITIES,
        statuses=STATUSES,
        priority_meta=PRIORITY_META,
        status_meta=STATUS_META,
        filters={"category": category, "priority": priority, "status": status, "search": search},
        kpi={
            "total": total,
            "not_started": not_started,
            "in_progress": in_progress,
            "done": done,
            "remaining_cost": remaining_cost,
        },
        overall_pct=overall_pct,
        category_progress=category_progress,
        theme=get_theme(),
    )


def _preserve_filters():
    keep = {k: v for k, v in request.args.items() if k in ("category", "priority", "status", "search") and v}
    return url_for("index", **keep)


@app.route("/tasks/add", methods=["POST"])
def add_task():
    title = request.form.get("title", "").strip()
    if title:
        db = get_db()
        db.execute(
            "INSERT INTO tasks (title, category, priority, status, cost, notes) VALUES (?, ?, ?, 'Not Started', ?, ?)",
            (
                title,
                request.form.get("category", CATEGORIES[0]),
                request.form.get("priority", "Nice-to-Have"),
                int(request.form.get("cost") or 0),
                request.form.get("notes", "").strip(),
            ),
        )
        db.commit()
    return redirect(_preserve_filters())


@app.route("/tasks/<int:task_id>/update", methods=["POST"])
def update_task(task_id):
    db = get_db()
    category = request.form.get("category")
    priority = request.form.get("priority")
    status = request.form.get("status")
    if category in CATEGORIES and priority in PRIORITIES and status in STATUSES:
        db.execute(
            "UPDATE tasks SET category = ?, priority = ?, status = ? WHERE id = ?",
            (category, priority, status, task_id),
        )
        db.commit()
    return redirect(_preserve_filters())


@app.route("/tasks/<int:task_id>/delete", methods=["POST"])
def delete_task(task_id):
    db = get_db()
    db.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    db.commit()
    return redirect(_preserve_filters())


@app.route("/set-theme")
def set_theme():
    mode = request.args.get("mode")
    dest = request.referrer or url_for("index")
    resp = redirect(dest)
    if mode in ("light", "dark"):
        resp.set_cookie("theme", mode, max_age=60 * 60 * 24 * 365)
    return resp


init_db()

if __name__ == "__main__":
    app.run(debug=True)
