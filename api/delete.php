<?php
require_once '../vendor/autoload.php';

if (! isset($_GET['id'])) {
	echo "id is required";
	return;
}

$id = $_GET['id'];

$client = new Elastica\Client(array(
	'url' => 'http://localhost:9200/',
));
$chat_type = $client->getIndex('cw')->getType('chat');
$response = $chat_type->deleteById($id);
