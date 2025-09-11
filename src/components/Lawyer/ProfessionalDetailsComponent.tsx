import type React from "react";
import { useContext, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchLawyersProfessionalDetails } from "@/store/tanstack/Queries/lawyersQueries";
import { useAppSelector } from "@/store/redux/Hook";
import Select from "react-select";
import { X } from "lucide-react";
import { useFetchAllSpecializations } from "@/store/tanstack/Queries/SpecializationQueries";
import { useFetchPracticeAreaBySpecIds } from "@/store/tanstack/Queries/PracticeAreaQuery";
import { getCustomStyles, OptionType } from "@/utils/utils";
import { ThemeContext } from "@/context/ThemeProvider";
import { useProfessionalDetailsUpdateMutation } from "@/store/tanstack/mutations/LawyerMutations";

interface PracticeArea {
  id: string;
  name: string;
}

interface Specialization {
  id: string;
  name: string;
}

export interface ProfessionalDetailsFormData {
  description: string;
  practiceAreas: PracticeArea[] | [];
  specialisations: Specialization[] | [];
  experience: number;
  consultationFee: number;
}

export function LawyerProfessionalDetailsForm() {
  const { user } = useAppSelector((st) => st.Auth);
  const { theme } = useContext(ThemeContext);
  const { data: professional, isLoading } = useFetchLawyersProfessionalDetails(
    user?.user_id
  );
  const { isPending: updateLoading, mutateAsync: updateProfessionalDetails } =
    useProfessionalDetailsUpdateMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newSpecializations, setNewSpecialization] = useState<string[]>([]);

  const [formData, setFormData] = useState<ProfessionalDetailsFormData>({
    description: "",
    practiceAreas: [],
    specialisations: [],
    experience: 0,
    consultationFee: 0,
  });

  const { data: practiceAreas } =
    useFetchPracticeAreaBySpecIds(newSpecializations);
  const { data: SpecialisationData } = useFetchAllSpecializations({
    limit: 1000,
    page: 1,
    search: "",
  });
  const specialisations = useMemo(
    () => SpecialisationData?.data || [],
    [SpecialisationData]
  );
  const practiceAreaOptions: OptionType<PracticeArea>[] =
    practiceAreas?.map((area) => ({
      value: String(area.id),
      label: area.name,
      data: area,
    })) ?? [];

  const SpecializationOptions: OptionType<Specialization>[] =
    specialisations?.map((sp) => ({
      value: String(sp.id),
      label: sp.name,
      data: sp,
    })) ?? [];
  useEffect(() => {
    if (professional) {
      setFormData({
        description: professional.description || "",
        practiceAreas: professional.practiceAreas || [],
        specialisations: professional.specializations || [],
        experience: professional.experience || 0,
        consultationFee: professional.consultationFee || 0,
      });
    }
  }, [professional]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "experience" || name === "consultationFee"
          ? Number.parseInt(value) || 0
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const removePracticeArea = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      practiceAreas: prev.practiceAreas.filter((area) => area.id !== id),
    }));
  };

  const removeSpecialization = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      specialisations: prev.specialisations.filter((spec) => spec.id !== id),
    }));
  };
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.experience < 1) {
      newErrors.experience = "min 1 year experience requierd";
    }

    if (formData.consultationFee < 100) {
      newErrors.consultationFee = "minimum 100 is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateProfessionalDetails(formData);
      console.log("Submitting professional details:", formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating professional details:", error);
    }
  };

  const handleCancel = () => {
    if (professional) {
      setFormData({
        description: professional.description || "",
        practiceAreas: professional.practiceAreas || [],
        specialisations: professional.specializations || [],
        experience: professional.experience || 0,
        consultationFee: professional.consultationFee || 0,
      });
    }
    setErrors({});
    setNewSpecialization([]);
    setIsEditing(false);
  };

  function handlePracticeAreaSelect(val: PracticeArea | undefined) {
    if (!val?.id?.trim()) return;

    setFormData((prev) => {
      if (prev.practiceAreas.some((area) => area.id === val.id)) {
        return prev;
      }
      return {
        ...prev,
        practiceAreas: [...prev.practiceAreas, val],
      };
    });
  }

  function handleSpecializationSelect(val: Specialization | undefined) {
    if (!val?.id?.trim()) return;

    setNewSpecialization((prv) => {
      if (prv.includes(val.id)) {
        return prv;
      }
      return [...prv, val.id];
    });

    setFormData((prev) => {
      if (prev.specialisations.some((spec) => spec.id === val.id)) {
        return prev; // already exists
      }
      return {
        ...prev,
        specialisations: [...prev.specialisations, val],
      };
    });
  }

  const FieldSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24 mb-1" />
      <Skeleton className="h-10 w-full rounded" />
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          {isLoading ? (
            <Skeleton className="h-7 w-48" />
          ) : (
            <CardTitle className="text-xl font-semibold">
              Professional Details
            </CardTitle>
          )}

          {isLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
              disabled={updateLoading}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div>
            {isLoading ? (
              <FieldSkeleton />
            ) : (
              <>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-muted-foreground mb-2 block"
                >
                  Description
                </Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter professional description..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-sm leading-relaxed">
                    {formData.description || "N/A"}
                  </p>
                )}
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Practice Areas */}
            <div>
              {isLoading ? (
                <FieldSkeleton />
              ) : (
                <>
                  <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Practice Areas
                  </Label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {formData.practiceAreas.map((area) => (
                        <Badge
                          key={area.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {area.name}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => removePracticeArea(area.id)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Select
                          className="w-full"
                          styles={getCustomStyles(
                            theme == "dark" ? "dark" : "light"
                          )}
                          placeholder="Select a Practice Area"
                          options={practiceAreaOptions}
                          onChange={(selected) => {
                            if (!selected) return;
                            handlePracticeAreaSelect(
                              selected.data as PracticeArea
                            );
                          }}
                        ></Select>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Specializations */}
            <div>
              {isLoading ? (
                <FieldSkeleton />
              ) : (
                <>
                  <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Specializations
                  </Label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {formData.specialisations.map((specialization) => (
                        <Badge
                          key={specialization.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {specialization.name}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() =>
                                removeSpecialization(specialization.id)
                              }
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Select
                          className="w-full"
                          styles={getCustomStyles(
                            theme == "dark" ? "dark" : "light"
                          )}
                          placeholder="Select a Specialization"
                          options={SpecializationOptions}
                          onChange={(selected) => {
                            if (!selected) return;
                            handleSpecializationSelect(
                              selected.data as Specialization
                            );
                          }}
                        ></Select>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Experience */}
            <div>
              {isLoading ? (
                <FieldSkeleton />
              ) : (
                <>
                  <Label
                    htmlFor="experience"
                    className="text-sm font-medium text-muted-foreground mb-2 block"
                  >
                    Experience
                  </Label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        min="0"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-20"
                      />
                      <span className="text-sm">
                        {formData.experience === 1 ? "year" : "years"}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm font-medium">
                      {formData.experience}{" "}
                      {formData.experience === 1 ? "year" : "years"}
                    </p>
                  )}
                  {errors.experience && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.experience}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Consultation Fee */}
            <div>
              {isLoading ? (
                <FieldSkeleton />
              ) : (
                <>
                  <Label
                    htmlFor="consultationFee"
                    className="text-sm font-medium text-muted-foreground mb-2 block"
                  >
                    Consultation Fee
                  </Label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">₹</span>
                      <Input
                        id="consultationFee"
                        name="consultationFee"
                        type="number"
                        min="0"
                        value={formData.consultationFee}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <p className="text-sm font-medium">
                      ₹{formData.consultationFee?.toLocaleString()}
                    </p>
                  )}
                  {errors.consultationFee && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.consultationFee}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateLoading}>
                {updateLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-xs text-muted-foreground">
              <span>
                {/* Created: {formatDate(new Date(professional?.createdAt || ""))} */}
              </span>
              <span>
                {/* Updated: {formatDate(new Date(professional?.updatedAt ))} */}
              </span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
