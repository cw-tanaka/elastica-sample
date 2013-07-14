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
        el: '#chat-info',
        collection: null,
        initialize: function() {
            this.listenTo(this.collection, 'reset',   this.render);
            this.listenTo(this.collection, 'destroy', this.render);
            this.render();
        },
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
