"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUser = void 0;
const userModel_1 = __importDefault(require("@/models/userModel"));
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find();
    console.log(req.user);
    res.status(200).json({
        status: 'success',
        data: {
            length: users.length,
            users,
        },
    });
});
exports.getAllUser = getAllUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            status: 'success',
            message: 'no user found with that id',
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    try {
        const user = yield userModel_1.default.findByIdAndUpdate(req.params.id, { name, email }, {
            new: true,
            runValidators: true,
        }).exec();
        if (!user) {
            throw new Error('No user found with that id ');
        }
        console.log(user);
        res.status(200).json({
            status: 'success',
            data: user,
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'there error',
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            throw new Error('No user found with that id');
        }
        res.sendStatus(204);
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'there an error',
        });
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map