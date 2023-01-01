const express = require('express');
const authRoutes = require('./auth.route');
const rateConfig = require('./rateConfig.route');
const fareConfig = require('./fareConfig.route');
const logsRoute = require('./logs.route');
const slabRoute = require('./slab.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/auth', authRoutes);
router.use('/rateconfig', rateConfig);
router.use('/fareconfig', fareConfig);
router.use('/logs', logsRoute);
router.use('/slab', slabRoute);

module.exports = router;
