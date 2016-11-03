var companiesApp = angular.module('companiesApp', ['ngRoute']).config(function ($routeProvider) {
    $routeProvider.
    when('/:companyName', {
        templateUrl: 'Partners.html'
        , controller: 'CompanyCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
}).controller('CompanyCtrl', ['$scope', '$http', 'companiesList', '$routeParams', CompanyCtrl]).controller('NewsCtrl', ['$scope', '$http', NewsCtrl])
companiesApp.factory('companiesList', function ($http) {
    return {
        list: function (callback) {
            $http.get("http://codeit.pro/frontTestTask/company/getList").success(callback);
        }
    };
});

function CompanyCtrl(scope, http, companiesList, routeParams) {
    companiesList.list(function (companiesList) {
        scope.loading = true;
        if (companiesList) {
            scope.loading = false;
        }
        scope.list = companiesList;
        scope.companies = scope.list.list;
        scope.name = routeParams.companyName;
        scope.companySelect = scope.companies.filter(function (entry) {
            return entry.name === scope.name;
        })[0];
        scope.sortField = 'name';
        scope.reverse = true;
        scope.pie = function () {
           
            var pieData = [];

            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }
            for (i = 0; i < scope.companies.length; i++) {
                var existingElement = null;
                for (j = 0; j < pieData.length; j++) {
                    if (pieData[j].label == scope.companies[i].location.name) {
                        existingElement = pieData[j];
                    }
                }
                if (existingElement != null) {
                    existingElement.value++;
                }
                else {
                    pieData.push({
                        value: 1
                        , label: scope.companies[i].location.name
                        , color: getRandomColor()
                    })
                }
            }
            console.log(pieData);
            var ctx = document.getElementById("canvas").getContext("2d");
            var skillsChart = new Chart(ctx).Pie(pieData);
        }
        scope.pie();
    });
}

function NewsCtrl(scope, http) {
    scope.loading = true;
    scope.url = "http://codeit.pro/frontTestTask/news/getList";
    http.get(scope.url).success(function (data) {
        scope.list = data;
        scope.news = scope.list.list;
        scope.descLimit = 150;
        scope.loading = false;
    });
}