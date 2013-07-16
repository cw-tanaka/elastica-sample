/**
 * This application module
 * @module mychat
 * @main
 */
(function($, _, Backbone) {


    /**
     * Export variables
     * 
     * @namespace mychat
     * @class exports
     * @static
     */
    _.namespace('mychat.exports');

    $(function() {

        /**
         * {{#crossLink "mychat.view.App"}}{{/crossLink}} instance.
         * 
         * @property appView
         * @readonly
         * @type {Object}
         */
        mychat.exports.appView = new mychat.view.App();
    });
})(jQuery, _, Backbone);

