/**
 * Client-safe notification helper.
 * This file has NO server-only dependencies (no nodemailer, no Node.js built-ins).
 * Safe to import from 'use client' components.
 */

export type NotificationType = 'submission' | 'question' | 'comment' | 'profile_update' | 'profile_creation' | 'bug_report' | 'arena_suggestion' | 'hub_improvement' | 'drop_submission' | 'thread_reply';

export interface NotificationData {
    type: NotificationType;
    authors?: string;
    title?: string;
    category?: string;
    question?: string;
    userName?: string;
    content?: string;
    submissionTitle?: string;
    details?: string;
    url?: string;
}

/**
 * Helper to trigger a notification from the client side.
 * This should be used instead of raw fetch calls to /api/notify.
 */
export async function triggerNotification(data: NotificationData) {
    try {
        const response = await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error("Client-side notification error:", error);
        return { success: false, error: 'Failed to reach notification API' };
    }
}
