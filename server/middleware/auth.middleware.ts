/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { DBService } from '../services/db.service';

const JWT_SECRET = process.env.JWT_SECRET || 'hydrocean_sec_key_24680';

export function verifyToken(token: string): any {
  try {
    const [header, body, signature] = token.split('.');
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    
    // Validate JWT expiration if exp claim is present
    if (decoded && typeof decoded.exp === 'number') {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (currentTimestamp > decoded.exp) {
        console.log(`[JWT] Token expired at ${new Date(decoded.exp * 1000).toISOString()}`);
        return null;
      }
    }
    return decoded;
  } catch (e) {
    return null;
  }
}

export function generateToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  
  // Attach default exp claim (7 days from now) if not already provided
  const extendedPayload = {
    ...payload,
    exp: (payload as any).exp || Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000),
    iat: (payload as any).iat || Math.floor(Date.now() / 1000)
  };
  
  const body = Buffer.from(JSON.stringify(extendedPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function isEmailAdmin(email: string): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  
  const admin1 = process.env.MAIN_ADMIN_EMAIL_1 || '';
  const admin2 = process.env.MAIN_ADMIN_EMAIL_2 || '';
  
  const list = [admin1, admin2].map(e => e.toLowerCase().trim()).filter(Boolean);
  return list.includes(cleanEmail);
}

export async function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Unauthorized request.' });
  }

  const token = authHeader.split(' ')[1];
  const verified = verifyToken(token);

  if (!verified) {
    return res.status(403).json({ error: 'Invalid or expired credentials.' });
  }

  const email = verified.email;
  if (!email) {
    return res.status(403).json({ error: 'Access Denied.' });
  }

  try {
    const user = await DBService.getUserByEmail(email);
    const isMainAdmin = isEmailAdmin(email) || (user && user.role === 'admin');
    const isSub = user && user.role === 'sub_admin';

    if (!isMainAdmin && !isSub) {
      return res.status(403).json({ error: 'Access Denied. You are not authorized to access the Admin Panel.' });
    }

    (req as any).admin = {
      ...verified,
      id: user?._id || user?.id || verified.id,
      role: user?.role || (isMainAdmin ? 'admin' : 'applicant'),
      permissions: user?.permissions || [],
    };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Authorization check failed.' });
  }
}

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const admin = (req as any).admin;
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    // Main admins always pass
    if (admin.role === 'admin' || isEmailAdmin(admin.email)) {
      return next();
    }
    // Sub-admins check permissions
    if (admin.role === 'sub_admin' && admin.permissions && admin.permissions.includes(permission)) {
      return next();
    }
    return res.status(403).json({ error: `Access Denied. You do not have the required permission: ${permission}` });
  };
}
