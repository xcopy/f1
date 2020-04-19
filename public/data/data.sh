#!/bin/bash

while getopts ":s:r:l:" opt; do
    case "${opt}" in
        s*)
            s=${OPTARG}
            ;;
        r*)
            r=${OPTARG}
            ;;
        l*)
            l=${OPTARG}
            ;;
    esac
done
shift $((OPTIND-1))

dir="./$s/$r"
file="$dir/laps.json"
mkdir "$dir" -p
touch "$file"

arr=()

for lap in $(seq 1 "${l}");
do
  url="http://ergast.com/api/f1/$s/$r/laps/$lap.json"
  response="$(curl "$url")"
  arr+=("$(jq '.MRData.RaceTable.Races[0].Laps[0]' <<< "$response")")
done

out=$(jq -s '' <<< "${arr[@]}")
echo "$out" > "$file"
