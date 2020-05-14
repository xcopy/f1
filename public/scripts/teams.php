#!/usr/bin/php
<?php

require 'request.php';

$filename = '../api/f1/constructors.json';

fwrite(STDOUT, "- page 0\n");

$response = json_decode(request('constructors'));

$pages = ceil((int) $response->MRData->total / 100);

if (!file_exists($filename)) {
    for ($i = 1; $i < $pages; $i++) {
        fwrite(STDOUT, "- page {$i}\n");

        $data = json_decode(request('constructors', $i))->MRData;

        foreach ($data->ConstructorTable->Constructors as $constructor) {
            array_push($response->MRData->ConstructorTable->Constructors, $constructor);
        }
    }

    file_put_contents($filename, json_encode($response));
}
