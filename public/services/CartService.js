function CartService() {

	'use strict'

	var PrivCartObj = {};
	var PrivCheckObj = {};

	PrivCartObj.servCart = [];
	PrivCartObj.subTotal = 0;
	PrivCartObj.count = 0;
	PrivCartObj.grandTotal = 0; 
	const waTax = 0.096;
	PrivCartObj.shipping = "FREE UPS GROUND!";
	PrivCartObj.taxTotal = 0;

	



	function CalculateTotals(cb) {
		PrivCartObj.count = 0; 
		PrivCartObj.subTotal = 0;

		for (var i = 0; i < PrivCartObj.servCart.length; i++) {
			if (PrivCartObj.servCart[i].Discount != 0) {
				PrivCartObj.servCart[i].Total = (PrivCartObj.servCart[i].Product.SelectedPrice * PrivCartObj.servCart[i].Quantity) - PrivCartObj.servCart[i].Discount;
				PrivCartObj.subTotal += PrivCartObj.servCart[i].Total;
				PrivCartObj.count += PrivCartObj.servCart[i].Quantity;
			} else {
				PrivCartObj.servCart[i].Total = PrivCartObj.servCart[i].Product.SelectedPrice * PrivCartObj.servCart[i].Quantity;
				PrivCartObj.subTotal += PrivCartObj.servCart[i].Total;
				PrivCartObj.count += PrivCartObj.servCart[i].Quantity;
			}
			
		}
		// TODO: Calculate grand total and subtotal based on discounts per item.
		PrivCartObj.grandTotal = PrivCartObj.subTotal;
		PrivCartObj.taxTotal = PrivCartObj.grandTotal * waTax;

		if (typeof cb == 'function') { cb(PrivCartObj.servCart); }
		localStorage.setItem("Cart", JSON.stringify(PrivCartObj.servCart));
	}


	var ServiceObject = {

		SubTotal: function() { 
			return PrivCartObj.subTotal;
		},
		Count: function() { 
			return PrivCartObj.count; 
		},
		TaxTotal: function() { 
			return PrivCartObj.taxTotal; 
		},
		GrandTotal: function() { 
			return PrivCartObj.grandTotal; 
		},
		Shipping: function() {
			return PrivCartObj.shipping;
		},

		AddToCart: function(product, quantity, cb) {

			var sameProd = false;

			for (var i = 0; i < PrivCartObj.servCart.length; i ++) {
				if (product._id == PrivCartObj.servCart[i].Product._id) {
					PrivCartObj.servCart[i].Quantity += quantity;
					sameProd = true;
				}
			}
			if (sameProd == false) {
				PrivCartObj.servCart.push({Product:product, Quantity: quantity, Discount: 0, Total: 0});
			} 			

			CalculateTotals(function(servCart) {
				if (typeof cb == 'function') { cb(servCart); }
			});	
				

		},

		GetCart: function(cb) {

			if (PrivCartObj.servCart && PrivCartObj.servCart.length !== 0) {
				
				CalculateTotals(function(servCart) {
					if (typeof cb == 'function') { cb(servCart); }
				});				

			} else if (PrivCartObj.servCart.length == 0 && localStorage.getItem("Cart")) {
				var cachedServCart = JSON.parse(localStorage.getItem("Cart"));

				PrivCartObj.servCart = cachedServCart;				

				CalculateTotals(function(servCart) {
					if (typeof cb == 'function') { cb(servCart); }
				});

			} else {
				if (typeof cb == 'function') { cb(null); }
			}
			

		},
		UpdateCart: function(ctrlCart, index, cb) {
			
			if(ctrlCart == null) {
				PrivCartObj.servCart.splice(index, 1);	

			}else if (ctrlCart instanceof Array) {
				PrivCartObj.servCart = angular.copy(ctrlCart);		
			}

			CalculateTotals(function(servCart) {
				if (typeof cb == 'function') { cb(servCart); }
			});
			
			
		}, 
		SaveCheckOut: function(checkCtrlObj) {
			PrivCheckObj = angular.copy(checkCtrlObj);
			localStorage.setItem("CheckOut", JSON.stringify(PrivCheckObj));

		}, 
		GetCheckOut: function(cb) {
			if (PrivCheckObj && PrivCheckObj.hasOwnProperty("FirstName")) {
				if (typeof cb == 'function') { cb(PrivCheckObj); }
			} else {
				var cachedCheckObj = localStorage.getItem("CheckOut");
				if (typeof cb == 'function') { cb(JSON.parse(cachedCheckObj)); }
			}
		}


	} 


	return ServiceObject;

}

app.factory("CartService", CartService);