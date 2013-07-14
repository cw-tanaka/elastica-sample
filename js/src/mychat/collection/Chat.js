(function($, _, Backbone) {

    _.namespace('mychat.collection');

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
})(jQuery, _, Backbone);
