#!/usr/bin/php
<?php

require 'request.php';

['y' => $year] = getopt('y:');

$years = is_array($year) ? $year : [$year];

foreach ($years as $year) {
    fwrite(STDOUT, "--- $year ---\n");

    $season = request($year.'/results/1');
    $races = json_decode($season)->MRData->RaceTable->Races;
    $baseDir = __DIR__ . "/../api/f1/$year";

    // @mkdir($baseDir.'/results', 0755, true);

    /*
    if (!file_exists($baseDir.'/results/1.json')) {
        fwrite(STDOUT, "- results\n");
        file_put_contents($baseDir.'/results/1.json', $season);
    }

    if (!file_exists($baseDir.'/driverStandings.json')) {
        fwrite(STDOUT, "- driver standings\n");
        file_put_contents($baseDir.'/driverStandings.json', request($year.'/driverStandings'));
    }

    if (!file_exists($baseDir.'/constructorStandings.json')) {
        fwrite(STDOUT, "- constructor standings\n");
        file_put_contents($baseDir.'/constructorStandings.json', request($year.'/constructorStandings'));
    }
    */

    foreach ($races as $race) {
        $round = $race->round;
        $roundDir = "$baseDir/$round";

        fwrite(STDOUT, "--- round $round ---\n");

        is_dir($roundDir) or mkdir($roundDir, 0755, true);

        /*
        foreach (['results', 'qualifying', 'pitstops'] as $path) {
            $file = $roundDir.'/'.$path.'.json';

            if (!file_exists($file)) {
                fwrite(STDOUT, "- {$path}\n");
                file_put_contents($file, request($year.'/'.$round.'/'.$path));
            }
        }
        */

        $lapsFile = $roundDir.'/laps.json';

        if (!file_exists($lapsFile)) {
            fwrite(STDOUT, "--- laps ---\n");
            fwrite(STDOUT, "- lap 1\n");

            $laps = json_decode(request("$year/$round/laps/1"));

            for ($i = 2; $i <= $race->Results[0]->laps; $i++) {
                fwrite(STDOUT, "- lap $i\n");

                $response = json_decode(request("$year/$round/laps/$i"));

                $lap = $response->MRData?->RaceTable?->Races[0]?->Laps[0];
                $lap and $laps->MRData->RaceTable->Races[0]->Laps[] = $lap;
            }

            file_put_contents($lapsFile, json_encode($laps));
        }
    }
}
