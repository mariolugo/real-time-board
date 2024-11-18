export interface CursorPosition {
  x: number;
  y: number;
  name: string;
  color: string;
}

export function Cursor({ x, y, color, name }: CursorPosition) {
  return (
    <div
      className="pointer-events-none fixed z-50 transition-all duration-100 rotate-2"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill={color}
        style={{
          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))',
          transform: 'rotate(-20deg)',
        }}
      >
        <path d="M0 0L16 6L8 8L6 16L0 0Z" />
      </svg>
      <span
        className="ml-4 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
    </div>
  );
}
