<?php

function request($path, $page = 0) {
    $limit = 100;

    $qs = http_build_query([
        'limit' => $limit,
        'offset' => $limit * $page
    ]);

    $url = 'https://ergast.com/api/f1/'.$path.'.json?'.$qs;

    var_dump($url);

    $h = curl_init($url);

    curl_setopt_array($h, [
        CURLOPT_HEADER => false,
        CURLOPT_RETURNTRANSFER => true
    ]);

    return curl_exec($h);
}
