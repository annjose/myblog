+++
date = "2024-10-31T10:11:46-07:00"
draft = true
title = "Bluesky Draft Posts"
+++

### DRAFT for 16 Nov 2024
Let's say you have a regular website with some content (a few blog posts or pages) and you want to implement full-text-search.
You know, the fancy flow where the user presses a hotkey (Cmd-K) and types in a search term. And your website shows a simple page with the search results - each result shows the title of the post, highlights the search terms and shows a snippet of the content.

Do you know what it takes to do this? Just three things:
    1) an SQLite file with a table `posts` with all the data
    2) The following search queries and 
    3) simple HTML to render the results of this query in the search results page. 

That's it! This is the FTS (Full Text Search) built into SQLite by default. Batteries included. 
- No need to install any extension.
- No need to use a heavyweight client-server database. 
- No need to implement any complex business logic in the application layer. 

Simple is beautiful ❤️. Simple is powerful 💪.

``` sql
CREATE VIRTUAL TABLE posts_fts USING fts5 (
	title,
	description,
	body,
	content = 'blog_posts',
	content_rowid = 'id'
);

INSERT INTO posts_fts(posts_fts) VALUES('rebuild');

-- check if the data has propagated from content table to FTS table.
SELECT rowid, title FROM posts_fts;

-- run the search query - this example assumes the serach term 'building'
SELECT rowid,
	   highlight(posts_fts, 0, '<mark>', '</mark>') as title_highlighted,
	   highlight(posts_fts, 1, '<mark>', '</mark>') as desc_highlighted,
	   snippet(posts_fts, 2, '<mark>', '</mark>', '...', 64) as body_highlighted
	FROM posts_fts
	WHERE posts_fts MATCH 'building'
	ORDER by rank;
```

As a bonus, you can keep the data in the FTS table (posts_fts) in sync with the content table (blog_posts) using three triggers - after INSERT, DELETE and UPDATE. See below ...