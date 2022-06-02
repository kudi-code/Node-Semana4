const express = require('express');

// Middlewares
const {
    repairExist,
    protectEmployee,
} = require('../middlewares/repairs.middlewares');
const {
    createRepairsValidation,
    checkValidations,
} = require('../middlewares/validations.middlewares');

const { protectToken } = require('../middlewares/users.middlewares');

//controllers
const {
    getAllPendings,
    getPendingById,
    createPending,
    completePending,
    cancellPending,
} = require('../controllers/repairs.controller');

//Utils
const { upload } = require('../utils/multer');

//--------------------------------------------//

//router
const router = express.Router();

//Functions
router.route(`/`)
.get(protectToken, protectEmployee, getAllPendings)
.post(
    protectToken,
    upload.single('repairImg'),
    createRepairsValidation,
    checkValidations,
    createPending
);

router.use(protectToken, protectEmployee);

router
    .route(`/:id`)
    .get(getPendingById)
    .patch(completePending)
    .delete(cancellPending);

//export default router es igual a:
module.exports = { repairsRouter: router };
