#!/usr/bin/env bash
set -euo pipefail

shopt -s nullglob
rdf_files=(/data/*.ttl /data/*.nt /data/*.nq)

if (( ${#rdf_files[@]} == 0 )); then
  echo "No RDF files found in /data. Add .ttl, .nt, or .nq files to demo/rdf." >&2
  exit 1
fi

index_arguments=()
for rdf_file in "${rdf_files[@]}"; do
  index_arguments+=(--kg-input-file "$rdf_file")
done

IndexBuilderMain --index-basename /index/demo "${index_arguments[@]}"
exec ServerMain \
  --index-basename /index/demo \
  --port 7001 \
  --num-simultaneous-queries 4 \
  --memory-max-size 2G \
  --cache-max-size 1G \
  --cache-max-size-single-entry 256M
