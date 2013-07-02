<html>
	<head>
		<title></title>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
<script>
$(function() {
	var search = function() {
		var url = './api/search.php?' + $('#search-form').find('input,textarea').serialize();
		$.ajax({
			url: url,
			type: 'GET',
			success: function(response) {
				var chat_list = response.data;
				var html = '<ul>';
				for(var i = 0, len = chat_list.length; i < len; i++) {
					var chat = chat_list[i];
					html +=
						'<li>' +
						'<b>(id, aid, rid) = (' + chat._id + ', ' + chat.aid + ', ' + chat.rid + ')</b>:&nbsp;' + chat.message +
						'</li>';
				}
				html += '</ul>';
				$('#chat-list').html(html);
				$('#chat-count').text(response.count || 0);
			},
			error: function(err) {
				console.log(err);
			}
		});
	};
	
	$('#search-btn').click(function() {
		search();
	});
	
	$('#delete-btn').click(function() {
		var delid = $('#delete-chat-id').val();
		if (! delid) {
			return;
		}
		var url = './api/delete.php?id=' + delid;
		$.ajax({
			url: url,
			type: 'GET',
			success: function() {
				search();
			},
			error: function(err) {
				console.log(err);
			}
		});
	});
	
	search();
});
</script>
	</head>
	<body>
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
		</div>
		<div id="chat-list">
		</div>
	</body>
</html>

