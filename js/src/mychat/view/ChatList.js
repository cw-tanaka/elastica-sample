(function($, _, Backbone) {

    _.namespace('mychat.view');

    /**
     * Chat list view
     * 
     * @namespace mychat.view
     * @class ChatList
     * @extends Backbone.View
     * @uses mychat.view.Chat
     */
    mychat.view.ChatList = Backbone.View.extend({
        el: '#chat-list',

        /**
         * {{#crossLink "mychat.collection.Chat"}}{{/crossLink}} instance.
         * 
         * @property collection
         * @type {Object} 
         */
        collection: null,

        /**
         * {{#crossLink "mychat.collection.Chat"}}{{/crossLink}} instance.
         * 
         * @property collection
         * @type {Object} 
         */
        initialize: function() {
            // Listen some events
            this.listenTo(this.collection, 'reset',  this.render);
            this.render();
        },

        /**
         * Render this view.
         * 
         * @chainable
         */
        render: function() {
            if (! this.collection) {
                return this;
            }

            var ChatView = mychat.view.Chat;
            this.$('ul').empty();
            this.collection.each(_.bind(function(model) {
                var view = new ChatView({model: model})
                this.$('ul').append(view.$el);
            }, this));
            return this;
        },

        /**
         * Add chat view.
         * 
         * @param {Object} model   {{#crossLink "mychat.model.Chat"}}{{/crossLink}} instance.
         */
        addChatView: function(model) {
            var view = new mychat.view.Chat({model: model});
            view.$el.hide();
            this.$('ul').prepend(view.$el);
            view.$el.fadeIn();
        }
    });

})(jQuery, _, Backbone);
