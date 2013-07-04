<?php
$testdata_file = $argv[1];
if (!file_exists($testdata_file)) {
	echo "Not found $testdata_file\n";
	exit;
}

require './vendor/autoload.php';
$client = new Elastica\Client(array(
	'url' => 'http://localhost:9200/',
));
$client->setConfig(array('log' => true));
$client->setConfig(array('timeout' => 10));
$client->setConfig(array('connections' => array(
    'timeout' => 10
)));
$chat_type = $client->getIndex('cw')->getType('chat');

$fp = fopen($testdata_file, 'r');
if ($fp) {
    $documents = array();
    while (!feof($fp)) {
        $text = fgets($fp);
        if (!isset($text)) {
            continue;
        }
        $data = array(
            'message' => $text,
            'rid' => rand(1, 30),
            'aid' => rand(1, 50),
            'create_date' => date('Y-m-d H:i:s')
        );
        $documents[] = new Elastica\Document('', $data);
        echo print_r($data, true);
        if (count($documents) >= 20) {
            break;
        }
    }
    if (count($documents) > 0) {
        echo "Trying to put documents.....\n";
        try {
            $start_time = microtime(true);
            $chat_type->addDocuments($documents);
            $end_time = microtime(true);

            echo "###### Time : " . ($end_time - $start_time) . "\n";
            echo "###### (insert " . count($documents) . " data) \n";
        } catch (\Exception $e) {
            echo $e . "\n";
        }
    }
    fclose($fp);
}
