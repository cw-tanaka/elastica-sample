(function($, _, Backbone) {

    _.namespace('mychat.view');

    /**
     * Chat container view
     * 
     * @namespace mychat.view
     * @class ChatContainer
     * @extends Backbone.View
     * @uses mychat.view.ChatInfo
     * @uses mychat.view.ChatList
     */
    mychat.view.ChatContainer = Backbone.View.extend({

        collection: null,

        chatInfoView: null,

        chatListView: null,

        initialize: function() {
            this.chatInfoView = new mychat.view.ChatInfo({collection: this.collection});
            this.chatListView = new mychat.view.ChatList({collection: this.collection});
        }
    });

})(jQuery, _, Backbone);
