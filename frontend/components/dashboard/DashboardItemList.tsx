interface DashboardItemListProps {
  children: React.ReactNode;
}

export function DashboardItemList({ children }: DashboardItemListProps) {
  return <ul className="flex flex-col gap-3">{children}</ul>;
}

interface DashboardItemCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardItemCard({ children, className = "" }: DashboardItemCardProps) {
  return (
    <li
      className={`rounded-lg border border-line bg-surface-base px-3 py-3 ${className}`.trim()}
    >
      {children}
    </li>
  );
}
