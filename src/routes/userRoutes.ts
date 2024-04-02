import express from 'express';
import {
  deleteUser,
  getAllUser,
  getUser,
  updateUser,
} from '@/controller/userController';
import { protect } from '@/middlewares/protect';
const router = express.Router();

router.use(protect);
router.get('/', getAllUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default router;
