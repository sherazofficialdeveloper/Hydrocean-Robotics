/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { PassportController } from '../controllers/passport.controller';

const router = Router();

router.post('/upload', PassportController.uploadPassport);

export default router;
