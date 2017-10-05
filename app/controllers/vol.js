var express = require('express'),
	router  = express.Router(),
	Vol = require('../models/Vol');

router.post('/add', function(req, res, next){
	var obj = {
		"owner" : req.body.owner,
		"location" : req.body.location
	};
	Vol.addVol(obj, function(vol){
		console.log(vol);
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(vol));
	})
})

.get('/', function(req, res, next){
	Vol.getAll(function(vol){
		console.log(vol);
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(vol));
	})
});

module.exports = router;
