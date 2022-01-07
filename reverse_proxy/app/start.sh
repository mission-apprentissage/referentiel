#!/usr/bin/env bash
set -euo pipefail

function stop_nginx() {
  nginx -s quit
}
trap stop_nginx QUIT

mkdir -p /data
touch /data/error.log
touch /data/access.log

nginx &
echo $! >/var/run/nginx.pid

# Put tail in background and wait forever unless a signal is trapped
# More information :
# https://medium.com/@gchudnov/trapping-signals-in-docker-containers-7a57fdda7d86
# https://stackoverflow.com/a/49511035/122975
tail -f /data/*.log &
wait $!
