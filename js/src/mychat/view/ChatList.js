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

            var ChatView = mychat.view.Chat;
            this.$('ul').empty();
            this.collection.each(_.bind(function(model) {
                var view = new ChatView({model: model})
                this.$('ul').append(view.$el);
            }, this));
            return this;
        },

        addChatView: function(model) {
            var view = new mychat.view.Chat({model: model});
            view.$el.hide();
            this.$('ul').prepend(view.$el);
            view.$el.fadeIn();
        }
    });

})(jQuery, _, Backbone);
