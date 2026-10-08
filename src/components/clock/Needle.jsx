export function Needle({ type, degrees, color }) {
  return (
    <div
      className={`analog-needle ${type}`}
      aria-hidden="true"
      style={{
        transform: `translateY(-50%) rotate(${degrees})`,
        backgroundColor: color || 'var(--text-primary)',
      }}
    />
  );
}
