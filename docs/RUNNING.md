# Running the app

These steps assume Windows + PowerShell (this project's setup), with Python already installed.

## 1. Open a terminal in the project folder

```powershell
cd C:\Users\ajair\workspace\firstproject
```

## 2. Create a virtual environment (first time only)

A virtual environment keeps this project's Python packages separate from anything else on your machine. Skip this step if the `.venv` folder already exists.

```powershell
python -m venv .venv
```

## 3. Activate the virtual environment

```powershell
.venv\Scripts\Activate.ps1
```

Your prompt should now start with `(.venv)`. You'll need to run this once per new terminal window — it doesn't stay active between sessions.

**If PowerShell blocks the script** with an error like *"running scripts is disabled on this system"*, that's Windows' execution policy. Allow local scripts for your user only (safe, doesn't affect the whole machine):

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Then re-run the activate command.

## 4. Install dependencies (first time, and after any requirements.txt change)

```powershell
pip install -r requirements.txt
```

## 5. Run the app

```powershell
python app.py
```

You should see output ending in something like:

```
 * Running on http://127.0.0.1:5000
```

## 6. Open it in your browser

Go to **http://127.0.0.1:5000**

## 7. Stop the app

Back in the terminal, press **Ctrl+C**.

## Day-to-day (after first-time setup)

Every time you come back to work on this:

```powershell
cd C:\Users\ajair\workspace\firstproject
.venv\Scripts\Activate.ps1
python app.py
```

Then open http://127.0.0.1:5000 and Ctrl+C to stop when done.

## Your data

Everything you check off, edit, or add is saved to `renovation.db`, a file that sits next to `app.py`. It's excluded from git (see `.gitignore`), so it stays only on this computer and is never pushed to GitHub.

**To reset the checklist back to the original 27 seeded tasks**, close the app (Ctrl+C) and delete that file:

```powershell
Remove-Item renovation.db
```

It will be recreated with the default checklist the next time you run `python app.py`.

## Troubleshooting

- **`python` / `pip` not recognized** — if you installed Python recently and this is a terminal window that was already open at the time, close it and open a new one. If it's a brand-new terminal and still fails, sign out and back in to Windows (or reboot) so the system PATH refreshes everywhere, including apps like VS Code that cache it at launch.
- **Port 5000 already in use** — another program (or a previous, still-running copy of this app) is using it. Find and close that process, or edit the last line of `app.py` to `app.run(debug=True, port=5001)` and use that port instead.
- **Changes to the checklist seem to disappear** — make sure you're always running the app from this same folder; a `renovation.db` created in a different folder is a separate, empty database.
