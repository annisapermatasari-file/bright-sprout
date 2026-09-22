#!/usr/bin/env bash
# Wraps `prisma migrate deploy` so a Vercel build never fails with P3005
# ("database schema is not empty") on a production DB whose tables were
# created before Prisma's migration history table existed.
#
# On first failure with P3005 it baselines exactly the known pre-existing
# migration (marks it "applied" without re-running its SQL, since those
# tables already exist) and retries. Any other failure still fails the build.
set -euo pipefail

BASELINE_MIGRATION="20260914050027_init"
LOG_FILE="$(mktemp)"

if npx prisma migrate deploy 2>&1 | tee "$LOG_FILE"; then
  exit 0
fi

if grep -q "P3005" "$LOG_FILE"; then
  echo ""
  echo "P3005 detected — baselining pre-existing migration '$BASELINE_MIGRATION' and retrying..."
  npx prisma migrate resolve --applied "$BASELINE_MIGRATION"
  npx prisma migrate deploy
else
  echo "prisma migrate deploy failed for a reason other than P3005 — see log above."
  exit 1
fi
