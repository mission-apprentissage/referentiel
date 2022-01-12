#!/usr/bin/env bash
set -euo pipefail

function start_nginx() {
  nginx &
  echo $! >/var/run/nginx.pid
}

function stop_nginx() {
  nginx -s quit
}

mkdir -p /data
touch /data/error.log
touch /data/access.log

# Put tail in background and wait forever unless a signal is trapped
# More information :
# https://medium.com/@gchudnov/trapping-signals-in-docker-containers-7a57fdda7d86
# https://stackoverflow.com/a/49511035/122975
start_nginx
trap stop_nginx QUIT
tail -f /data/*.log &
wait $!
