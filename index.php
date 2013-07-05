<html>
	<head>
		<title></title>
	</head>
	<body>
		<div id="container">
			<h3>Search Chat</h3>
			<div id="search-form">
				<ul>
					<li>
						<label for="se-message">Chat</label>
						<input class="param" id="se-message" name="message"></input>
					</li>
					<li>
						<label for="se-rid">RoomId</label>
						<input class="param" type="text" id="se-rid" name="rid"></input>
					</li>
					<li>
						<label for="se-aid">UserId</label>
						<input class="param" type="text" id="se-aid" name="aid"></input>
					</li>
				</ul>
				<button id="search-btn">search</button>
			</div>
			<div id="delete-form">
				<h3>Delete Chat</h3>
				ID:<input class="param" id="delete-chat-id"></input>
				<button id="delete-btn">delete</button>
			</div>
			<div id="chat-info">
				<p>Hit: <span id="chat-count">0</span></p>
				<p>Time: <span id="chat-response-time"></span> (msec)</p>
			</div>
			<div id="chat-list">
				<ul></ul>
			</div>
		</div><!-- /#container -->
		<script type="text/template" id="chat-list-template">
			<li>
				<b>(id, aid, rid) = (<%= _id %>, <%= aid %>, <%= rid %>)</b>:&nbsp;
				<%= message %>
			</li>
		</script>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
		<script type="text/javascript" src="//underscorejs.org/underscore.js"></script>
		<script type="text/javascript" src="//backbonejs.org/backbone.js"></script>
		<script type="text/javascript" src="./app.js"></script>
	</body>
</html>

