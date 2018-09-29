(function(undefined) {
    'use strict';

    angular
        .module('txnApp')
        .controller('TransactionCtrl', TransactionCtrl)
        .controller('PaymentFormCtrl', PaymentFormCtrl);

        /* TransactionCtrl */
        TransactionCtrl.$inject = ['TransactionApi', 'UpdateTransactionApi', '$uibModal'];

        function TransactionCtrl (TransactionApi, UpdateTransactionApi, $uibModal) {

            var transactionVm = this;

            transactionVm.txnList = [];
            transactionVm.isLoading = true;
            transactionVm.deleteAction = deleteAction;
            transactionVm.deleteTransaction = deleteTransaction;

            function deleteConfirmationDialog(txn_id) {

                var data = {
                    title: 'Warning',
                    msg: 'Are you sure you want to delete this transaction history?',
                    showYes: true,
                    showCancel: true
                };

                var modalInstance = $uibModal.open({
                    templateUrl: 'template/dialogTemplates/dialog.html',
                    transclude: true,
                    controller: function ($uibModalInstance, items) {

                        var modalCtrl = this;

                        modalCtrl.data = items;

                        modalCtrl.yes = function () {
                            $uibModalInstance.close(modalCtrl.data);
                        };

                        modalCtrl.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    controllerAs: 'modalCtrl',
                    resolve: {
                        items: function () {
                            return data;
                        }
                    },
                    backdrop: 'static',
                    animation: true,
                    keyboard: false
                });

                modalInstance.result.then(function() {
                    transactionVm.deleteTransaction(txn_id);
                }, function() {
                  //rejected
                })
            };

            function deleteTransaction(txn_id) {

                var deleteParams = {
                                        user: 'sylvia@gmail.com',
                                        id: txn_id
                                   };

                UpdateTransactionApi.delete(deleteParams).$promise.then(function(data) {

                    angular.forEach(transactionVm.txnList, function(txn, i) {
                        if(txn.id == txn_id) {
                           transactionVm.txnList.splice(i, 1);
                        }
                    });
                }, function(error){
                    //handle error message
                });
            };

            function deleteAction(txn_id) {
                deleteConfirmationDialog(txn_id);
            };

            function getAllTransactions() {

                var params = {user : 'sylvia@gmail.com'};

                TransactionApi.fetch(params).$promise.then(function(data) {

                    transactionVm.isLoading = false;
                    transactionVm.txnList = data;
                }, function(error){
                    transactionVm.isLoading = false;
                });
            };

            getAllTransactions();
        };

        /* PaymentFormCtrl */
        PaymentFormCtrl.$inject = ['TransactionApi', 'UpdateTransactionApi', '$scope', '$rootScope', '$uibModal', '$http'];

        function PaymentFormCtrl (TransactionApi, UpdateTransactionApi, $scope, $rootScope, $uibModal, $http) {

            var paymentFormVm = this;

            paymentFormVm.setDefaultTxnDetails = setDefaultTxnDetails;
            paymentFormVm.beginPayment = beginPayment;
            paymentFormVm.formatAmount = formatAmount;
            paymentFormVm.cancel = cancel;

            function setDefaultTxnDetails() {

                paymentFormVm.amount = '';
                paymentFormVm.transactionDetails = {};
                paymentFormVm.currencyType= ['EUR', 'INR', 'GBP', 'USD'];
                paymentFormVm.transactionDetails.currency = paymentFormVm.currencyType[1];
                paymentFormVm.transactionDetails.txn_date = moment(new Date()).format("YYYY-MM-DD");
            };

            function cancel() {
              $uibModalInstance.dismiss('cancel');
            };

            function formatAmount(){
                paymentFormVm.transactionDetails.amount = paymentFormVm.amount.toString();
            };

            function showDialog(){

                var data = {
                    title: 'Success',
                    msg: 'Your Payment is successful',
                    content: 'Please note the Transaction Id for any future history: ' + paymentFormVm.result.id,
                    showOk: true
                };

                var modalInstance = $uibModal.open({
                    templateUrl: 'template/dialogTemplates/dialog.html',
                    transclude: true,
                    controller: function ($uibModalInstance, items) {

                        var modalCtrl = this;

                        modalCtrl.data = items;

                        modalCtrl.ok = function () {
                            $uibModalInstance.close(modalCtrl.data);
                        };

                        modalCtrl.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    controllerAs: 'modalCtrl',
                    resolve: {
                        items: function () {
                            return data;
                        }
                    },
                    backdrop: 'static',
                    animation: true,
                    keyboard: false
                });

                modalInstance.result.then(function() {
                    paymentFormVm.setDefaultTxnDetails();
                }, function() {
                  //rejected
                })
            };

            function beginPayment(){

                formatAmount();

                TransactionApi.create(paymentFormVm.transactionDetails).$promise.then(function(data) {

                    paymentFormVm.result = data;
                    showDialog();
                }, function(error){

                });
            };

            setDefaultTxnDetails();
        };
})();
