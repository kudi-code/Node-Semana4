//Utils
const { catchAsync } = require('../utils/catchAsync');
//Models
const { Repair } = require('../models/repairs.model');
const { User } = require('../models/users.model');

const getAllPendings = catchAsync(async (req, res) => {
    const repairs = await Repair.findOne({ 
        where: { status: 'pending' },
        include: [{model: User}] 
    });
    res.status(201).json({
        repairs,
    });
});

const getPendingById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const repair = await Repair.findOne({ where: { id } });
    if (!repair) {
        return res.status(400).json({
            status: 'error',
            message: 'repair not found given this ID',
        });
    }
    //Si está cancelado
    if (repair.status === 'cancelled') {
        return res.status(400).json({
            status: 'error',
            message: 'This repair has been deleted',
        });
    }

    res.status(201).json({
        repair,
    });
});

const createPending = catchAsync(async (req, res) => {
    const { date, userId } = req.body;
    const newRepair = await Repair.create({ date, userId });

    //Obtiene la nueva lista de repairs y lo envía como respuesta
    const repairs = await Repair.findOne({ where: { status: 'pending' } });

    res.status(201).json({
        status: 'Done!',
        repairs,
    });
});

const completePending = async (req, res) => {
    const { id } = req.params;
    const repair = await Repair.findOne({ where: { id } });
    if (!repair) {
        return res.status(400).json({
            status: 'error',
            message: 'Repair not found given this ID',
        });
    }

    //Si está cancelado
    if (repair.status === 'cancelled') {
        return res.status(400).json({
            status: 'error',
            message: 'This repair has been deleted',
        });
    }
    repair.update({ status: 'completed' });
    res.status(201).json({
        status: 'Done!',
    });
};

const cancellPending = async (req, res) => {
    const { id } = req.params;
    const repair = await Repair.findOne({ where: { id } });
    if (!repair) {
        return res.status(400).json({
            status: 'error',
            message: 'Repair no exist',
        });
    }

    //Si está cancelado
    if (repair.status === 'cancelled') {
        return res.status(400).json({
            status: 'error',
            message: 'This repair has been deleted',
        });
    }

    repair.update({ status: 'cancelled' });
    res.status(201).json({
        status: 'Repair deleted sucessfully',
    });
};

module.exports = {
    getAllPendings,
    getPendingById,
    createPending,
    completePending,
    cancellPending,
};
