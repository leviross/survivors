	function CartController(CartService, ProductService, $location, $rootScope) {

	'use strict'

	var self = this;
	self.CartObj = {};


	self.CartObj.Count = 0;
	self.CartObj.Items = [];
	self.CartObj.ItemsCopy = [];

	self.CartObj.SubTotal = 0;
	self.CartObj.Shipping = "FREE UPS GROUND!";
	self.CartObj.Tax = 0.096;
	self.CartObj.TaxTotal = 0;
	self.CartObj.GrandTotal = 0;
	self.CartObj.ChangedQuant = 0;
	self.CartObj.ChangedIndex = -1;
	self.CartObj.CheckOutClicked = false;
	

	// On page load, get the cart array from cart service and set count
	GetServCart();

	function GetServCart() {

		CartService.GetCart(function(servCart) {

			if (servCart == null) {
				self.CartObj.Items = [];
			} else {
				self.CartObj.Items = angular.copy(servCart);
				self.CartObj.ItemsCopy = angular.copy(servCart);
				CalculateTotals();
			}

		});
	}


	self.GoToProductPage = function(item) {
		ProductService.SetProductDetail(item.Product);

		var titleWithDashes = withDashes(item.Product.Title);
		$location.path("/shop/" + titleWithDashes.toLowerCase());
	}

	self.Delete = function(index) {
		CartService.UpdateCart(null, index, function(servCart) {
			self.CartObj.Items = angular.copy(servCart);
			CalculateTotals();
		});
	}

	function CalculateTotals() {

		$rootScope.$broadcast("UpdateCart");

		self.CartObj.Count = CartService.Count();
		self.CartObj.SubTotal = CartService.SubTotal();
		self.CartObj.TaxTotal = CartService.TaxTotal();
		self.CartObj.GrandTotal = CartService.GrandTotal();

	}

	self.UpdateCart = function() {
		// go through self.Items and see if any quantity of any product doesn't match its service 
		// counterpart in quantity. If there is a diff, then make adjustments...
		var counter = 0;

		if (self.CartObj.Items.length == 0) {
			return alert("Your cart is empty!");
		} 
		

		for (var i = 0; i < self.CartObj.Items.length; i ++) {
			if (self.CartObj.Items[i].Quantity < 1) {
				GetServCart();
				return alert("You can not enter in less than 1.");
			} else if (self.CartObj.Items[i].Quantity != self.CartObj.ItemsCopy[i].Quantity) {
				self.CartObj.Items[i].Total = self.CartObj.Items[i].Quantity * self.CartObj.Items[i].Product.SelectedPrice - self.CartObj.Items[i].Discount;
				CartService.UpdateCart(self.CartObj.Items, i, function(cart) {
					//self.serviceCart = cart;
					counter++;
					self.CartObj.ItemsCopy = angular.copy(cart);
					CalculateTotals();
				});
			} 
		}

		if (counter == 0) alert("You didn't update anything!");
		
	}

	// self.CheckOut = function() {
	// 	if (self.CartObj.Count == 0) {
	// 		self.CartObj.CheckOutClicked = true;
	// 	} else if (self.CartObj.Count > 0) {
	// 		$location.path("checkout/address");
	// 	}
	// }


	function withDashes(title) {
		return title.replace(/\s+/g, "-");		
	}


	

};

CartController.$inject = ['CartService', 'ProductService', '$location', '$rootScope'];

app.controller("CartController", CartController);

