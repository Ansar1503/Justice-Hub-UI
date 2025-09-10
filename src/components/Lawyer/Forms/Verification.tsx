"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import VerificationInputs from "@/utils/validations/LawyerVerification.Input.Validation";
import { useLawyerVerification } from "@/store/tanstack/mutations";
import { useFetchLawyerData } from "@/store/tanstack/queries";
import { VerificationStatus } from "@/types/types/LawyerTypes";
import { useFetchAllSpecializations } from "@/store/tanstack/Queries/SpecializationQueries";
import { useFetchPracticeAreaBySpecIds } from "@/store/tanstack/Queries/PracticeAreaQuery";

interface LawyerVerificationFormProps {
  setLoading: (loading: boolean) => void;
  setVerificationModalOpen: (open: boolean) => void;
  isOpen: boolean;
}

function LawyerVerificationForm({
  setVerificationModalOpen,
  setLoading,
}: {
  setLoading: (loading: boolean) => void;
  setVerificationModalOpen: (open: boolean) => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    description: "",
    barcouncil_number: "",
    barcouncilid: null as File | null,
    enrollment_certificate_number: "",
    enrollment_certificate: null as File | null,
    certificate_of_practice_number: "",
    certificate_of_practice: null as File | null,
    verification_status: "pending" as VerificationStatus,
    practice_areas: [] as string[],
    experience: 0,
    specialisation: [] as string[],
    consultation_fee: 0,
  });

  const { mutateAsync, isPending } = useLawyerVerification();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const error = VerificationInputs(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const { data } = useFetchLawyerData();
  const lawyerData = data ? data : undefined;

  useEffect(() => {
    if (lawyerData) {
      setFormData({
        ...formData,
        barcouncil_number: lawyerData?.barcouncil_number,
        certificate_of_practice_number:
          lawyerData?.certificate_of_practice_number,
        consultation_fee: lawyerData?.consultation_fee,
        description: lawyerData?.description,
        enrollment_certificate_number:
          lawyerData?.enrollment_certificate_number,
        experience: lawyerData?.experience,
        practice_areas: lawyerData?.practice_areas,
        specialisation: lawyerData?.specialisation,
        verification_status: lawyerData?.verification_status,
      });
    }
  }, [lawyerData]);

  useEffect(() => {
    setLoading(isPending);
  }, [isPending, setLoading]);

  const { data: practiceAreas } = useFetchPracticeAreaBySpecIds(
    formData.specialisation
  );

  const { data: SpecialisationData } = useFetchAllSpecializations({
    limit: 1000,
    page: 1,
    search: "",
  });
  const specialisations = useMemo(
    () => SpecialisationData?.data || [],
    [SpecialisationData?.data]
  );

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [fieldName]: e.target.files[0],
      });
      const error = VerificationInputs(fieldName, e.target.files[0]);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleMultiSelectChange = (value: string, fieldName: string) => {
    const currentValues = formData[
      fieldName as keyof typeof formData
    ] as string[];

    if (Array.isArray(currentValues)) {
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      if (fieldName === "specialisation" && updatedValues.length > 3) {
        setErrors((pr) => ({
          ...pr,
          [fieldName]: "Max 3 Specializations allowed",
        }));
        return;
      }
      setFormData({
        ...formData,
        [fieldName]: updatedValues,
      });

      const error = VerificationInputs(fieldName, updatedValues);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleNumberChange = (value: number, fieldName: string) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    const error = VerificationInputs(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      const error = VerificationInputs(key, value);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully:", formData);

      try {
        await mutateAsync(formData);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }

      setVerificationModalOpen(false);
    } else {
      console.log("Form contains errors:", newErrors);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card className="bg-neutral-300 dark:bg-slate-800 text-gray-800 dark:text-gray-200 shadow-lg shadow-slate-300 dark:shadow-black">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Lawyer Verification
            </CardTitle>
            <CardDescription className="text-gray-700 dark:text-gray-400">
              Add verification documents to complete your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Basic Information
              </h3>
              <div className="grid">
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-gray-800 dark:text-gray-300"
                  >
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself and your professional background"
                    className="min-h-[100px] bg-neutral-300 dark:bg-slate-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Bar Council Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="barcouncil_number"
                    className="text-gray-800 dark:text-gray-300"
                  >
                    Bar Council Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="barcouncil_number"
                    name="barcouncil_number"
                    value={formData.barcouncil_number}
                    onChange={handleInputChange}
                    placeholder="Enter bar council number"
                    className="bg-neutral-300 dark:bg-slate-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                  />
                  {errors.barcouncil_number && (
                    <p className="text-red-500 text-sm">
                      {errors.barcouncil_number}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="barcouncilid"
                    className="text-gray-800 dark:text-gray-300"
                  >
                    Bar Council ID <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="barcouncilid"
                      name="barcouncilid"
                      type="file"
                      onChange={(e) => handleFileChange(e, "barcouncilid")}
                      className="hidden"
                    />
                    <div className="border rounded-md p-2 flex-1 flex items-center justify-between bg-neutral-300 dark:bg-slate-700 border-gray-300 dark:border-gray-600">
                      <span className="truncate text-gray-800 dark:text-gray-200">
                        {formData.barcouncilid
                          ? formData.barcouncilid.name
                          : "No file selected"}
                      </span>
                      <label htmlFor="barcouncilid" className="cursor-pointer">
                        <Upload className="h-5 w-5 text-gray-500" />
                      </label>
                    </div>
                  </div>
                  {errors.barcouncilid && (
                    <p className="text-red-500 text-sm">
                      {errors.barcouncilid}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Enrollment Certificate</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enrollment_certificate_number">
                    Enrollment Certificate Number{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="enrollment_certificate_number"
                    name="enrollment_certificate_number"
                    value={formData.enrollment_certificate_number}
                    onChange={handleInputChange}
                    placeholder="Enter enrollment certificate number"
                    className="bg-neutral-300 dark:bg-slate-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                  />
                  {errors.enrollment_certificate_number && (
                    <p className="text-red-500 text-sm">
                      {errors.enrollment_certificate_number}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollment_certificate">
                    Enrollment Certificate{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="enrollment_certificate"
                      name="enrollment_certificate"
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, "enrollment_certificate")
                      }
                      className="hidden"
                    />
                    <div className="border rounded-md p-2 flex-1 flex items-center justify-between bg-neutral-300 dark:bg-slate-700 border-gray-300 dark:border-gray-600">
                      <span className="truncate text-gray-800 dark:text-gray-200">
                        {formData.enrollment_certificate
                          ? formData.enrollment_certificate.name
                          : "No file selected"}
                      </span>
                      <label
                        htmlFor="enrollment_certificate"
                        className="cursor-pointer"
                      >
                        <Upload className="h-5 w-5 text-gray-500" />
                      </label>
                    </div>
                  </div>
                  {errors.enrollment_certificate && (
                    <p className="text-red-500 text-sm">
                      {errors.enrollment_certificate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Certificate of Practice */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Certificate of Practice</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certificate_of_practice_number">
                    Certificate of Practice Number{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="certificate_of_practice_number"
                    name="certificate_of_practice_number"
                    value={formData.certificate_of_practice_number}
                    onChange={handleInputChange}
                    placeholder="Enter certificate of practice number"
                    className="bg-neutral-300 dark:bg-slate-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                  />
                  {errors.certificate_of_practice_number && (
                    <p className="text-red-500 text-sm">
                      {errors.certificate_of_practice_number}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificate_of_practice">
                    Certificate of Practice{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="certificate_of_practice"
                      name="certificate_of_practice"
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, "certificate_of_practice")
                      }
                      className="hidden"
                    />
                    <div className="border rounded-md p-2 flex-1 flex items-center justify-between bg-neutral-300 dark:bg-slate-700 border-gray-300 dark:border-gray-600">
                      <span className="truncate text-gray-800 dark:text-gray-200">
                        {formData.certificate_of_practice
                          ? formData.certificate_of_practice.name
                          : "No file selected"}
                      </span>
                      <label
                        htmlFor="certificate_of_practice"
                        className="cursor-pointer"
                      >
                        <Upload className="h-5 w-5 text-gray-500" />
                      </label>
                    </div>
                  </div>
                  {errors.certificate_of_practice && (
                    <p className="text-red-500 text-sm">
                      {errors.certificate_of_practice}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Specialisation <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {specialisations &&
                      specialisations.length > 0 &&
                      specialisations.map((spec) => (
                        <Badge
                          key={spec.id}
                          variant={
                            lawyerData && lawyerData.specialisation.length
                              ? lawyerData.specialisation.includes(spec.id)
                                ? "default"
                                : "outline"
                              : formData.specialisation.includes(spec.id)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() =>
                            handleMultiSelectChange(spec.id, "specialisation")
                          }
                        >
                          {spec.name}
                        </Badge>
                      ))}
                  </div>
                  {errors.specialisation && (
                    <p className="text-red-500 text-sm">
                      {errors.specialisation}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>
                    Practice Areas <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {practiceAreas &&
                      practiceAreas.length > 0 &&
                      practiceAreas.map((area) => (
                        <Badge
                          key={area.id}
                          variant={
                            lawyerData && lawyerData.practice_areas?.length
                              ? lawyerData.practice_areas.includes(area.id)
                                ? "default"
                                : "outline"
                              : formData.practice_areas.includes(area.id)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() =>
                            handleMultiSelectChange(area.id, "practice_areas")
                          }
                        >
                          {area.name}
                        </Badge>
                      ))}
                  </div>
                  {errors.practice_areas && (
                    <p className="text-red-500 text-sm">
                      {errors.practice_areas}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">
                    Experience (years) <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="experience"
                      min={0}
                      max={30}
                      step={1}
                      value={[formData.experience]}
                      onValueChange={(value) =>
                        handleNumberChange(value[0], "experience")
                      }
                      className="flex-1"
                    />
                    <span className="w-12 text-center">
                      {formData.experience}
                    </span>
                  </div>
                  {errors.experience && (
                    <p className="text-red-500 text-sm">{errors.experience}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultation_fee">
                    Consultation Fee <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800 dark:text-gray-300">
                      ₹
                    </span>
                    <Input
                      id="consultation_fee"
                      name="consultation_fee"
                      type="number"
                      value={formData.consultation_fee || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^[0-9]+$/.test(value)) {
                          const numValue = value === "" ? 0 : Number(value);
                          setFormData({
                            ...formData,
                            consultation_fee: numValue,
                          });
                          const error = VerificationInputs(
                            "consultation_fee",
                            numValue
                          );
                          setErrors((prev) => ({
                            ...prev,
                            consultation_fee: error,
                          }));
                        }
                      }}
                      className="pl-8 bg-neutral-300 dark:bg-slate-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                      min={0}
                    />
                  </div>
                  {errors.consultation_fee && (
                    <p className="text-red-500 text-sm">
                      {errors.consultation_fee}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit Verification
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}

function LawyerVerificationFormModal({
  setLoading,
  setVerificationModalOpen,
  isOpen,
}: LawyerVerificationFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setVerificationModalOpen}>
      <DialogContent className="dark:bg-slate-800 m-0 max-w-4xl p-0 border-none bg-transparent shadow-none max-h-[90vh] overflow-y-auto scrollbar">
        <LawyerVerificationForm
          setLoading={setLoading}
          setVerificationModalOpen={setVerificationModalOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

export default LawyerVerificationFormModal;
