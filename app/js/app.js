angular.module('txnApp', [
    "ngRoute",
    "ui.bootstrap",
    'ngResource'
]).config(function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(false).hashPrefix("");

    $routeProvider
        .when("/", {
            templateUrl : "template/dashboard/dashboard.html",
            controller : "DashboardCtrl",
            controllerAs : "dashboardCtrlVm"
        })
        .when("/viewTransaction", {
            templateUrl : "template/transaction/viewTransaction.html",
            controller : "TransactionCtrl",
            controllerAs: "transactionVm"
        })
        .when("/NewPayment", {
            templateUrl : "template/transaction/NewPaymentForm.html",
            controller : "PaymentFormCtrl",
            controllerAs : "paymentFormVm"
        });
});