interface SpinnerProps {
  className?: string;
}

function Spinner({ className }: SpinnerProps) {
  return <div className={`spinner w-full ${className && className}`}></div>;
}

export default Spinner;
