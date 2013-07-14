(function($, _, Backbone) {

    _.namespace('mychat.view');

    //TODO: RESTful API
    Backbone.orgSync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
        if (method === "delete") {
            this.url = "./api/delete.php?id=" + model.get('id');
        } else if (method === "update") {
            this.url = "./api/update.php?" + $.param(_.compactObject(model.attributes));
        } else if (method === "create") {
            this.url = "./api/insert.php?" + $.param(_.compactObject(model.attributes));
        } else {
            this.url = "./api/search.php";
        }

        method = "read";

        return Backbone.orgSync(method, model, options);
    };

    /**
     * Application view
     * 
     * @class App
     * @extends Backbone.View
     * @namespace mychat.view
     * @uses mychat.view.ChatContainer
     * @uses mychat.view.SearchChatForm
     * @uses mychat.view.SendChatForm
     */
    mychat.view.App = Backbone.View.extend({

        /**
         * Element
         * 
         * @type {String} element
         */
        el: '#container',

        /**
         * @constructor
         * @class mychat.view.App
         */
        initialize: function() {
            var collection = mychat.collection;
            var view = mychat.view;

            // Render init view
            var chat_collection = new collection.Chat({});
            chat_collection.fetchAllChat({
                success: _.bind(function(collection) {
                    this.chatContainerView = new view.ChatContainer({collection: chat_collection});
                }, this),
                error: function(err) {
                    console.log(err);
                }
            });

            this.searchChatFormView = new view.SearchChatForm({collection: chat_collection});
            this.sendChatFormView = new view.SendChatForm({collection: chat_collection});
        }
    });
})(jQuery, _, Backbone);
