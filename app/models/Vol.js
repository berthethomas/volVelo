var http = require('http');
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'volvelo' });
const uuidv1 = require('uuid/v1');

//Attributes
function Vol(obj, callback) {
	this.id = null;
	this.date = null;
	this.location = null;
	this.owner = null;

	this.init(obj, callback);
};
//Non-statics methods
Vol.prototype = {
	init: function(obj, callback)
	{
		for (var fld in obj) {
			if (obj.hasOwnProperty(fld)) {
				this[fld] = obj[fld];
			}
		}

			this.getInfos(callback);
	},
	getInfos: function(callback)
	{
		var now = new Date();
		var object = this;

		const query = 'INSERT INTO ' +
										'vol (vol_id, date, new, location, owner) ' +
										'VALUES( ?, ?, ?, ?, ?)';

		client.execute(query, [ uuidv1(), now, true, object.location, object.owner ], { prepare: true}, function(err, result) {
			console.log(err);
			callback(err, 'ok');
		});
	},
};
//Statics methods
Vol.addVol = function(obj, callback)
{
	var vol = new Vol(obj, callback);
};

Vol.getAll = function(callback)
{
	const query = 'SELECT * FROM vol';

	client.execute(query, null, { prepare: true}, function(err, result) {
		console.log(err);
		callback(result['rows']);
	});
}

Vol.getNews = function(callback)
{
	const query = 'SELECT * FROM vol WHERE new = true';

	client.execute(query, null, { prepare: true}, function(err, result) {
		console.log(err);

		var news   = result['rows'],
			idList = '',
			first  = true;

		console.log(news);

		news.map(function (item) {
			if (! first) {
				idList = idList + ', ';
			} else {
				first = false;
			}

			idList = idList + item['vol_id'];
		});

		if (news.length && idList != '') {
			const query = 'UPDATE volvelo.vol SET new=false WHERE vol_id IN ('+idList+')';
		
			client.execute(query, null, { prepare: true}, function(err, result) {
				callback(news);
			});
		} else {
			callback(news);
		}
	});
}

module.exports = Vol;
