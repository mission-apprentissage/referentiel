#!/usr/bin/env bash
set -euo pipefail

LWS_PID=0

function stop_server() {
  kill $LWS_PID
}

function start_server() {
  #FIXME why ws command do not respond to signals sent by Docker
  ws --port 3000 -d /site --log.format dev --spa index.html &
  LWS_PID="$!"
}

start_server
trap stop_server TERM
wait $LWS_PID
