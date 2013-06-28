<?php
require_once '../vendor/autoload.php';

$param_key = array(
	'message'   ,
	'aid'       ,
	'rid'       ,
	'date_from' ,
	'date_to'   ,
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

if (! empty($param['date_from']) || ! empty($param['date_to'])) {
	$date_param = array();
	if (! empty($param['date_from'])) {
		$date_param["gte"] = date("Y-m-d H:i:s", strtotime($param['date_from']));
	}
	if (! empty($param['date_to'])) {
		$date_param["lte"] = date("Y-m-d H:i:s", strtotime($param['date_to']));
	}
	
	$date_filter = new Elastica\Filter\NumericRange("create_date", $date_param);
	$filter_list[] = $date_filter;
}

if (!empty($filter_list)) {
	$filter->setFilters($filter_list);
	$query = new Elastica\Query\Filtered($query, $filter);
}

$query = new Elastica\Query($query);
$query->setSort(array(array('create_date' => array('order' => 'desc'))));
$query->setSize(5000);

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

$response = array(
	'count'=> $result_set->count(),
	'data' => $data,
	'time' => $end_time - $start_time,
);

header("Content-Type: application/json; charset=utf-8");
echo json_encode($response);

