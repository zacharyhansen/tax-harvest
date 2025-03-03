import { DateFormatter } from '../utils/DateFormatter';

export interface TaskMetaData {
  parts: {
    primary: boolean;
    text: string;
  }[];
}

interface ActivityItemProps {
  avatar: React.ReactNode;
  name: string;
  time: string;
  comment?: React.ReactNode;
  metaData?: TaskMetaData;
}

export default function ActivityItem({
  avatar,
  name,
  time,
  comment,
  metaData,
}: ActivityItemProps) {
  if (comment) {
    return (
      <div className="bg-muted rounded-lg border p-4">
        <div className="flex items-center gap-3">
          {avatar}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium">{name}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {DateFormatter.timeAgo(time)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2">{comment}</div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex items-center gap-3">
        {avatar}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium">{name}</span>
            {metaData?.parts.map(part => (
              <span
                key={part.text}
                className={!part.primary ? 'text-muted-foreground' : ''}
              >
                {part.text}
              </span>
            ))}
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {DateFormatter.timeAgo(time)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
