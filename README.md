# Raycast Extension for Akkoma

![overview](./assets/command.png)

 
-  [Akkoma](https://akkoma.social/) 
-  [Raycast](https://raycast.com)

**Features**:
- Write status with markdown support.
- Publish simple status with text.
- Publish scheduled status with natural date format.
- Publish status with attachments (image, video, files); add alt text to the image when only one image is attached.
- Save draft status.
- View your bookmarked statuses.
- View your latest statuses.
- Open the latest published status that was published from Raycast through the actions.

## Settings

Input your Akkoma / Pleroma instance's URL, then click the "Continue" button in the bottom-right corner.

<img src="./assets/login.png" alt="login" style="width:700px;">

## Examples:

### Add simple status with text

<img src="./assets/add-simple-status.png" alt="Add simple status with text" style="width:700px;">

### Add scheduled status
<img src="./assets/add-status.png" alt="Add scheduled status" style="width:700px;">

<img src="./assets/add-scheduled-status.png" alt="Add scheduled status" style="width:700px;">

### Add status with image and alt text

<img src="./assets/add-status-alt-text.png" alt="Add status with image and alt text" style="width:700px;">

### View bookmarked status 

<img src="./assets/view-bookmarks.png" alt="Add simple status with text" style="width:700px;">

### View your latest status

<img src="./assets/view-my-status.png" alt="View your latest status" style="width:700px;">

### Mark status as sensitive 
Toggle the "Sensitive" checkbox to mark the attached image as sensitive, or add a content warning to the status.

<img src="./assets/add-cw.png" alt="Mark status as sensitive " style="width:700px;">

### Write status with markdown
Toggle the "Markdown" checkbox to render markdown in the text file. Markdown shortcuts are also supported (e.g., pressing `⌘` + `B` will add `**bold**` around the selected text, `⌘` + `I` will make the selected text italic, etc.).

<img src="./assets/markdown.png" alt="Writing status with markdown" style="width:700px;">

### Draft status 

<img src="./assets/draft-status.png" alt="Draft status" style="width:700px;">
## Available Settings

### Status limit
Based on performance considerations, the number of statuses displayed is limited, with the default being 20. You can adjust this limit in the extension settings.

<img src="./assets/setting-bookmarks.png" alt="bookmark limit" style="width:700px;">

<img src="./assets/setting-status.png" alt="status limit" style="width:700px;">

### Default visibility

<img src="./assets/setting-visibility.png" alt="Default visibility" style="width:700px;">

## Actions 
<img src="./assets/actions.png" alt="actions" style="width:400px;">

## TODO
- [ ] Fork to Mastodon
