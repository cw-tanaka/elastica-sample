(function($, _, Backbone) {

    /**
     * Extend Underscore module
     * @module _
     */
    _.extend(_, {

        /**
         * Compact object data.
         * Delete the object key if this value is false or empty value.
         * 
         * @namespace _
         * @method compactObject
         * @static
         * @param {Object} obj Target object to compact
         * @return {Object} Compacted object.
         */
        compactObject: function (obj) {
            var ret = {};
            _.each(obj, function (val, key) {
                if (val) {
                    ret[key] = val;
                }
            });
            return ret;
        },

        /**
         * Namespace utility.
         * 
         * @beta
         * @namespace _
         * @method namespace
         * @static
         * @param {String} string Namespace string.
         * @param {Object} [base] Base object of this namespace.
         */
        namespace: function(string, base) {
            base = base || window;
            var namespace;
            _.each(string.split('.'), function(val) {
                if (! namespace) {
                    namespace = base;
                }

                namespace[val] = namespace[val] || {};
                namespace = namespace[val];
            });
        }
    });

})(jQuery, _, Backbone);

