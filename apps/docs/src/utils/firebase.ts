import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
import { envConfig } from '@/constants/environment';
import { appName } from '@/constants/page-metadata';

const firebaseApp = initializeApp(envConfig.firebaseConfig);

const analyticsPromise
  = typeof window !== 'undefined'
    ? isSupported().then(supported =>
      supported ? getAnalytics(firebaseApp) : undefined)
    : Promise.resolve(undefined);

export async function logFirebaseEvent(
  eventName: string = 'page_view',
  eventParams?: Record<string, unknown>
) {
  const analytics = await analyticsPromise;
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
}

export function getPageTitle(title: string) {
  return `${title} | ${appName}`;
}
