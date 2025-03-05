import express from 'express';

import { signUp } from '../../controllers/userController.js';
import { userSignUpSchema } from '../../validators/userSignUpSchema.js';
import { validate } from '../../validators/zodValidators.js';

const router = express.Router();

router.post('/signup', validate(userSignUpSchema), signUp);

export default router;