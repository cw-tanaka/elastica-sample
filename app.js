(function($) {
	
	/*
	 * Extend Underscore
	 */
	_.extend(_, {
		
		/**
		 * @namespace
		 */
		compactObject: function (obj) {
			var ret = {};
			_.each(obj, function (val, key) {
				if (val) {
					ret[key] = val;
				}
			});
			return ret;
		}
	});
	
	/*
	 * Model
	 */
	
	var ChatModel = Backbone.Model.extend({
		defaults: function() {
			return {
				aid: null,
				rid: null,
				message: null
			};
		},
		
		validate: function() {
			if (! this.get('id')) {
				return 'Cannot set id';
			}
		},
		
		sync: function(method, model, options) {
			//TODO: RESTful API
			if (method === "delete") {
				this.url = "./api/delete.php"
			}
			
			method = "read";
			Backbone.sync(method, model, options);
		}
	});
	
	/*
	 * Collection
	 */
	
	var ChatCollection = Backbone.Collection.extend({
		url: './api/search.php',
		model: ChatModel,
		parse: function(response) {
			return response.data;
		},
		search: function(params, options) {
			_.isObject(params) || (params = {});
			params = _.pick(params || {}, [
				'aid',
				'rid',
				'message'
			]);
			
			options = _.defaults({}, options);
			
			this.fetch({
				data: $.param(params),
				success: _.bind(function(collection) {
					this.reset(collection.models);
					_.isFunction(options.success) && options.success.apply(this, arguments);
				}, this),
				error: _.bind(function(err) {
					_.isFunction(options.error) && options.error.apply(this, arguments);
				}, this)
			});
		}
	});
	
	
	/*
	 * View
	 */
	
	var AppView = Backbone.View.extend({
		el: '#container',
		
		view: {},
		
		initialize: function() {
			// Render init view
			var chat_collection = new ChatCollection({});
			chat_collection.search(null, {
				success: function(collection) {
					var view = new ChatListView({collection: collection});
					view.render();
				},
				error: function(err) {
					console.log(err);
				}
			});
			
			new DeleteChatFormView({collection: chat_collection});
			new SearchChatFormView({collection: chat_collection});
		}
	});
	
	var SearchChatFormView = Backbone.View.extend({
		el: '#search-form',
		
		/**
		 * @type ChatCollection
		 */
		collection: null,
		
		events: {
			'click #search-btn': 'submit'
		},
		
		submit: function() {
			if (! this.collection) {
				return;
			}
			
			var attrs = {};
			this.$('.param').each(function() {
				var $this = $(this);
				attrs[$this.attr('name')] = $this.val();
			});
			this.collection.search(attrs);
		}
	});
	
	var DeleteChatFormView = Backbone.View.extend({
		el: '#delete-form',
		
		/**
		 * @type ChatCollection
		 */
		collection: null,
		
		events: {
			'click #delete-btn': 'submit'
		},
		
		submit: function() {
			if (! this.collection) {
				return;
			}
			
			var id = this.$('input').val();
			var model = this.collection.findWhere({id: id});
			if (model.isValid()) {
				model.destroy();
			}
		}
	});
	
	var ChatListView = Backbone.View.extend({
		el: '#chat-list',
		
		/**
		 * @type ChatCollection
		 */
		collection: null,
		
		initialize: function() {
			// Listen some events
			this.listenTo(this.collection, 'remove', this.removeChat);
			this.listenTo(this.collection, 'reset',  this.render);
		},
		
		render: function() {
			if (! this.collection) {
				return this;
			}
			
			var html = '';
			this.collection.each(function(model) {
				var view = new ChatView({model: model})
				html += view.render().$el.html();
			});
			this.$('ul').html(html);
			return this;
		},
		
		removeChat: function() {
			
		}
	});
	
	var ChatView = Backbone.View.extend({
		
		/**
		 * @type ChatModel
		 */
		model: null,
		
		template: $('#chat-list-template').html(),
		
		render: function() {
			if (! this.model) {
				return this;
			}
			
			var html = _.template(this.template, this.model.attributes);
			this.$el.html(html);
			return this;
		}
	});
	
	var app;
	$(function() {
		app = new AppView();
	});
	
})(jQuery);
