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
