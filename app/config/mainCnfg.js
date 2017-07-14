(function() {
    angular.module("main_module", ["app_module","ngRoute", "ngCookies"]);

    angular.module("main_module").config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            template: '<login-form-view></login-form-view>'
        })
        .when('/register', {
            templateUrl: 'app/template/registerNewUserTemplate.html'
        });
        $locationProvider.hashPrefix('');
    }]);
})();