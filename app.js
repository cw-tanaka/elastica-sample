(function($, _) {

    /**
     * Extend Underscore module
     * @module _
     */
    _.extend(_, {

        /**
         * Compact object data.
         * Delete the object key if this value is false or empty value.
         * 
         * @namespace _
         * @method compactObject
         * @static
         * @param {Object} obj Target object to compact
         * @return {Object} Compacted object.
         */
        compactObject: function (obj) {
            var ret = {};
            _.each(obj, function (val, key) {
                if (val) {
                    ret[key] = val;
                }
            });
            return ret;
        },

        /**
         * Namespace utility.
         * 
         * @beta
         * @namespace _
         * @method namespace
         * @static
         * @param {String} string Namespace string.
         * @param {Object} [base] Base object of this namespace.
         */
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

    /**
     * This application module.
     * @module mychat
     */
    var mychat = __global__.mychat || {}

    /**
     * Model module
     * @module mychat
     * @submodule model
     */
    mychat.model = mychat.model || {};

    /**
     * Chat model
     * 
     * @class Chat
     * @extends Backbone.Model
     * @namespace mychat.model
     */
    mychat.model.Chat = Backbone.Model.extend({
        defaults: function() {
            return {
                /**
                 * User id
                 * @property userId
                 * @type {Int}
                 */
                userId: null,

                /**
                 * Room id
                 * 
                 * @property rid
                 * @type {Int}
                 */
                rid: null,

                /**
                 * Message
                 * 
                 * @required
                 * @property message
                 * @type {String}
                 */
                message: null
            };
        },

        /**
         * Validation method.
         * We check:
         * - {{#crossLink "ChatMode:message"}}message{{/crossLink}} is required.
         * 
         * @params {Object} attrs Attributes this model
         */
        validate: function(attrs) {
            if (! attrs.message) {
                return 'Message is required.';
            }
        }
    });

    /**
     * Submit event of saving chat
     * 
     * @method
     * @static
     * @namespace mychat.model.Chat
     * @param {String} message Chat message
     * @param {Object} [options]
     *   @param {Function} [options.success] callback function of success
     *   @param {Function} [options.error]   callback function of error
     */
    mychat.model.Chat.sendChat = function(message, options) {
        var chat = new ChatModel({
            message: message
            user_id: 1,  // dummy value
            room_id: 1   // dummy value
        });

        var jqxhr = chat.save();
        jqxhr && _.isFunction(options.success) && jqxhr.success(_.bind(options.success, chat));
        jqxhr && _.isFunction(options.error)   && jqxhr.error(_.bind(options.error, chat));
    };

    /**
     * Model module
     * 
     * @module mychat
     * @submodule collection
     */
    mychat.collection = mychat.collection || {};


    /**
     * Chat Collection
     * 
     * @class Chat
     * @extends Backbone.Collection
     * @namespace mychat.collection
     */
    mychat.collection.Chat = Backbone.Collection.extend({

        /**
         * API server URL
         * 
         * @property url
         * @type {String}
         */
        url: "./api/search.php",

        /**
         * Fetching chat data time from api server. (seconds)
         * 
         * @property fetchTime
         * @type {Int}
         */
        fetchTime: 0,

        /**
         * Model data
         * 
         * @property model
         * @type {ChatModel}
         */
        model: mychat.model.Chat,

        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            _.bindAll(this, 'searchChat', 'fetchAllChat');
        },

        /**
         * Parse response data
         * 
         * @protected
         * @method parse
         * @param {Object} response Response data from api server.
         */
        parse: function(response) {
            this.fetchTime = response.time;
            return response.data;
        },

        /**
         * Search chat data.
         * 
         * @async
         * @method searchChat
         * @namespace mychat.collection
         * @param {Object} params  Response data from api server.
         *   @param {Int} [params.user_id]  User id.
         *   @param {Int} [params.rid]      Room id.
         *   @param {String} params.message  Message.
         * @param {Object} [options] Response data from api server.
         *   @param {Function} [options.success]  Callback function of success.
         *   @param {Function} [options.error]    Callback function of error.
         */
        searchChat: function(params, options) {
            _.isObject(params) || (params = {});
            params = _.pick(params || {}, [
                'user_id',
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

        /**
         * Fetch all chat data from server.
         * 
         * @async
         * @method fetchAllChat
         * @param {Object} params  Response data from api server.
         *   @param {Int} [params.user_id]  User id.
         *   @param {Int} [params.rid]      Room id.
         *   @param {String} params.message  Message.
         * @param {Object} [options] Response data from api server.
         *   @param {Function} [options.success]  Callback function of success.
         *   @param {Function} [options.error]    Callback function of error.
         */
        fetchAllChat: function(options) {
            return this.searchChat(null, options);
        }
    });


    /**
     * View module
     * 
     * @module mychat
     * @submodule view
     */
    mychat.view = mychat.view || {};


    /**
     * Application view
     * 
     * @class App
     * @extends Backbone.View
     * @namespace mychat.view
     */
    mychat.view.App = Backbone.View.extend({

        /**
         * Element
         * 
         * @type {String} element
         */
        el: '#container',

        /**
         * @module app
         * @submodule view
         * @type {String} element
         */
        view: {},

        /**
         * @constructor
         * @class mychat.view.App
         */
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

    /**
     * Form view for searching chat.
     * 
     * @namespace mychat.view
     * @class SearchChatForm
     * @extends Backbone.View
     */
    mychat.view.SearchChatForm = Backbone.View.extend({

        /**
         * Element
         * 
         * @type {String} element
         */
        el: '#search-form',

        /**
         * @type ChatCollection
         */
        collection: null,

        /**
         * Events map
         * @type {Object}
         */
        events: {
            'click #search-btn': 'submit'
        },

        /**
         * Submit event of searching chat
         * 
         * @type {String} element
         */
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

    /**
     * Form view for sending chat.
     * 
     * @namespace mychat.view
     * @class SendChatForm
     * @extends Backbone.View
     */
    mychat.view.SendChatForm = Backbone.View.extend({
        /**
         * Element
         * 
         * @type {String} element
         */
        el: '#insert-form',

        /**
         * @type ChatCollection
         */
        collection: null,

        /**
         * Events map
         * @type {Object}
         */
        events: {
            'click #insert-btn': 'sendChat'
        },


        addChat: function(model) {
            this.collection.add(model);
            app.view.chatContainerView.chatListView.addChatView(model);
        }
    });

    /**
     * Chat container view
     * 
     * @namespace mychat.view
     * @class ChatContainer
     * @extends Backbone.View
     */
    mychat.view.ChatContainer = Backbone.View.extend({
        collection: null,
        initialize: function() {
            this.chatInfoView = new ChatInfoView({collection: this.collection});
            this.chatListView = new ChatListView({collection: this.collection});
        }
    });

    /**
     * Form view for sending chat.
     * 
     * @namespace mychat.view
     * @class ChatInfo
     * @extends Backbone.View
     */
    mychat.view.ChatInfo = Backbone.View.extend({
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

    /**
     * Chat list view
     * 
     * @namespace mychat.view
     * @class ChatList
     * @extends Backbone.View
     */
    mychat.view.ChatList = Backbone.View.extend({
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

    /**
     * Chat view
     * 
     * @namespace mychat.view
     * @class Chat
     * @extends Backbone.View
     */
    mychat.view.Chat = Backbone.View.extend({
        /**
         * @type ChatModel
         */
        model: null,

        isEditing: false,

        events: {
            'dblclick  .message':  'changeToEditableView',
            'click .delete-chat':  'removeChat',
            'blur .edit-message':  'updateChat',
            'keypress .edit-message':  'enterOnEditMessage'
        },

        initialize: function() {
            _.bindAll(this, 'finishEditableView');
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
            }).always(this.finishEditableView);
        },

        enterOnEditMessage: function(e) {
            if (e.keyCode != 13) return;     // keyCode === 13 : EnterKey
            this.updateChat();
        },

        changeToEditableView: function() {
            this.$('.message').hide();
            this.$('.delete-chat').hide();
            this.$('.edit-message').show().focus().val(this.model.get('message'));
            this.isEditing = true;
        },

        finishEditableView: function() {
            this.$('.message').show();
            this.$('.delete-chat').show();
            this.$('.edit-message').hide();
            this.updateView();
            this.isEditing = false;
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
