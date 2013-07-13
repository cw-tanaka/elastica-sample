<?php
require_once '../vendor/autoload.php';

$param_key = array(
	'message',
	'id',
);

$param = array();
foreach ($param_key as $key) {
	if (empty($_GET[$key])) {
		return;
	}
	$param[$key] = $_GET[$key];
}



$client = new Elastica\Client(array(
	'url' => 'http://localhost:9200/',
));
$chat_type = $client->getIndex('cw')->getType('chat');

try {
	$doc = new Elastica\Document($param['id'], array(
		'message' => $param['message'],
	));
	$chat_type->updateDocument($doc);
} catch (\Exception $e) {
	echo $e->__toString();
}
