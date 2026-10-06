export function Needle({ type, degrees, color }) {
  return (
    <div
      className={`analog-needle ${type}`}
      style={{
        transform: `translateY(-50%) rotate(${degrees})`,
        backgroundColor: color || 'var(--text-primary)',
      }}
    />
  );
}
