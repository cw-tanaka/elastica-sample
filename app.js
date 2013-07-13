(function($, _) {

    /*
     * Extend Underscore
     */
    _.extend(_, {

        compactObject: function (obj) {
            var ret = {};
            _.each(obj, function (val, key) {
                if (val) {
                    ret[key] = val;
                }
            });
            return ret;
        },

        namespace: function(string, base) {
            base = base || window;
            var namespace;
            _.each(string.split('.'), function(val) {
                if (! namespace) {
                    namespace = base;
                }

                namespace[val] = namespace[val] || {};
                namespace = namespace[val];
            });
        }
    });

    //TODO: RESTful API
    Backbone.orgSync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
        if (method === "delete") {
            this.url = "./api/delete.php?id=" + model.get('id');
        } else if (method === "update") {
            this.url = "./api/update.php?" + $.param(_.compactObject(model.attributes));
        } else if (method === "create") {
            this.url = "./api/insert.php?" + $.param(_.compactObject(model.attributes));
        } else {
            this.url = "./api/search.php";
        }

        method = "read";

        return Backbone.orgSync(method, model, options);
    };

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
        }
    });

    /*
     * Collection
     */

    var ChatCollection = Backbone.Collection.extend({
        url: "./api/search.php",
        fetchTime: 0,
        model: ChatModel,
        initialize: function() {
            _.bindAll(this, 'searchChat', 'fetchAllChat');
        },
        parse: function(response) {
            this.fetchTime = response.time;
            return response.data;
        },
        searchChat: function(params, options) {
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
        },

        fetchAllChat: function(options) {
            return this.searchChat(null, options);
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
            chat_collection.fetchAllChat({
                success: _.bind(function(collection) {
                    this.view.chatContainerView = new ChatContainerView({collection: chat_collection});
                }, this),
                error: function(err) {
                    console.log(err);
                }
            });

            this.view.searchChatFormView = new SearchChatFormView({collection: chat_collection});
            this.view.sendChatFormView = new SendChatFormView({collection: chat_collection});
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
            this.collection.searchChat(attrs);
        }
    });

    var SendChatFormView = Backbone.View.extend({
        el: '#insert-form',
        collection: null,
        events: {
            'click #insert-btn': 'sendChat'
        },
        sendChat: function() {
            var chat = new ChatModel({
                message: this.$('#send-message').val(),
                user_id: 1,  // dummy value
                room_id: 1   // dummy value
            });

            chat.save().success(_.bind(function() {
                this.addChat(chat);
            }, this));
        },

        addChat: function(model) {
            this.collection.add(model);
            app.view.chatContainerView.chatListView.addChatView(model);
        }
    });

    var ChatContainerView = Backbone.View.extend({
        collection: null,
        initialize: function() {
            this.chatInfoView = new ChatInfoView({collection: this.collection});
            this.chatListView = new ChatListView({collection: this.collection});
        }
    });

    var ChatInfoView = Backbone.View.extend({
        el: '#chat-info',
        collection: null,
        initialize: function() {
            this.listenTo(this.collection, 'reset',   this.render);
            this.listenTo(this.collection, 'destroy', this.render);
            this.render();
        },
        render: function() {
            if (! this.collection) {
                return;
            }

            this.$('#chat-count').text(this.collection.length);
            this.$('#chat-response-time').text(this.collection.fetchTime);
            return this;
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
            this.listenTo(this.collection, 'reset',  this.render);
            this.render();
        },

        render: function() {
            if (! this.collection) {
                return this;
            }

            this.$('ul').empty();
            this.collection.each(_.bind(function(model) {
                var view = new ChatView({model: model})
                this.$('ul').append(view.$el);
            }, this));
            return this;
        },

        addChatView: function(model) {
            var view = new ChatView({model: model});
            view.$el.hide();
            this.$('ul').prepend(view.$el);
            view.$el.fadeIn();
        }
    });

    var ChatView = Backbone.View.extend({
        /**
         * @type ChatModel
         */
        model: null,

        events: {
            'dblclick  .message':  'changeToEditableView',
            'click .delete-chat':  'removeChat',
            'blur .edit-message':  'updateChat',
            'keypress .edit-message':  'enterOnEditMessage'
        },

        initialize: function() {
            _.bindAll(this, 'finishToEditableView');
            this.listenTo(this.model, 'destroy', this.fadeOutView);
            this.render();
        },

        template: $('#chat-list-template').html(),

        render: function() {
            if (! this.model) {
                return this;
            }

            var html = _.template(this.template, this.model.attributes);
            this.$el.html(html);
            return this;
        },

        removeChat: function() {
            this.model.destroy();
        },

        updateChat: function() {
            var new_message = this.$('.edit-message').val();
            this.model.save({
                message: new_message
            }).always(this.finishToEditableView);
        },

        enterOnEditMessage: function(e) {
            if (e.keyCode != 13) return;     // keyCode === 13 : EnterKey
            this.updateChat();
        },

        changeToEditableView: function() {
            this.$('.message').hide();
            this.$('.delete-chat').hide();
            this.$('.edit-message').show().focus().val(this.model.get('message'));
        },

        finishToEditableView: function() {
            this.$('.message').show();
            this.$('.delete-chat').show();
            this.$('.edit-message').hide();
            this.updateView();
        },

        fadeOutView: function() {
            this.$el.fadeOut();
        },

        updateView: function(model) {
            this.$('.message').text(this.model.get('message'));
        }
    });

    var app;
    $(function() {
        app = new AppView();
    });

})(jQuery, _);
