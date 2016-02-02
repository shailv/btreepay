//get client token
function requestToken() {
	console.log('getting requesttoken...');
	$.ajax({
		url: '/client_token',
		type: 'GET',
		dataType: 'JSON',
		contentType: 'application/json',
		success: function (data) {
			var clientToken = data;

			//setup braintree form
			braintree.setup(clientToken, 'dropin', {
				container: 'checkoutForm',
				paymentMethodNonceReceived: function (event, nonce) {
					checkout(nonce);
				}
			});
		}
	});
}

function checkout(nonce) {
	$.ajax({
		url: '/checkout',
		data: {"payment_method_nonce": nonce},
		type: 'POST',
		success: function (result) {
			$('#paySuccess').show();
		}
	});
}

$(function () {	
	requestToken();
});
