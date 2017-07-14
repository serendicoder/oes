(function() {

    //invoke directive_module in each directive
    var app = angular.module("login_module", []);
    
    app.directive("loginFormView", function() {
        return {
            restrict: 'E',
            templateUrl: 'app/template/loginFormTemplate.html'
        }
    });
})();