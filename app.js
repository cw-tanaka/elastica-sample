$(function() {
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
			params = _.defaults({
				aid: null,
				rid: null,
				message: null
			}, params);
			
			options = _.defaults({}, options);
			
			this.fetch({
				data: $.param(params),
				success: _.bind(function(collection) {
					this.reset(collection.models);
					_.isFunction(options.success) && options.success.apply(this, arguments);
				}, this),
				error: function(err) {
					_.isFunction(options.error) && options.error.apply(this, arguments);
				}
			});
		}
	});
	
	
	/*
	 * View
	 */
	
	var AppView = Backbone.View.extend({
		el: '#container',
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
			
		}
	});
	
	var FormView = Backbone.View.extend({
		submit: function() {
		}
	});
	
	var SearchChatFormView = FormView.extend({
		el: '#search-form',
		events: {
			'click #search-btn': 'submit'
		},
		render: function() {
			return this;
		},
		submit: function() {
			var attrs = {};
			this.$('.param').each(function() {
				var $this = $(this);
				attrs[$this.attr('name')] = $this.val();
			});
			
		}
	});
	
	var DeleteChatFormView = Backbone.View.extend({
		el: '#delete-form',
		events: {
			'click #delete-btn': 'submit'
		},
		render: function() {
			return this;
		},
		submit: function() {
			var id = this.$('input').val();
			var model = app.get('collection').findWhere({id: id});
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
			this.listenTo(this.collection, 'add',    this.render);
			this.listenTo(this.collection, 'remove', this.render);
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
		}
	});
	
	var ChatView = Backbone.View.extend({
		tagName: 'li',
		render: (function() {
			var tmpl = $('#chat-list-template').html();
			return function() {
				if (! this.model) {
					return this;
				}
				var html = _.template(tmpl, this.model.attributes);
				this.$el.html(html);
				return this;
			};
		})(),
	});
	
	var app = new AppView();
});
