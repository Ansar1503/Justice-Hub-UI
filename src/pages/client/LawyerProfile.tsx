"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChevronLeft, Mail, MapPin, Phone, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import getVerificationBadge from "@/components/ui/getVerificationBadge";

const fetchLawyerData = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    user_id: id,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    is_blocked: false,
    createdAt: new Date("2022-05-15"),
    mobile: "+1 (555) 123-4567",
    role: "lawyer",
    profile_image: "/placeholder.svg?height=300&width=300",
    dob: "1985-06-12",
    gender: "female",
    address: {
      street: "123 Legal Avenue",
      city: "New York",
      state: "NY",
      country: "USA",
      zip: "10001",
    },
    barcouncil_number: "NY12345678",
    verification_status: "verified",
    practice_areas: ["Family Law", "Divorce Law", "Child Custody"],
    experience: 12,
    specialisation: ["Child Custody", "Property Division", "Mediation"],
    consultation_fee: 200,
    bio: "Sarah Johnson is a dedicated family law attorney with over 12 years of experience helping families navigate complex legal matters. She specializes in divorce proceedings, child custody arrangements, and property division, with a focus on achieving amicable resolutions through mediation whenever possible.",
    education: [
      {
        degree: "Juris Doctor",
        institution: "Harvard Law School",
        year: "2010",
      },
      {
        degree: "Bachelor of Arts in Political Science",
        institution: "Yale University",
        year: "2007",
      },
    ],
    languages: ["English", "Spanish"],
    awards: [
      "Top Family Lawyer - New York Legal Awards 2022",
      "Pro Bono Excellence Award - NY Bar Association 2020",
    ],
    availability: {
      monday: ["9:00 AM - 5:00 PM"],
      tuesday: ["9:00 AM - 5:00 PM"],
      wednesday: ["9:00 AM - 5:00 PM"],
      thursday: ["9:00 AM - 5:00 PM"],
      friday: ["9:00 AM - 3:00 PM"],
    },
  };
};

export default function LawyerDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLawyerData = async () => {
      try {
        if (params.id) {
          const data = await fetchLawyerData(params.id as string);
          setLawyer(data);
        }
      } catch (error) {
        console.error("Error fetching lawyer data:", error);
      } finally {
        setLoading(false);
      }
    };

    getLawyerData();
  }, [params.id]);

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lawyer not found</h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Lawyers
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center">
                <img
                  src={lawyer.profile_image || "/placeholder.svg"}
                  alt={lawyer.name}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <CardTitle className="text-2xl">{lawyer.name}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {lawyer.address?.city || "Location not specified"},{" "}
                  {lawyer.address?.state}
                </CardDescription>
                <div className="mt-2">
                  {getVerificationBadge(lawyer.verification_status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Contact Information
                </h3>
                <Separator className="my-2" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{lawyer.email || "Email not available"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{lawyer.mobile || "Phone not available"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{lawyer.gender || "Gender not specified"}</span>
                  </div>
                  {lawyer.dob && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>DOB: {formatDate(lawyer.dob)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Professional Details
                </h3>
                <Separator className="my-2" />
                <div className="space-y-3">
                  {lawyer.barcouncil_number && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Bar Council Number
                      </p>
                      <p>{lawyer.barcouncil_number}</p>
                    </div>
                  )}
                  {lawyer.experience && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Experience
                      </p>
                      <p>{lawyer.experience} years</p>
                    </div>
                  )}
                  {lawyer.consultation_fee && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Consultation Fee
                      </p>
                      <p className="font-semibold">
                        ${lawyer.consultation_fee}
                      </p>
                    </div>
                  )}
                  {lawyer.createdAt && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Member Since
                      </p>
                      <p>{formatDate(lawyer.createdAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              {lawyer.languages && lawyer.languages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Languages</h3>
                  <Separator className="my-2" />
                  <div className="flex flex-wrap gap-2">
                    {lawyer.languages.map((language: string) => (
                      <Badge key={language} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button className="w-full">Book Consultation</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Detailed Information */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="expertise">Expertise</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {lawyer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {lawyer.bio || "No biography information available."}
                  </p>

                  {lawyer.awards && lawyer.awards.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Awards & Recognition
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {lawyer.awards.map((award: string, index: number) => (
                          <li key={index}>{award}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {lawyer.address && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Office Address
                      </h3>
                      <p>
                        {[
                          lawyer.address.street,
                          lawyer.address.city,
                          lawyer.address.state,
                          lawyer.address.country,
                          lawyer.address.zip,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expertise" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Areas of Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {lawyer.practice_areas &&
                    lawyer.practice_areas.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Practice Areas
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {lawyer.practice_areas.map((area: string) => (
                            <Badge key={area} variant="secondary">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {lawyer.specialisation &&
                    lawyer.specialisation.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Specializations
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {lawyer.specialisation.map((spec: string) => (
                            <Badge key={spec} variant="outline">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Education & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {lawyer.education && lawyer.education.length > 0 ? (
                    <div className="space-y-4">
                      {lawyer.education.map((edu: any, index: number) => (
                        <div
                          key={index}
                          className="border-l-2 border-primary pl-4 py-2"
                        >
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-muted-foreground">
                            {edu.institution}
                          </p>
                          <p className="text-sm">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No education information available.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  {lawyer.availability ? (
                    <div className="space-y-2">
                      {Object.entries(lawyer.availability).map(
                        ([day, hours]: [string, any]) => (
                          <div
                            key={day}
                            className="flex justify-between py-2 border-b last:border-0"
                          >
                            <span className="font-medium capitalize">
                              {day}
                            </span>
                            <span>
                              {Array.isArray(hours) ? hours.join(", ") : hours}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No availability information provided.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
