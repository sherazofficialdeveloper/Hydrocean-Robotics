/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { adminAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public submission route
router.post('/submit', ApplicationController.submitApplication);

// Private Admin-only routes
router.get('/admin/list', adminAuthMiddleware, ApplicationController.getApplicationsForAdmin);
router.put('/admin/update/:id', adminAuthMiddleware, ApplicationController.updateStatus);
router.delete('/admin/delete/:id', adminAuthMiddleware, ApplicationController.deleteApplication);

export default router;
