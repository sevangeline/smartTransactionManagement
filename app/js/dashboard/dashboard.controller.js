(function(undefined) {
    'use strict';

    angular
        .module('txnApp')
        .controller('DashboardCtrl', DashboardCtrl);

        /* DashboardCtrl */
        DashboardCtrl.$inject = ['UpdateTransactionApi'];

        function DashboardCtrl (UpdateTransactionApi) {

            var dashboardCtrlVm = this;
            dashboardCtrlVm.isServiceSuccess = false;
            dashboardCtrlVm.txnHistoryFailed = false;
            dashboardCtrlVm.closeTxnHistory = closeTxnHistory;
            dashboardCtrlVm.getTransactionHistoryById = getTransactionHistoryById;

            function closeTxnHistory() {

                dashboardCtrlVm.isServiceSuccess = false;
                dashboardCtrlVm.txnHistory = {};
                dashboardCtrlVm.txnFilterId = '';
            };

            function getTransactionHistoryById() {

                var params = {
                    user : 'sylvia@gmail.com',
                    id : dashboardCtrlVm.txnFilterId
                };
                UpdateTransactionApi.getById(params).$promise.then(function(data) {

                    dashboardCtrlVm.isServiceSuccess = true;
                    dashboardCtrlVm.txnHistory = data;
                }, function(error) {

                    dashboardCtrlVm.isServiceSuccess = false;
                    dashboardCtrlVm.txnHistoryFailed = true;
                });
            }
        };
})();
