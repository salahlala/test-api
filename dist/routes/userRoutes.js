"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("@/controller/userController");
const protect_1 = require("@/middlewares/protect");
const router = express_1.default.Router();
router.use(protect_1.protect);
router.get('/', userController_1.getAllUser);
router.route('/:id').get(userController_1.getUser).patch(userController_1.updateUser).delete(userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map