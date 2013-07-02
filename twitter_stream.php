<?php

require './vendor/autoload.php';
$client = new Elastica\Client(array(
	'url' => 'http://localhost:9200/',
));
$chat_type = $client->getIndex('cw')->getType('chat');


$consumer_key       = 'IoatSl870Tb4E4VgIk9A';
$consumer_secret    = 'cJzqoHVjn4MwlTy4GTgfJEjFWmzD5a9Wa5HZ1YDCWU';
$oauth_token        = '55829681-SPnZFSTwgf45IJL4mgSjmr4JbI5O4Z1iMPQcs7io';
$oauth_token_secret = '5xgShaENvPktCylBFMavFt1BK12QZDrPZVxpDyUcs';

$url = 'https://stream.twitter.com/1.1/statuses/filter.json';

$method = 'GET';

$post_parameters = array(
);
$get_parameters = array(
    'locations' => '132.2,29.9,146.2,39.0,138.4,33.5,146.1,46.20',
);
$oauth_parameters = array(
    'oauth_consumer_key' => $consumer_key,
    'oauth_nonce' => microtime(),
    'oauth_signature_method' => 'HMAC-SHA1',
    'oauth_timestamp' => time(),
    'oauth_token' => $oauth_token,
    'oauth_version' => '1.0',
);

$a = array_merge($oauth_parameters, $post_parameters, $get_parameters);
ksort($a);
$base_string = implode('&', array(
    rawurlencode($method),
    rawurlencode($url),
    rawurlencode(str_replace('+', '%20', http_build_query($a, '', '&')))
));
$key = implode('&', array(rawurlencode($consumer_secret), rawurlencode($oauth_token_secret)));
$oauth_parameters['oauth_signature'] = base64_encode(hash_hmac('sha1', $base_string, $key, true));
 
 
// 接続＆データ取得
// $fp = stream_socket_client("ssl://stream.twitter.com:443/"); でもよい
$fp = fsockopen("ssl://stream.twitter.com", 443);
if ($fp) {
    fwrite($fp, "GET " . $url . ($get_parameters ? '?' . http_build_query($get_parameters) : '') . " HTTP/1.0\r\n"
                . "Host: stream.twitter.com\r\n"
                . 'Authorization: OAuth ' . str_replace('+', '%20', http_build_query($oauth_parameters, '', ','))  . "\r\n"
                . "\r\n");
    while (!feof($fp)) {
        $tweet = json_decode(fgets($fp));
        $data = array(
            'message' => $tweet->text,
            'rid' => rand(1, 30),
            'aid' => rand(1, 50),
            'create_date' => date('Y-m-d H:i:s')
        );
        $chat_type->addDocument(new Elastica\Document('', $data));

		echo print_r($data, true);
    }
    fclose($fp);
}
