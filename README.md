# Google Sheets & Apps Script Habit Tracker Dashboard

A lightweight, secure, and automated personal habit-tracking dashboard powered by Google Sheets and Google Apps Script. 

This tool keeps your personal routine data entirely within your own private Google ecosystem. No third-party servers, external app accounts, or paid subscription services are required.

---

## Features

* **Automated Logging:** Seamlessly track daily habits and routines backed by custom Apps Script automation.
* **Increase Success:** Automatically calculate streaks and summarize tasks for the day to encourage productivity towards goals.
* **100% Private & Secure:** Runs directly inside your personal Google Drive account with zero external data sharing.
* **Customizable Trackers:** Easily modify habits, point values, and reward details via a dedicated settings tab.
* **Time-Based Triggers:** Set background scripts to handle daily resets, reminders, or weekly archiving automatically.

---

## Getting Started & Installation

### Step 1: Create the Google Sheet
1. Open Google Sheets and create a new spreadsheet.
2. Copy the template structure from the provided [Google Sheet Template Link](https://docs.google.com/spreadsheets/d/1_xOcUYboKoY9CWRni9VOhF8RvqEXNINYlDrfgL-29dI/).
3. Rename the sheet (optional_.

### Step 2: Add the Apps Script Code
1. In your spreadsheet, click on **Extensions** > **Apps Script** in the top menu bar.
2. Delete any boilerplate code in the `Code.gs` file.
3. Copy and paste the customized habit-tracker backend code into the editor if not automatically transferred.
4. Replace the placeholder spreadsheet ID variable with your actual Google Sheet ID (found in your sheet's URL).
5. Click the **Save** disk icon at the top.

### Step 3: Set Up Web App / Dashboard Interface
1. In the Apps Script editor, click on **Deploy** > **New Deployment**.
2. Select **Web app** as the type, set execution to **Me**, and access to **Only myself** (or users within your organization).
3. Click **Deploy**. Authorize access when prompted (click **Advanced** -> **Go to [Project Name] (unsafe)** -> **Allow**).
4. Copy the resulting **Web app URL** to access your interactive habit dashboard interface.

### Step 4: Authorize and Test
1. Select your initialization function(spreadsheetData()) from the function dropdown menu at the top of the Apps Script editor).
2. Click **Run** to finalize permissions and test the backend connection.

---

## Usage

* **Daily Check-ins:** Mark your habits as complete directly via the web app interface or by checking off items in your daily Google Sheet row. 
* **Adapt to Your Needs:** Set your own goals, point systems and rewards to optimize for your own goal-achieving in the interface.

---

## Contributing
Feel free to fork this project, submit pull requests, or customize the Apps Script code to fit your specific habit-building workflow!

> **Note:** This is a personal productivity app tailored to individual tracking systems, but it's easily adaptable to any routine
>           As a result some features may be counter-intuitive. (For example, the rewards in the store can't be saved for later,
>           as I tend to have a bad habit of saving them --which reduces the efficiency of the habits cue-craving-response-reward cycle.)

---

## Version
**Version 1.0: Last Updated September 12, 2026**
