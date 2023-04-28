const mongoose = require('mongoose');
const Schema = mongoose.Schema;

subdoSchema = new Schema( {
	username: String,
	subdomain: [{
		type: { type: String, lowercase: true },
        value: { type: String, lowercase: true },
        content: { type: String, lowercase: true },
        ttl: { type: Number },
        proxies: { type: Boolean }
	}]
}),
Subdomain = mongoose.model('Subdomain', subdoSchema);

module.exports = Subdomain;