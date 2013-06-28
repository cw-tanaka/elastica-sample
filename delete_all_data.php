<?php

require './vendor/autoload.php';

$client = new Elastica\Client(array(
	'url' => 'http://localhost:9200/',
));


// Load index
$chat_type = $client->getIndex('cw')->getType('chat');

// delete all data
$query = new Elastica\Query\MatchAll();
$result_set = $chat_type->search($query);
$ids = array();

echo "Collect exists data";
while ($result = $result_set->current()) {
	$ids[] = $result->getId();
	$result_set->next();
	echo ".";
}
echo "\n";

if (!empty($ids)) {
	echo "Found " . count($ids) . " data. Deleting these data. \n";
	$chat_type->deleteIds($ids);
}


