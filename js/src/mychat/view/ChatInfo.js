/**
 * @module view
 */
(function($, _, Backbone) {

    _.namespace('mychat.view');

    /**
     * Form view for sending chat.
     * 
     * @namespace mychat.view
     * @class ChatInfo
     * @extends Backbone.View
     */
    mychat.view.ChatInfo = Backbone.View.extend({

        /**
         * Element
         * 
         * @property el
         * @type {String} element
         */
        el: '#chat-info',

        /**
         * {{#crossLink "mychat.collection.Chat"}}{{/crossLink}} instance.
         * 
         * @property collection
         * @type {Object} 
         */
        collection: null,

        /**
         * Constructor
         *
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.listenTo(this.collection, 'reset',   this.render);
            this.listenTo(this.collection, 'destroy', this.render);
            this.render();
        },

        /**
         * Render this view.
         * 
         * @chainable
         */
        render: function() {
            if (! this.collection) {
                return;
            }
            this.$('#chat-count').text(this.collection.length);
            this.$('#chat-response-time').text(this.collection.fetchTime);
            return this;
        }
    });

})(jQuery, _, Backbone);
