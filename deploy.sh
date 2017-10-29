#!/bin/bash

echo "    [deploy] Started Deployment to github..."

# Build the project. 
# hugo -t redlounge  --buildDrafts # if using a theme, replace by `hugo -t <yourtheme>`

echo "    [deploy] Generating static site to 'public' folder...\n"
hugo  # This will build posts/pages using the theme specified in config.toml that are ready to publish (i.e. draft=false in the md file)

echo ""

# Go To Public folder
cd public
# Add changes to git.
git add -A

echo "    [deploy] Committing the changes to local repo..."
# Commit changes.
# Note: DO NOT remove the spaces on both sides of = operator (otherwise bash will consider it as two comamnds)
msg="Rebuilt the site and publishing to GitHub `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push source and build repos.
echo "    [deploy] Pushing the changes to remote..."
git push origin master

# Come Back
cd ..

echo "    [deploy] Done Deployment to github..."