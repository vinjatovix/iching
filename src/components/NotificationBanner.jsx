/**
 * AccessibleNotification entity constraints: 
 * id (string, required)
 * message (string, required)
 * politeness ('polite' | 'assertive', required)
 * timestamp (number, required)
 */
export function NotificationBanner({ notification }) {
  const politeness = notification?.politeness;
  const message = notification?.message || '';

  return (
    <div className="sr-only" data-testid="notification-banner">
      <div role="alert" aria-live="assertive" aria-atomic="true">
        {politeness === 'assertive' ? message : ''}
      </div>
      <div role="status" aria-live="polite" aria-atomic="true">
        {politeness === 'polite' ? message : ''}
      </div>
    </div>
  );
}
