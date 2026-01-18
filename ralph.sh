#!/bin/bash
set -e

MAX_ITERATIONS=${1:-5}
SCRIPT_DIR="$(cd "$(dirname \
  "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting Ralph (Claude)"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo "═══ Iteration $i ═══"
  
  OUTPUT=$(claude --dangerously-skip-permissions \
    -p "$(cat "$SCRIPT_DIR/prompt.md")" 2>&1) || true
  echo "$OUTPUT"
  
  if echo "$OUTPUT" | \
    grep -q "<promise>COMPLETE</promise>"
  then
    echo "✅ Done!"
    exit 0
  fi
  
  sleep 2
done

echo "⚠️ Max iterations reached"
exit 1
