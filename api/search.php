<?php
require_once '../vendor/autoload.php';

$param_key = array(
	'message',
	'aid'    ,
	'rid'    ,
);

$param = array();
foreach ($param_key as $key) {
	if (isset($_GET[$key])) {
		$param[$key] = $_GET[$key];
	}
}

$client = new Elastica\Client(array(
	'url' => 'http://localhost:9200/',
));
$chat_type = $client->getIndex('cw')->getType('chat');

// create search parameter
$query = new Elastica\Query\MatchAll();

$filter = new Elastica\Filter\BoolAnd();
$filter_list = array();

if (! empty($param['message'])) {
	$chat_filter = new Elastica\Filter\Term();
	$chat_filter->setTerm('message', $param['message']);
	$filter_list[] = $chat_filter;
}

if (! empty($param['rid'])) {
	$rid_filter = new Elastica\Filter\Terms();
	$rid = explode(',', $param['rid']);
	$rid_filter->setTerms('rid', $rid);
	$filter_list[] = $rid_filter;
}

if (! empty($param['aid'])) {
	$aid_filter = new Elastica\Filter\Terms();
	$aid = explode(',', $param['aid']);
	$aid_filter->setTerms('aid', $aid);
	$filter_list[] = $aid_filter;
}

if (!empty($filter_list)) {
	$filter->setFilters($filter_list);
	$query = new Elastica\Query\Filtered($query, $filter);
}

$query = new Elastica\Query($query);
$query->setSort(array(array('create_date' => array('order' => 'desc'))));
$query->setSize(5000);

$response = array();
try {
	$start_time = microtime(true);
	$result_set = $chat_type->search($query);
	$end_time = microtime(true);
	
	$data = array();
	while ($result = $result_set->current()) {
		$d = $result->getSource();
		$d['_id'] = $result->getId();
		$data[] = $d;
		$result_set->next();
	}
	$response['count'] = $result_set->count();
	$response['data'] = $data;
	$response['time'] = $end_time - $start_time;
} catch (\Exception $e) {
	header("HTTP/1.1 500 Internal Server Error");
	$response['message'] = $e->__toString();
}

header("Content-Type: application/json; charset=utf-8");
echo json_encode($response);

