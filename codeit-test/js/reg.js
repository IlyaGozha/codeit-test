var myApp = angular.module('myApp', []).controller('help', function ($scope, $http, $log, $window, $timeout) {
    $scope.genderOptions = {
        'male': 'Male'
        , 'female': 'Female'
    };
    $scope.url = "http://codeit.pro/frontTestTask/user/registration";
    $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
   
    $scope.submit = function (form) {
      
        $scope.submitted = true;
       
        if (form.$invalid) {
            return;
        }
      
        var data = $.param({
            name: $scope.fName
            , secondname: $scope.lName
            , email: $scope.email
            , pass: $scope.password
            , gender: $scope.gender
        });
        var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
        
        var send = $http.post('http://codeit.pro/frontTestTask/user/registration', data, config).success(function (data, status, headers, config) {
            if (data.status == 'OK') {
                $scope.fName = null;
                $scope.lName = null;
                $scope.email = null;
                $scope.gender = null;
                $scope.password = null;
                $scope.confirmPassword = null;
                $scope.readTermsConditions = false;
                $scope.messages = 'Your form has been sent!';
                $scope.submitted = false;
            }
            else {
                $scope.messages = 'Oops, we received your request, but there was an error processing it.';
                $log.error(data);
            }
        }).error(function (data, status, headers, config) {
            $scope.progress = data;
            $scope.messages = 'There was a network error. Try again later.';
            $log.error(data);
        }).finally(function () {
           
            $timeout(function () {
                $scope.messages = null;
                $window.location.href = '/index.html';
            }, 3000);
        });
    };
});
var compareTo = function () {
    return {
        require: "ngModel"
        , scope: {
            otherModelValue: "=compareTo"
        }
        , link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };
            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
};
myApp.directive("compareTo", compareTo);
myApp.directive('checkRequired', function () {
    return {
        require: 'ngModel'
        , restrict: 'A'
        , link: function (scope, element, attrs, ngModel) {
            ngModel.$validators.checkRequired = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                var match = scope.$eval(attrs.ngTrueValue) || true;
                return value && match === value;
            };
        }
    };
});