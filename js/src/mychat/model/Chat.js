(function($, _, Backbone) {

    _.namespace('mychat.model');

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
                userId: 1,

                /**
                 * Room id
                 * 
                 * @property rid
                 * @type {Int}
                 */
                rid: 1,

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
         * 
         * - A message is required.
         * 
         * @method validate
         * @params {Object} attrs Attributes this model
         *   @params {Int} [attrs.userId] User id.
         *   @params {Int} [attrs.rid] Room id.
         *   @params {Int} attrs.message Message id.
         */
        validate: function(attrs) {
            if (! attrs.message) {
                return 'Message is required.';
            }
        }
    });

    var ChatModel = mychat.model.Chat;

    /**
     * Create new {{#crossLink "mychat.model.Chat"}}{{/crossLink}}.
     * 
     * @static
     * @async
     * @method create
     * @namespace mychat.model.Chat
     * @param {Object} attrs Chat model attributes.
     * @param {Object} [options]
     *   @param {Function} [options.success] callback function of success
     *   @param {Function} [options.error]   callback function of error
     */
    ChatModel.create = function(attrs, options) {
        var chat = new ChatModel(attrs);
        chat.save(null, options);
    };
})(jQuery, _, Backbone);
