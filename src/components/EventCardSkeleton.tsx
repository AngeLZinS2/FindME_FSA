
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

const EventCardSkeleton = () => {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-2 right-2">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full col-span-2" />
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

export default EventCardSkeleton;
