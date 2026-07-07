/**
 * Google Drive Recursive Folder Synchronization Engine
 * GitHub Repository: https://github.com/M-Sugiarto
 * License: MIT
 */

function autoSyncSharedFolder() {
  // CONFIGURATION: Replace these placeholders with your actual folder IDs
  const SHARED_FOLDER_ID = "YOUR_SHARED_FOLDER_ID_HERE";
  const MY_DRIVE_TARGET_FOLDER_ID = "YOUR_TARGET_FOLDER_ID_HERE";
  
  const srcFolder = DriveApp.getFolderById(SHARED_FOLDER_ID);
  const destFolder = DriveApp.getFolderById(MY_DRIVE_TARGET_FOLDER_ID);
  
  let logEntries = [];
  let timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  
  console.log("Starting recursive synchronization engine...");
  
  // Start the deep traversal across all nested folder and file hierarchies
  traverseAndCopy(srcFolder, destFolder, logEntries, timestamp);
  
  // Audit Management: Compile and force save to log.txt inside the root target folder
  const logFileName = "log.txt";
  let executionSummary = `[${timestamp}] Sync Engine Run Completed.\n`;
  
  if (logEntries.length > 0) {
    executionSummary += logEntries.join("\n") + "\n";
  } else {
    executionSummary += `[${timestamp}] System Note: No new files or directories required replication during this run.\n`;
  }
  
  const existingLogFiles = destFolder.getFilesByName(logFileName);
  let logFile;
  
  if (existingLogFiles.hasNext()) {
    logFile = existingLogFiles.next();
    let currentContent = logFile.getAs("text/plain").getDataAsString();
    logFile.setContent(currentContent + "=======================================\n" + executionSummary);
  } else {
    destFolder.createFile(logFileName, executionSummary, MimeType.PLAIN_TEXT);
  }
  
  console.log("Sync engine execution finished successfully.");
}

/**
 * Recursive helper function that traverses the source directory tree,
 * mirrors the folder architecture, and replicates missing files.
 */
function traverseAndCopy(currentSrcFolder, currentDestFolder, logEntries, timestamp) {
  
  // 1. Scan and duplicate files at the current directory level
  const existingFilesSet = new Set();
  const destFiles = currentDestFolder.getFiles();
  while (destFiles.hasNext()) {
    existingFilesSet.add(destFiles.next().getName());
  }
  existingFilesSet.delete("log.txt"); // Prevent log file from checking itself
  
  // Filter out shortcuts and subfolders from the file search loop
  const filesQuery = "trashed = false and mimeType != 'application/vnd.google-apps.folder' and mimeType != 'application/vnd.google-apps.shortcut'";
  const srcFiles = currentSrcFolder.searchFiles(filesQuery);
  
  while (srcFiles.hasNext()) {
    const file = srcFiles.next();
    const fileName = file.getName();
    
    // Only duplicate if the file does not already exist in this specific destination folder
    if (!existingFilesSet.has(fileName)) {
      try {
        file.makeCopy(fileName, currentDestFolder);
        logEntries.push(`[${timestamp}] FILE SUCCESS: Copied "${fileName}" into directory "${currentDestFolder.getName()}"`);
      } catch (err) {
        logEntries.push(`[${timestamp}] FILE FAILED: Could not copy "${fileName}". Reason: ${err.message}`);
      }
    }
  }
  
  // 2. Scan for child folders and mirror the directory architecture downward
  const subFolders = currentSrcFolder.getFolders();
  while (subFolders.hasNext()) {
    const subFolder = subFolders.next();
    const subFolderName = subFolder.getName();
    
    // Look for an existing folder with the same name in our local target directory
    const existingDestFolders = currentDestFolder.getFoldersByName(subFolderName);
    let targetSubFolder;
    
    if (existingDestFolders.hasNext()) {
      targetSubFolder = existingDestFolders.next();
    } else {
      // Mirror and create the missing folder structure locally
      try {
        targetSubFolder = currentDestFolder.createFolder(subFolderName);
        logEntries.push(`[${timestamp}] FOLDER STRUCT: Created nested directory "${subFolderName}" inside "${currentDestFolder.getName()}"`);
      } catch (err) {
        logEntries.push(`[${timestamp}] FOLDER FAILED: Could not create folder "${subFolderName}". Reason: ${err.message}`);
        continue; // Skip traversing this subfolder if creation fails
      }
    }
    
    // Recurse deeply into the next level of the subfolder tree
    traverseAndCopy(subFolder, targetSubFolder, logEntries, timestamp);
  }
}