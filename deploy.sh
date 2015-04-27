#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

# Build the project. 
hugo -t redlounge  --buildDrafts # if using a theme, replace by `hugo -t <yourtheme>`

# hugo -t redlounge  # This will build only posts/pages that are ready to publish (i.e. draft=false in the md file)

# Go To Public folder
cd public
# Add changes to git.
git add -A

# Commit changes.
msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push source and build repos.
git push origin master

# Come Back
cd ..