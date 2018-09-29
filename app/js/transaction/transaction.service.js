(function(undefined) {
    'use strict';

    angular
        .module('txnApp')
        .service('TransactionApi', TransactionApi)
        .service('UpdateTransactionApi', UpdateTransactionApi);

        /* TransactionApi */
        TransactionApi.$inject = ['$resource'];

        function TransactionApi ($resource) {

            var url = 'https://jointhecrew.in/api/txns/:user';

            return $resource(url, {}, {

                'create' : {method: 'POST', params: {user: '@user'}, handleError: true},
                'fetch' : {method: 'GET', params: {user: '@user'}, handleError: true, isArray: true}
            });
        };

        /* UpdateTransactionApi */
        UpdateTransactionApi.$inject = ['$resource'];

        function UpdateTransactionApi ($resource) {

            var url = 'https://jointhecrew.in/api/txns/:user/:id';

            return $resource(url, {}, {

                'update' : {method: 'POST', params: {user: '@user', id: '@id'}, handleError: true},
                'delete': {method: 'DELETE', params: {user: '@user', id: '@id'}, handleError: true},
                'getById': {method: 'GET', params: {user: '@user', id: '@id'}, handleError: true}
            });
        };
})();
