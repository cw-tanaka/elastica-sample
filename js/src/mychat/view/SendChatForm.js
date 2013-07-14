(function($, _, Backbone) {

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
         * @property el
         * @type {String} element
         */
        el: '#insert-form',

        /**
         * {{#crossLink "mychat.collection.Chat"}}{{/crossLink}} instance.
         * 
         * @property collection
         * @type {Object}
         */
        collection: null,

        /**
         * Events map
         * @property events
         * @type {Object}
         */
        events: {
            'click #insert-btn': 'sendChat'
        },

        /**
         * Send chat.
         * 
         * @event sendChat
         * @async
         */
        sendChat: function() {
            var message = this.$('input').val();
            var ChatModel = mychat.model.Chat;
            ChatModel.create({message: message}, {
                success: function(model) {
                    mychat.exports.appView.chatContainerView.chatListView.addChatView(model);
                }
            });
        }
    });
})(jQuery, _, Backbone);
