interface SpinnerMiniProps {
  className?: string;
}

function SpinnerMini({ className }: SpinnerMiniProps) {
  return <div className={`spinner-mini ${className && className}`}></div>;
}

export default SpinnerMini;
