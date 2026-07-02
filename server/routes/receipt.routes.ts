/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { ReceiptController } from '../controllers/receipt.controller';

const router = Router();

router.post('/upload', ReceiptController.uploadReceipt);

export default router;
