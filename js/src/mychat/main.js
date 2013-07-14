(function($, _, Backbone) {
    _.namespace('mychat.exports');

    $(function() {
        mychat.exports.appView = new mychat.view.App();
    });
})(jQuery, _, Backbone);

