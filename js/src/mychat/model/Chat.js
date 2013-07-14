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

    var ChatModel = mychat.model.Chat;

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
    ChatModel.create = function(attrs, options) {
        var chat = new ChatModel(attrs);
        chat.save(null, options);
    };
})(jQuery, _, Backbone);
