#!/bin/sh
set -eu

mkdir -p /app/data

# The Railway volume at /app/data is typically root-owned. Stay root so SQLite
# can create maisonora.db / WAL files. Wait briefly if the mount is not ready.
i=0
while [ "$i" -lt 40 ]; do
  if touch /app/data/.rwtest 2>/dev/null; then
    rm -f /app/data/.rwtest
    break
  fi
  i=$((i + 1))
  echo "[boot] waiting for writable /app/data ($i)"
  sleep 0.25
done

if ! touch /app/data/.rwtest 2>/dev/null; then
  echo "[boot] /app/data is not writable; SQLite will fail"
else
  rm -f /app/data/.rwtest
fi

echo "[boot] /app/data ready"
ls -la /app/data || true

exec node server.js
