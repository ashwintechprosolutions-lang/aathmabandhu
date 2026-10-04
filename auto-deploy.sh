#!/bin/bash
# Polls origin/main and deploys new commits automatically. Run via cron (see
# /etc/cron.d/atmabandhu-deploy). Only restarts/rebuilds the parts that actually
# changed. Does NOT run database migrations - those still need to be applied by
# hand before/alongside a commit that needs them (see the agent .md §7).
set -e
cd /opt/atmabandhu
LOG=/opt/atmabandhu/deploy.log

BEFORE=$(git rev-parse HEAD)
git fetch origin main --quiet
AFTER=$(git rev-parse origin/main)

if [ "$BEFORE" = "$AFTER" ]; then
  exit 0
fi

{
echo "=== $(date -u '+%Y-%m-%d %H:%M:%S UTC') deploying $BEFORE -> $AFTER ==="
git merge origin/main --ff-only --quiet

CHANGED=$(git diff --name-only "$BEFORE" "$AFTER")
echo "Changed files:"
echo "$CHANGED" | sed 's/^/  /'

BACKEND_CHANGED=false; WEB_CHANGED=false
BACKEND_DEPS_CHANGED=false; WEB_DEPS_CHANGED=false
echo "$CHANGED" | grep -q '^backend/' && BACKEND_CHANGED=true
echo "$CHANGED" | grep -q '^web-src/' && WEB_CHANGED=true
echo "$CHANGED" | grep -qE '^backend/(package\.json|package-lock\.json)$' && BACKEND_DEPS_CHANGED=true
echo "$CHANGED" | grep -qE '^web-src/(package\.json|package-lock\.json)$' && WEB_DEPS_CHANGED=true

if [ "$BACKEND_CHANGED" = true ]; then
  echo "-- backend changed --"
  chown -R atmabandhu:atmabandhu backend
  if [ "$BACKEND_DEPS_CHANGED" = true ]; then
    echo "-- backend deps changed, npm install --"
    free -h
    (cd backend && sudo -u atmabandhu npm install --omit=dev --no-audit --no-fund)
    free -h
  fi
  systemctl restart atmabandhu-backend
  sleep 2
  if systemctl is-active --quiet atmabandhu-backend; then
    echo "backend restarted OK"
  else
    echo "!!! WARNING: backend not active after restart - check: journalctl -u atmabandhu-backend -n 50"
  fi
fi

if [ "$WEB_CHANGED" = true ]; then
  echo "-- web-src changed --"
  chown -R atmabandhu:atmabandhu web-src
  if [ "$WEB_DEPS_CHANGED" = true ]; then
    echo "-- web deps changed, npm install --"
    free -h
    (cd web-src && sudo -u atmabandhu npm install --no-audit --no-fund)
    free -h
  fi
  echo "-- building web app --"
  (cd web-src && sudo -u atmabandhu npm run build)
  rm -rf web/*
  cp -r web-src/dist/* web/
  chown -R www-data:www-data web
  echo "web app rebuilt and published"
fi

echo "=== deploy complete $(date -u '+%Y-%m-%d %H:%M:%S UTC') ==="
echo
} >> "$LOG" 2>&1
