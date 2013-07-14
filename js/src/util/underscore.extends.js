/**
 * @module (none)
 */
(function($, _, Backbone) {

    /**
     * Extend of [Underscore](http://underscorejs.org)
     * @class _
     * @static
     */
    _.extend(_, {

        /**
         * Compact object data.
         * Delete the object key if this value is false or empty value.
         * 
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
         * @example
         *     _.namespace('hogehoge.foo.bar');
         * 
         *     typeof hogehoge === "object";          // true
         *     typeof hogehoge.foo === "object";      // true
         *     typeof hogehoge.foo.bar === "object";  // true
         *     _.isEmpty(hogehoge.foo.bar)            // true
         * 
         *     var MYAPP = {};
         *     _.namespace('module.view', MYAPP);
         *     typeof MYAPP.module.view === "object"   // true
         * 
         *     var obj = {};
         *     obj.some_attr = "some value";
         *     _.namespace('obj.bra.bra');
         * 
         *     typeof obj.bra.bra === "object"  // true
         *     obj.some_attr === "some value"   // true
         * 
         * 
         * @beta
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

