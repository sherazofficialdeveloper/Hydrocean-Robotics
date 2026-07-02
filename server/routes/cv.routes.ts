/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { CvController } from '../controllers/cv.controller';

const router = Router();

router.post('/upload', CvController.uploadCv);

export default router;
