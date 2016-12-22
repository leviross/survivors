var app = angular.module('EcommApp', ['ngRoute', 'ui.bootstrap', 'ValidationModule']);


app.config(['$routeProvider', function ($routeProvider) {    

    $routeProvider.when('/home', {
        templateUrl: 'views/homepage.html',
        controller: 'HomePageController as HomePage'
    }).when('/admin', {
        templateUrl: 'views/admin/admin.html',
        controller: 'AdminController as Admin'
    }).when('/admin/:type', {
        templateUrl: 'views/admin/admin.html',
        controller: 'AdminController as Admin'
    }).when('/add-product', {
    	templateUrl: 'views/add-product.html',
    	controller: 'AddProductController as AddProduct'
    }).when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController as Login'
    }).when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterController as Register'
    }).when('/reset-password', {
        templateUrl: 'views/reset-password.html',
        controller: 'ResetPasswordController as ResetPassword'
    }).when('/shop/:title', {
        templateUrl: 'views/detail.html',
        controller: 'DetailController as Detail'
    }).when('/shopping-cart', {
        templateUrl: 'views/cart.html',
        controller: 'CartController as Cart'
    }).when('/checkout/address', {
        templateUrl: 'views/checkout/address.html',
        controller: 'CheckoutController as CheckOut'
    }).when('/checkout/payment', {
        templateUrl: 'views/checkout/payment.html',
        controller: 'CheckoutController as CheckOut'
    }).when('/code-samples', {
        templateUrl: 'views/code.html'
    }).when('/microsoft', {
        templateUrl: 'views/microsoft.html'
    }).otherwise({
      redirectTo: '/home'
    });

    //TODO: put the route logic functions here to make sure 
    

}]);    
   
app.run(function ($rootScope, $http, $location) {
    //Run blocks are used as a main method, it executes after services have been configured 
    // and the injector has been created
    

    console.log('app.run');


    $rootScope.$on("$locationChangeStart", function(event, next, current) { 
        // handle route changes    
        setTimeout(function() {
            SetActiveNav();
        }, 400); 

    });

    function SetActiveNav() {
        var domain = $location.path().toLowerCase().split("/", 2);

        if (domain[1] == "") return;

        // var navListLen = $('#navList').children().length;

        $('#navList').children().each(function(index, li) {
            //console.log($(li).attr("id"));
            var id = $(li).attr("id");
            
            if (domain[1] == id) {
                $(li).addClass('active');
                localStorage.setItem("page", id);
            } else {
                $(li).removeClass('active');
            }

        });
	
    }
    
});

angular.module('EcommApp')
.controller('MasterController', ['$rootScope', '$location', '$scope', '$window', function ($rootScope, $location, $scope, $window) {
    //console.log("Master Ctrl always runnin...");
    //# sourceMappingURL=angular.min.js.map - This came from the angular.min.js file, it was causing errors and was commented out to begin with. 

    $scope.FollowMe = function () {
        console.log($location.url());

        switch ($location.url()) {
            case "/home":
                $location.path("/shop/besieged-by-time"); 
                break;
            case "/shop/besieged-by-time":
                $location.path("/register");
                break;
            case "/register":
                $location.path("/code-samples");
                break;
            case "/code-samples":
                $location.path("/microsoft");
                break;
            case "/microsoft":
                window.location = "http://leviross.com#contact";
                // window.location = "http://levi-ross.herokuapp.com/";
                // Random Comment!
            default:
                $location.path("/home");
        }
            

    }


}]);








