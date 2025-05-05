import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { LawerDataType } from "@/types/types/Client.data.type";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

export default function LawyersCard({
  lawyer,
  getVerificationBadge,
}: {
  lawyer: Partial<LawerDataType>;
  getVerificationBadge: any;
}) {
  const navigate = useNavigate()
  return (
    <Card key={lawyer.user_id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={lawyer.profile_image || "/placeholder.svg"}
              alt={lawyer.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <CardTitle className="text-lg">{lawyer.name}</CardTitle>
              <CardDescription>{lawyer.address?.city}</CardDescription>
            </div>
          </div>
          {getVerificationBadge(lawyer.verification_status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium">Practice Areas</p>
          <div className="flex gap-1 mt-1 overflow-hidden whitespace-nowrap">
            {lawyer.practice_areas &&
              lawyer.practice_areas.map((area) => (
                <Badge
                  key={area}
                  variant="secondary"
                  className="text-xs whitespace-nowrap"
                >
                  {area}
                </Badge>
              ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Specialization</p>
          <div className="flex gap-1 mt-1 overflow-hidden whitespace-nowrap">
            {lawyer.specialisation &&
              lawyer.specialisation.map((spec) => (
                <Badge
                  key={spec}
                  variant="outline"
                  className="text-xs whitespace-nowrap"
                >
                  {spec}
                </Badge>
              ))}
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium">Experience</p>
            <p>{lawyer.experience} years</p>
          </div>
          <div>
            <p className="text-sm font-medium">Consultation Fee</p>
            <p className="font-semibold">${lawyer.consultation_fee}</p>
          </div>
        </div>
        <div>
          <div className="flex items-center">
            {/* <div className="flex"> */}
            {/* {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(lawyer.rating) ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))} */}
            {/* </div> */}
            {/* <span className="ml-1 text-sm text-gray-500">({lawyer.reviews} reviews)</span> */}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={()=>{navigate(`/client/lawyers/${lawyer.user_id}`)}}>View Profile</Button>
      </CardFooter>
    </Card>
  );
}
