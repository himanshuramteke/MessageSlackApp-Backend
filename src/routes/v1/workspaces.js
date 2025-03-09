import express from 'express';

import { createWorkspaceController, deleteWorkspaceController, getWorkspacesUserIsMemberOfController } from '../../controllers/workspaceController.js';
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

router.get('/', isAuthenticated, getWorkspacesUserIsMemberOfController);

router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);

export default router;