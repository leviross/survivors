function HeaderController($scope, $rootScope, $location, UserService, ProductService, CartService, $timeout, SettingsService){

	'use strict'
	
	var self = this;
	self.Cart = 0;

	var sessionUser = sessionStorage.getItem('User');

	if(sessionUser == "" || sessionUser == "undefined"){
		self.User = null;
	}else{
		self.User = JSON.parse(sessionUser);
	}

	CartService.GetCart(function(cart) {
		if (cart != null && cart instanceof Array) {
			for(var i = 0; i < cart.length; i++) {
				self.Cart += cart[i].Quantity;
			}
		}
	});		

	// Find the current location of app and then assign which li to make active
	console.log("Header Ctrl always runnin...");
	

	$scope.$on("UpdateCart", function(event) {
		self.Cart = CartService.Count();
		self.Highlight();
	});

	self.Highlight = function() {
		var cartButton = $("a.btn-transparent");
			cartButton.addClass("btn-primary active");
			$timeout(function() {
				cartButton.removeClass("btn-primary active");
			}, 450);
	}

	//self.User = UserService.GetLoggedInUser();
	
	$scope.$on('UserLoggedIn', function(event, user) {
		self.User = user;
	});

	// $scope.$on('ChooseActiveNav', function(event, index) {
	// 	var elemArr = [];
	// 	$('#navList').children().each(function(index, li) {
	// 		$(li).removeClass('active');
	// 		elemArr.push($(li));
	// 	});
	// 	elemArr[index].addClass('active');	
	// });

	self.GoToLogin = function() {
		$location.path('/login');
	}

	self.Logout = function() {
		UserService.Logout();
		self.User = null;
	}

	self.ActiveClass = function(event) {
		$('#navList li').each(function(index, li) {
			$(li).removeClass('active');
		});
		event.target.parentElement.className = 'active';
	}

	self.BackToSelected = function() {
		ProductService.GetProductDetail(function(product) {
			$location.path("/shop/" + SettingsService.WithDashes(product.Title));
		});
		
	}
    

}

HeaderController.$inject = ['$scope', '$rootScope', '$location', 'UserService', 'ProductService', 'CartService', '$timeout', 'SettingsService'];

app.controller('HeaderController', HeaderController);