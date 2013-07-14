(function($, _, Backbone) {

    _.namespace('mychat.view');

    /**
     * Chat view
     * 
     * @class Chat
     * @namespace mychat.view
     * @extends Backbone.View
     */
    mychat.view.Chat = Backbone.View.extend({

        /**
         * {{#crossLink "mychat.model.Chat"}}{{/crossLink}} instance.
         * 
         * @property model
         * @type {Object}
         */
        model: null,

        /**
         * Editing state flag.
         * If this flag is true, chat state is editing curretly.
         * 
         * @property isEditing
         * @type {Boolean}
         */
        isEditing: false,

        /**
         * Events map
         * 
         * @property events
         * @type {Object}
         */
        events: {
            'dblclick  .message':  'changeToEditableView',
            'click .delete-chat':  'removeChat',
            'blur .edit-message':  'updateChat',
            'keypress .edit-message':  'enterOnEditMessage'
        },

        /**
         * Template html of this view
         * 
         * @property template
         * @type {String}
         */
        template: $('#chat-list-template').html(),

        /**
         * Constructor
         *
         * @method initialize
         * @constructor
         */
        initialize: function() {
            _.bindAll(this, 'finishEditableView');
            this.listenTo(this.model, 'destroy', this.fadeOutView);
            this.render();
        },

        /**
         * Render this view.
         *
         * @method render
         * @chainable
         */
        render: function() {
            if (! this.model) {
                return this;
            }

            var html = _.template(this.template, this.model.attributes);
            this.$el.html(html);
            return this;
        },

        /**
         * Remove chat event.
         *
         * @event removeChat
         */
        removeChat: function() {
            this.model.destroy();
        },

        /**
         * Update chat event.
         *
         * @event updateChat
         */
        updateChat: function() {
            var new_message = this.$('.edit-message').val();
            this.model.save({
                message: new_message
            }).always(this.changeToNormalView);
        },

        /**
         * Enter event on editing message.
         *
         * @event enterOnEditMessage
         */
        enterOnEditMessage: function(e) {
            if (e.keyCode != 13) return;     // keyCode === 13 : EnterKey
            this.updateChat();
        },

        /**
         * Change to editing view.
         *
         * @method changeToEditableView
         */
        changeToEditableView: function() {
            this.$('.message').hide();
            this.$('.delete-chat').hide();
            this.$('.edit-message').show().focus().val(this.model.get('message'));
            this.isEditing = true;
        },

        /**
         * Change to normal view.
         *
         * @method changeToNormalView
         */
        changeToNormalView: function() {
            this.$('.message').show();
            this.$('.delete-chat').show();
            this.$('.edit-message').hide();
            this.refresh();
            this.isEditing = false;
        },

        /**
         * Fadeout this view
         *
         * @method fadeOutView
         */
        fadeOutView: function() {
            this.$el.fadeOut();
        },

        /**
         * Synchronize HTML view and this {{#crossLink "mychat.view.Chat/model:property"}}model{{/crossLink}}
         *
         * @method updateView
         */
        refresh: function() {
            this.$('.message').text(this.model.get('message'));
        }
    });

})(jQuery, _, Backbone);
