function CheckoutController(CartService, ProductService, $location, $rootScope, ValidationService) {

	'use strict'

	var self = this;
	
	self.CartObj = {};
	self.CheckOutObj = {};


	self.Items = [];

	self.CartObj.SubTotal = 0;
	self.CartObj.Shipping = 0;
	self.CartObj.Tax = 0.096;
	self.CartObj.TaxTotal = 0;
	self.CartObj.GrandTotal = 0;


	self.CheckOutObj.Country = "USA";
	self.CheckOutObj.Page = "Address";

	$('html, body').animate({scrollTop:0}, 'slow');


	Init();

	function Init() {
		CartService.GetCart(function(servCart) {
			self.CartObj.SubTotal = CartService.SubTotal();
			self.CartObj.TaxTotal = CartService.TaxTotal();
			self.CartObj.GrandTotal = CartService.GrandTotal();
			self.CartObj.Count = CartService.Count();
			self.CartObj.Shipping = CartService.Shipping();
		});

		CartService.GetCheckOut(function(servCheckOut) {
			if (servCheckOut) self.CheckOutObj = angular.copy(servCheckOut); 
		});
	}

	self.Capitalize = function(field) {
		if (field == undefined || self.CheckOutObj[field] == undefined) { 
			return;
		} else if (field == "State" && self.CheckOutObj.State.length == 2) {
			self.CheckOutObj.State = self.CheckOutObj.State.toUpperCase();
		} else {
			self.CheckOutObj[field] = ValidationService.Capitalize(self.CheckOutObj[field]);
		}

	}

	self.ParsePhone = function() {
		if (self.CheckOutObj.Phone == undefined || !self.CheckOutObj.Phone instanceof String) return;
		 
		var digits = self.CheckOutObj.Phone.replace(/\D/g, "");
		
		var output = "";
		if (digits.length == 10) {
			for (var i = 0; i < digits.length; i++) {
				if (i == 3 || i == 6) {
					output += "-" + digits[i];
				} else {
					output += digits[i];
				}
			}
			self.CheckOutObj.Phone = output;
			self.CheckOutForm.Phone.$setPristine();
		}
	}


	self.SaveCheckOut = function() {
		CartService.SaveCheckOut(self.CheckOutObj);
		$location.path("/checkout/payment");
	}




	



	
	

	

};

CheckoutController.$inject = ['CartService', 'ProductService', '$location', '$rootScope', 'ValidationService'];

app.controller("CheckoutController", CheckoutController);

