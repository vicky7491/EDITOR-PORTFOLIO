const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/plan.controller');
const protect    = require('../middleware/protect');
const adminOnly  = require('../middleware/adminOnly');

router.get('/', ctrl.getPlans);                                              // public

router.use(protect, adminOnly);
router.get('/all', ctrl.getAllPlans);
router.post('/',         ctrl.createPlan);
router.put('/:id',       ctrl.updatePlan);
router.delete('/:id',    ctrl.deletePlan);

module.exports = router;