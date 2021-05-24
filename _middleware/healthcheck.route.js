// healthcheck.routes.js: return a 2xx response when your server is healthy, else send a 5xx response
const express = require('express');
var mongoose = require('mongoose');


const router = express.Router({});
router.get('/', async (_req, res, _next) => {

	// optional: add further things to check (e.g. connecting to dababase)
	const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		service: 'Course Api',
		milestone: new Date().toLocaleString("en-US", { timeZoneName: "short" }), // 12/9/2019, 10:30:15 AM CST
		timestamp: Date.now(),
		db_status: mongoose.connection.readyState
	};
	try {
		res.send(healthcheck);
	} catch (e) {
		healthcheck.message = e;
		res.status(503).send();
	}
});
// export router with all routes included
module.exports = router;