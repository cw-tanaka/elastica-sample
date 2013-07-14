(function($, _, Backbone) {

    _.namespace('mychat.view');

    /**
     * Chat view
     * 
     * @namespace mychat.view
     * @class Chat
     * @extends Backbone.View
     */
    mychat.view.Chat = Backbone.View.extend({
        /**
         * @type ChatModel
         */
        model: null,

        isEditing: false,

        events: {
            'dblclick  .message':  'changeToEditableView',
            'click .delete-chat':  'removeChat',
            'blur .edit-message':  'updateChat',
            'keypress .edit-message':  'enterOnEditMessage'
        },

        initialize: function() {
            _.bindAll(this, 'finishEditableView');
            this.listenTo(this.model, 'destroy', this.fadeOutView);
            this.render();
        },

        template: $('#chat-list-template').html(),

        render: function() {
            if (! this.model) {
                return this;
            }

            var html = _.template(this.template, this.model.attributes);
            this.$el.html(html);
            return this;
        },

        removeChat: function() {
            this.model.destroy();
        },

        updateChat: function() {
            var new_message = this.$('.edit-message').val();
            this.model.save({
                message: new_message
            }).always(this.finishEditableView);
        },

        enterOnEditMessage: function(e) {
            if (e.keyCode != 13) return;     // keyCode === 13 : EnterKey
            this.updateChat();
        },

        changeToEditableView: function() {
            this.$('.message').hide();
            this.$('.delete-chat').hide();
            this.$('.edit-message').show().focus().val(this.model.get('message'));
            this.isEditing = true;
        },

        finishEditableView: function() {
            this.$('.message').show();
            this.$('.delete-chat').show();
            this.$('.edit-message').hide();
            this.updateView();
            this.isEditing = false;
        },

        fadeOutView: function() {
            this.$el.fadeOut();
        },

        updateView: function(model) {
            this.$('.message').text(this.model.get('message'));
        }
    });

})(jQuery, _, Backbone);
