/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('hydrocean_admin_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('hydrocean_admin_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('hydrocean_admin_token');
}

export function getApplicantToken(): string | null {
  return localStorage.getItem('hydrocean_applicant_token');
}

export function setApplicantToken(token: string) {
  localStorage.setItem('hydrocean_applicant_token', token);
}

export function removeApplicantToken() {
  localStorage.removeItem('hydrocean_applicant_token');
}

export function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const applicantToken = getApplicantToken();
  const adminToken = getAuthToken();
  const token = applicantToken || adminToken;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! Status: ${response.status}`);
  }

  return response.json();
}
