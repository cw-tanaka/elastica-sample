<?php
require_once '../vendor/autoload.php';

$param_key = array(
	'message',
	'aid'    ,
	'rid'    ,
);

$param = array();
foreach ($param_key as $key) {
	if (empty($_SERVER[$key]) {
		return;
	}
	$param[$key] = $_SERVER[$key];
}



$client = new Elastica\Client(array(
	'url' => 'http://localhost:9200/',
));
$chat_type = $client->getIndex('cw')->getType('chat');

$chat = array(
	'message' => $param['message'],
	'rid' => (int) $param['rid'],
	'aid' => (int) $param['aid'],
	'create_date' => date('Y-m-d H:i:s');
);

$chat_type->addDocument($chat);


