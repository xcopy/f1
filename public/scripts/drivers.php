#!/usr/bin/php
<?php

require 'request.php';

$filename = '../api/f1/drivers.json';

fwrite(STDOUT, "- page 0\n");

$response = json_decode(request('drivers'));

$pages = ceil((int) $response->MRData->total / 100);

if (!file_exists($filename)) {
    for ($i = 1; $i < $pages; $i++) {
        fwrite(STDOUT, "- page {$i}\n");

        $data = json_decode(request('drivers', $i))->MRData;

        foreach ($data->DriverTable->Drivers as $driver) {
            array_push($response->MRData->DriverTable->Drivers, $driver);
        }
    }

    file_put_contents($filename, json_encode($response));
}
