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
										'vol (vol_id, date, location, owner) ' +
										'VALUES( ?, ?, ?, ?)';

		client.execute(query, [ uuidv1(), now, object.location, object.owner ], { prepare: true}, function(err, result) {
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

module.exports = Vol;
