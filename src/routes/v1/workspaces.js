import express from 'express';

import { createWorkspaceController } from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { createWorkspaceSchema } from '../../validators/workspaceValidators.js';
import { validate } from '../../validators/zodValidators.js';

const router = express.Router();

router.post(
    '/', 
    isAuthenticated,
    validate(createWorkspaceSchema), 
    createWorkspaceController
)

export default router;