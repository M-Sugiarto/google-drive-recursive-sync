# Google Drive Recursive Folder Synchronization Engine

A high-performance, enterprise-grade Google Apps Script designed to recursively mirror a shared Google Drive folder structure into a personal target folder. It operates incrementally, ensuring that only newly added files or directories are replicated to conserve runtime quotas and storage footprint.

## Features

- **Recursive Traversal:** Maps the entire nested folder tree architecture of a source directory and automatically creates missing subfolders in the target destination.
- **Incremental Execution:** Evaluates existing files using high-performance O(1) JavaScript `Set` lookups. Existing assets are skipped instantly, and only new files are duplicated.
- **Error Trapping & Resilience:** Includes robust error handling to catch permission restrictions (e.g., download-disabled viewer files) and continues execution without crashing.
- **Compliance Audit Logging:** Generates and appends execution results directly to a localized `log.txt` file inside the root target directory for transaction visibility.

## Configuration & Deployment Guide

Follow these step-by-step instructions to deploy the synchronization engine inside your environment.

### Step 1: Initialize the Script Project
1. Navigate to the centralized Google Apps Script console at [script.google.com](https://script.google.com/).
2. Authenticate with the Google account that owns or has access to your target folder destination.
3. Click the **New Project** button at the top-left corner of the dashboard.
4. Click on the title text **"Untitled project"** at the top, rename your project to `Google Drive Recursive Sync Engine`, and click **Rename**.

### Step 2: Inject and Configure Code Assets
1. Clear out any default placeholder code inside the script editor workspace (e.g., remove the empty `myFunction()` wrapper).
2. Copy the entire source contents of the `sync-engine.js` file from this repository and paste it cleanly into the editor interface.
3. Locate the configuration variables at the top of the file (Lines 9 and 10) and inject your specific alphanumeric Google Drive directory strings within the quotation marks:
   ```javascript
   const SHARED_FOLDER_ID = "PASTE_YOUR_SOURCE_SHARED_FOLDER_ID_HERE";
   const MY_DRIVE_TARGET_FOLDER_ID = "PASTE_YOUR_PERSONAL_TARGET_FOLDER_ID_HERE";
   ```
4. Commit your changes by clicking the **Save Project** disk icon located on the top toolbar menu (or press `Ctrl + S` / `Cmd + S`).

### Step 3: Execute Manual Run & Grant Security Scopes
Because this engine interfaces with your file system to read, write, replicate assets, and compile logs, Google's Identity and Access Management (IAM) requires explicit authorization approval.

1. Ensure the function dropdown selector on the top toolbar is pointed directly to **`autoSyncSharedFolder`**.
2. Click the **Run** button (the right-pointing triangle icon).
3. A blocking modal titled **"Authorization Required"** will appear. Click **Review Permissions**.
4. Choose your active Google Account profile on the subsequent prompt window.
5. A safety warning banner will state that Google hasn't verified this app (this is standard for custom internal scripts). Click **Advanced** at the bottom-left of the modal.
6. Click the hyperlink text **"Go to Google Drive Recursive Sync Engine (unsafe)"** to bypass the validation flag.
7. Review the permission scopes requested (allowing the script to see, edit, create, and delete files in your Google Drive). Click **Allow** to finalize the authentication token.
8. The execution will begin immediately. You can review live transaction outputs inside the **Execution Log** view panel at the bottom of the editor.

### Step 4: Automate via Scheduled Time-Driven Triggers
To transform this script into an independent, hands-off engine that replicates folder changes on an automated cycle:

1. Navigate to the left vertical menu panel inside the Apps Script interface and click the **Triggers** icon (represented by an alarm clock symbol).
2. Click the blue **+ Add Trigger** button located at the lower-right margin of the screen.
3. Configure the orchestration rules precisely as follows:
   - **Choose which function to run:** `autoSyncSharedFolder`
   - **Choose which deployment should run:** `Head`
   - **Select event source:** `Time-driven`
   - **Select type of time-based trigger:** `Day timer` (or `Hour timer` for high-frequency updates)
   - **Select time of day:** Choose your target synchronization window (e.g., `17.00 to 18.00` / 5 PM Jakarta time).
4. Click **Save** to activate the automation daemon.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
