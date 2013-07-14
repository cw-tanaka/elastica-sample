(function($, _, Backbone) {

    /**
     * This application module
     * @module mychat
     */
    _.namespace('mychat');

    /**
     * Export variables.
     * 
     * @module mychat
     * @submodule exports
     */
    _.namespace('mychat.exports');

    $(function() {

        /**
         * AppView instance.
         * @property appView
         * @namespace mychat.exports
         */
        mychat.exports.appView = new mychat.view.App();
    });
})(jQuery, _, Backbone);

