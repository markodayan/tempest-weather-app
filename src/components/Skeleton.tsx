type SkeletonProps = {
  className?: string;
};

// Shared loading-placeholder block - animate-pulse is Tailwind's built-in, zero-config
// skeleton animation (a 2s opacity fade), so no custom keyframes are needed here.
export default function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded bg-slate-300/60 ${className}`} />;
}
