# Screenshot plan

The frontend routes are registered in `ReactBlog/src/main.jsx`. Screens below use the routes and controls present in the code. Add sample content through Django admin at `/admin/` after creating a superuser. A category and published post are required for a populated feed.

| File name | Screen or page to show | URL/route to open | Steps to reach that state | Sample data to enter so the screen isn't empty | What must be visible in the shot |
|---|---|---|---|---|---|
| `docs/01-home.png` | Home feed with post cards | `http://localhost:5173/` | Create a category and published post in Django admin, then open Home. | Category `Engineering`; title `Building a Django API`; excerpt `A short guide to models and REST endpoints`; add a landscape image. | Header, search box, and at least one full card with title, category, author/date, and image. |
| `docs/02-post-detail.png` | Single post detail | `http://localhost:5173/post/1` (replace `1` with the post ID) | Click a post card's Read more link or open its numeric ID directly. | Reuse the published post and include several paragraphs of content. | Post image, title, category, author/date, and body text. |
| `docs/03-search.png` | Search results | `http://localhost:5173/search?search=Django` | Enter `Django` in the header search and press Enter or click the search icon. | A published post whose title or content includes `Django`. | Search query and matching post card. |
| `docs/04-admin-list.png` | Post management list | `http://localhost:5173/admin` | Open the page after adding a post. If requests fail, first authenticate using a configured OAuth client. | At least one published post with a category and title. | Posts table with ID, category, title, edit/delete actions, and New Post button. |

Capture rules: use a browser window around 1280x720 for every image, keep the window size consistent, and crop out bookmarks and personal information. Optionally record one 10–15 second GIF of the main flow as `docs/demo.gif` (open the feed, search, then open a post). The login and write flows need working OAuth configuration and should not be presented as verified until tested.
