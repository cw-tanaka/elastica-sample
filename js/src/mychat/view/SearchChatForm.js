(function($, _, Backbone) {

    _.namespace('mychat.view');

    /**
     * Form view for searching chat.
     * 
     * @namespace mychat.view
     * @class SearchChatForm
     * @extends Backbone.View
     */
    mychat.view.SearchChatForm = Backbone.View.extend({

        /**
         * Element
         * 
         * @property el
         * @type {String} element
         */
        el: '#search-form',

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
            'click #search-btn': 'submit'
        },

        /**
         * Submit event of searching chat
         * 
         * @event submit
         * @async
         */
        submit: function() {
            if (! this.collection) {
                return;
            }

            var attrs = {};
            this.$('.param').each(function() {
                var $this = $(this);
                attrs[$this.attr('name')] = $this.val();
            });
            this.collection.searchChat(attrs);
        }
    });
})(jQuery, _, Backbone);
