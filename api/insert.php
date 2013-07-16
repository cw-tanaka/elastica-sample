<?php
require_once '../vendor/autoload.php';

$param_key = array(
	'message',
	'userId',
	'rid',
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

$chat = array(
	'message' => $param['message'],
	'rid' => $param['rid'],
	'aid' => $param['userId'],
	'create_date' => date('Y-m-d H:i:s'),
);

try {
	$doc = new Elastica\Document(null, $chat);
	$response = $chat_type->addDocument($doc)->getData();
	$data = $chat;
	$data['id'] = $response['_id'];
	header("Content-Type: application/json; charset=utf-8");
	echo json_encode($data);
} catch (\Exception $e) {
	echo $e->__toString();
}


