interface PageContentProps {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}

export function PageContent({
  children,
  className = "",
  wide = false,
}: PageContentProps) {
  return (
    <div
      className={`mx-auto w-full ${wide ? "max-w-7xl" : "max-w-6xl"} ${className}`}
    >
      {children}
    </div>
  );
}
