# Google Drive Recursive Folder Synchronization Engine

A high-performance, enterprise-grade Google Apps Script designed to recursively mirror a shared Google Drive folder structure into a personal target folder. It operates incrementally, ensuring that only newly added files or directories are replicated to conserve runtime quotas and storage footprint.

## Features

- **Recursive Traversal:** Maps the entire nested folder tree architecture of a source directory and automatically creates missing subfolders in the target destination.
- **Incremental Execution:** Evaluates existing files using high-performance O(1) JavaScript `Set` lookups. Existing assets are skipped instantly, and only new files are duplicated.
- **Error Trapping & Resilience:** Includes robust error handling to catch permission restrictions (e.g., download-disabled viewer files) and continues execution without crashing.
- **Compliance Audit Logging:** Generates and appends execution results directly to a localized `log.txt` file inside the root target directory for transaction visibility.

## Configuration & Usage

1. Open [script.google.com](https://script.google.com/) and create a new project.
2. Copy the code from `sync-engine.js` into your editor.
3. Replace the placeholder IDs with your unique Google Drive alphanumeric folder strings:
   ```javascript
   const SHARED_FOLDER_ID = "YOUR_SHARED_FOLDER_ID";
   const MY_DRIVE_TARGET_FOLDER_ID = "YOUR_TARGET_FOLDER_ID";