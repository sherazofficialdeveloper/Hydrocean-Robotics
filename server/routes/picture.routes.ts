/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { PictureController } from '../controllers/picture.controller';

const router = Router();

router.post('/upload', PictureController.uploadPicture);

export default router;
