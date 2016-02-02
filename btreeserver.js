var http = require('http');
var express = require('express');
var braintree = require('braintree');
var bodyParser = require('body-parser');

myserver = express();
myserver.use(bodyParser.urlencoded({ extended: false }));
myserver.use(bodyParser.json());
myserver.use('/css', express.static(__dirname + '/css'));
myserver.use('/js', express.static(__dirname + '/js'));

var server = myserver.listen(9000, function () {
	//wait for connection and see if it wants to get a token or checkout and process it
	console.log('listening...');	
});

myserver.get('/', function (request, response) {
	response.sendFile(__dirname + "/index.html");
});

var gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: "xxxxxxxxxxxxxxx",
	publicKey: "xxxxxxxxxxxxxxx",
	privateKey: "xxxxxxxxxxxxxxx"
});

myserver.get("/client_token", function (request, response) {
	console.log('request for client token');
	gateway.clientToken.generate({},
		function (err, tokenResponse) {
			response.type('application/json');
			response.send(JSON.stringify(tokenResponse.clientToken));
		});
});

myserver.post("/checkout", function (request, response) {
	var paymentNonce = request.body.payment_method_nonce;
	var transactionResult = "";

	if (paymentNonce != null) {
		gateway.transaction.sale({
			amount: '10',
			paymentMethodNonce: paymentNonce
		}, function (err, result) {			
			if (err) {
				transactionResult = err;
			}
			else {
				transactionResult = result.success;
			}
			response.send(JSON.stringify(transactionResult));
		});
	}
});