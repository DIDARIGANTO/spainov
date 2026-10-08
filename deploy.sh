#!/usr/bin/env bash
# Build with the GitHub Pages base path and publish dist/ to the gh-pages branch.
set -e
VITE_BASE=/spainov/ npm run build
touch dist/.nojekyll
rm -rf /tmp/spainov-pages
git worktree prune
git branch -D gh-pages >/dev/null 2>&1 || true
git worktree add -q --detach /tmp/spainov-pages
pushd /tmp/spainov-pages >/dev/null
git checkout -q --orphan gh-pages
git rm -rfq .
cp -R "$OLDPWD/dist/." .
git add -A
git commit -q -m "Deploy site"
git push -q -f origin gh-pages
popd >/dev/null
git worktree remove --force /tmp/spainov-pages
echo "Deployed: https://didariganto.github.io/spainov/"
