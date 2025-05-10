import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";

export type DataCardProps = {
  data: ReactNode;
  title: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  loading?: boolean;
  children?: ReactNode;
};

export default function DataCard({
  children,
  data,
  description,
  icon,
  loading,
  title,
}: DataCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="mr-2 text-sm font-medium">
          {loading ? <Skeleton className="h-6 w-20" /> : title}
        </CardTitle>
        {icon || null}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <div className="text-2xl font-bold">{data}</div>
        )}
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
        {children || null}
      </CardContent>
    </Card>
  );
}
