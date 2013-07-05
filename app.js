$(function() {
	var ChatModel = Backbone.Model.extend({
		defaults: function() {
			return {
				aid: null,
				rid: null,
				message: null
			};
		}
	});
	
	var ChatCollection = Backbone.Collection.extend({
		url: './api/search.php',
		model: ChatModel,
		parse: function(response) {
			return response.data;
		}
	});
	
	var AppView = Backbone.View.extend({
		el: '#container',
		initialize: function() {
			var chat_collection = new ChatCollection({});
			chat_collection.fetch({
				success: function(collection) {
					var view = new ChatListView({collection: collection});
					view.render();
				},
				error: function(err) {
					console.log(err);
				}
			});
		}
	});
	
	var FormView = Backbone.View.extend({
		submit: function() {
		}
	});
	var SearchChatFormView = FormView.extend({
		el: '#search-form',
		render: function() {
			return this;
		},
		submit: function() {
		}
	});
	var DeleteChatFormView = Backbone.View.extend({
		el: '#delete-form',
		events: {
			'click #delete-btn': 'deleteSubmit'
		},
		render: function() {
			return this;
		},
		submit: function() {
			var model = new ChatModel({id: this.id});
			model.destroy();
		}
	});
	var ChatListView = Backbone.View.extend({
		el: '#chat-list',
		
		/**
		 * @type ChatCollection
		 */
		collection: null,
		
		render: function() {
			if (! this.collection) {
				return this;
			}
			
			var view_data_list = [];
			var template = $('#chat-list-template').html();
			
			var html = '';
			this.collection.each(function(model, index) {
				html += _.template(template, model.attributes);
			});
			this.$('ul').html(html);
			return this;
		}
	});
	
	var app = new AppView();
	
//    var search = function() {
//        var url = './api/search.php?' + $('#search-form').find('input,textarea').serialize();
//        $.ajax({
//            url: url,
//            type: 'GET',
//            success: function(response) {
//                var chat_list = response.data;
//                var html = '<ul>';
//                for(var i = 0, len = chat_list.length; i < len; i++) {
//                    var chat = chat_list[i];
//                    html +=
//                        '<li>' +
//                        '<b>(id, aid, rid) = (' + chat._id + ', ' + chat.aid + ', ' + chat.rid + ')</b>:&nbsp;' + chat.message +
//                        '</li>';
//                }
//                html += '</ul>';
//                $('#chat-list').html(html);
//                $('#chat-count').text(response.count || 0);
//                $('#chat-response-time').text(response.time || 0);
//            },
//            error: function(err) {
//                console.log(err);
//            }
//        });
//    };
//    
//    $('#search-btn').click(function() {
//        search();
//    });
//    
//    $('#delete-btn').click(function() {
//        var delid = $('#delete-chat-id').val();
//        if (! delid) {
//            return;
//        }
//        var url = './api/delete.php?id=' + delid;
//        $.ajax({
//            url: url,
//            type: 'GET',
//            success: function() {
//                search();
//            },
//            error: function(err) {
//                console.log(err);
//            }
//        });
//    });
//    
//    search();
});
