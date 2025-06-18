
import React from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SocialMediaLinks from "./SocialMediaLinks";
import { SocialMediaLink } from "./SocialMediaInputs";
import { useMockEventAttendees } from "@/hooks/useMockEventAttendees";

export interface EventProps {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  category: string;
  image?: string;
  socialMedia?: SocialMediaLink[];
}

const EventCard: React.FC<{ event: EventProps }> = ({ event }) => {
  const {
    id,
    title,
    description,
    location,
    date,
    time,
    capacity,
    category,
    image,
    socialMedia = [],
  } = event;

  const { attendeesCount, loading: attendeesLoading } = useMockEventAttendees(id);
  
  // Usar a contagem real do hook mock
  const currentAttendees = attendeesLoading ? 0 : attendeesCount;
  const capacityPercentage = (currentAttendees / capacity) * 100;
  const isAlmostFull = capacityPercentage >= 80;
  const isFull = currentAttendees >= capacity;

  const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <Badge
          className="absolute top-2 right-2"
          variant={category === "Featured" ? "default" : "secondary"}
        >
          {category}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <MapPin size={12} className="flex-shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{description}</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar size={12} className="flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="flex-shrink-0" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <Users size={12} className="flex-shrink-0" />
            <span>
              {currentAttendees}/{capacity} {isFull ? "(Lotado)" : isAlmostFull ? "(Quase lotado)" : ""}
            </span>
          </div>
        </div>
        
        {socialMedia && socialMedia.length > 0 && (
          <div className="mt-3">
            <SocialMediaLinks links={socialMedia} />
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <Button asChild className="w-full" variant={isFull ? "outline" : "default"}>
          <Link to={`/eventos/${id}`}>
            Ver detalhes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
