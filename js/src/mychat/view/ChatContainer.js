/**
 * @module view
 */
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

        /**
         * {{#crossLink "mychat.collection.Chat"}}{{/crossLink}} instance.
         * 
         * @property collection
         * @type {Object} 
         */
        collection: null,

        /**
         * {{#crossLink "mychat.view.ChatInfo"}}{{/crossLink}} instance.
         * 
         * @property chatInfoView
         * @type {Object} 
         */
        chatInfoView: null,

        /**
         * {{#crossLink "mychat.view.ChatList"}}{{/crossLink}} instance.
         * 
         * @property chatListView
         * @type {Object} 
         */
        chatListView: null,

        /**
         * Constructor
         *
         * @method initialize
         * @constructor
         */
        initialize: function() {
            var view = mychat.view;
            this.chatInfoView = new view.ChatInfo({collection: this.collection});
            this.chatListView = new view.ChatList({collection: this.collection});
        }
    });

})(jQuery, _, Backbone);
