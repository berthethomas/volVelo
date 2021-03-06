var express = require('express'),
	router  = express.Router(),
	Vol = require('../models/Vol');

router.get('/', function(req, res, next){
	Vol.getAll(function(vol){
		res.header('Content-Type', 'application/json');
		res.send(JSON.stringify(vol));
	})
})

.get('/news', function(req, res, next){
	Vol.getNews(function(vol){
		res.header('Content-Type', 'application/json');
		res.send(JSON.stringify(vol));
	})
})

.post('/add', function(req, res, next){
	var obj = {
		"owner" : req.body.owner,
		"location" : req.body.location
	};
	Vol.addVol(obj, function(err, vol){
		res.header('Content-Type', 'application/json');
		res.send(JSON.stringify(vol));
	})
});

module.exports = router;
