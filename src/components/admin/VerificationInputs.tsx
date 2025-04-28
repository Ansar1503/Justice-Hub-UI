// "use client"

// import { useState } from "react"
// import { PlusCircle, X, Save, Settings, Trash2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Switch } from "@/components/ui/switch"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Slider } from "@/components/ui/slider"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { toast } from "@/components/ui/use-toast"

// // Types for our form configuration
// type FieldType = "text" | "number" | "file" | "textarea" | "select" | "multiselect" | "date"

// interface CustomField {
//   id: string
//   name: string
//   description: string
//   type: FieldType
//   required: boolean
//   options?: string[] 
//   maxLength?: number 
//   min?: number 
//   max?: number 
//   acceptedFileTypes?: string[]
// }

// interface VerificationFormConfig {
  
//   description: {
//     enabled: boolean
//     required: boolean
//     maxLength: number
//   }
//   barCouncilNumber: {
//     enabled: boolean
//     required: boolean
//     validation: string 
//   }
//   barCouncilId: {
//     enabled: boolean
//     required: boolean
//     acceptedFileTypes: string[]
//     maxFileSize: number 
//   }
//   enrollmentCertificateNumber: {
//     enabled: boolean
//     required: boolean
//     validation: string 
//   }
//   enrollmentCertificateId: {
//     enabled: boolean
//     required: boolean
//     acceptedFileTypes: string[]
//     maxFileSize: number 
//   }
//   certificateOfPracticeNumber: {
//     enabled: boolean
//     required: boolean
//     validation: string 
//   }
//   certificateOfPractice: {
//     enabled: boolean
//     required: boolean
//     acceptedFileTypes: string[]
//     maxFileSize: number 
//   }
//   practiceAreas: {
//     enabled: boolean
//     required: boolean
//     options: string[]
//     maxSelections: number
//   }
//   experience: {
//     enabled: boolean
//     required: boolean
//     min: number
//     max: number
//   }
//   specialisation: {
//     enabled: boolean
//     required: boolean
//     options: string[]
//     maxSelections: number
//   }
//   consultationFee: {
//     enabled: boolean
//     required: boolean
//     min: number
//     max: number
//     currency: string
//   }
//   // Custom fields
//   customFields: CustomField[]
// }


// const defaultConfig: VerificationFormConfig = {
//   description: {
//     enabled: true,
//     required: false,
//     maxLength: 500,
//   },
//   barCouncilNumber: {
//     enabled: true,
//     required: true,
//     validation: ".*",
//   },
//   barCouncilId: {
//     enabled: true,
//     required: true,
//     acceptedFileTypes: ["image/jpeg", "image/png", "application/pdf"],
//     maxFileSize: 5,
//   },
//   enrollmentCertificateNumber: {
//     enabled: true,
//     required: true,
//     validation: ".*",
//   },
//   enrollmentCertificateId: {
//     enabled: true,
//     required: true,
//     acceptedFileTypes: ["image/jpeg", "image/png", "application/pdf"],
//     maxFileSize: 5,
//   },
//   certificateOfPracticeNumber: {
//     enabled: true,
//     required: false,
//     validation: ".*",
//   },
//   certificateOfPractice: {
//     enabled: true,
//     required: true,
//     acceptedFileTypes: ["image/jpeg", "image/png", "application/pdf"],
//     maxFileSize: 5,
//   },
//   practiceAreas: {
//     enabled: true,
//     required: true,
//     options: [],
//     maxSelections: 5,
//   },
//   experience: {
//     enabled: true,
//     required: true,
//     min: 0,
//     max: 50,
//   },
//   specialisation: {
//     enabled: true,
//     required: true,
//     options: [],
//     maxSelections: 5,
//   },
//   consultationFee: {
//     enabled: true,
//     required: true,
//     min: 0,
//     max: 100000,
//     currency: "₹",
//   },
//   customFields: [],
// }

// export default function VerificationInputManager() {
//   const [config, setConfig] = useState<VerificationFormConfig>(defaultConfig)
//   const [newOption, setNewOption] = useState("")
//   const [newCustomField, setNewCustomField] = useState<CustomField>({
//     id: "",
//     name: "",
//     description: "",
//     type: "text",
//     required: false,
//   })
//   const [editingField, setEditingField] = useState<string | null>(null)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)

//   // Handle toggle for enabled/required fields
//   const handleToggle = (section: keyof VerificationFormConfig, field: string, value: boolean) => {
//     setConfig({
//       ...config,
//       [section]: {
//         ...config[section],
//         [field]: value,
//       },
//     })
//   }

//   // Handle input change for field configurations
//   const handleInputChange = (section: keyof VerificationFormConfig, field: string, value: any) => {
//     setConfig({
//       ...config,
//       [section]: {
//         ...config[section],
//         [field]: value,
//       },
//     })
//   }

//   // Add option to multiselect fields
//   const addOption = (section: "practiceAreas" | "specialisation") => {
//     if (newOption.trim()) {
//       setConfig({
//         ...config,
//         [section]: {
//           ...config[section],
//           options: [...config[section].options, newOption.trim()],
//         },
//       })
//       setNewOption("")
//     }
//   }

//   // Remove option from multiselect fields
//   const removeOption = (section: "practiceAreas" | "specialisation", index: number) => {
//     setConfig({
//       ...config,
//       [section]: {
//         ...config[section],
//         options: config[section].options.filter((_, i) => i !== index),
//       },
//     })
//   }

//   // Add a new custom field
//   const addCustomField = () => {
//     if (newCustomField.name.trim()) {
//       const newField = {
//         ...newCustomField,
//         id: `custom-${Date.now()}`,
//       }

//       setConfig({
//         ...config,
//         customFields: [...config.customFields, newField],
//       })

//       setNewCustomField({
//         id: "",
//         name: "",
//         description: "",
//         type: "text",
//         required: false,
//       })

//       setIsDialogOpen(false)
//     }
//   }

//   // Update an existing custom field
//   const updateCustomField = () => {
//     if (editingField && newCustomField.name.trim()) {
//       setConfig({
//         ...config,
//         customFields: config.customFields.map((field) => (field.id === editingField ? newCustomField : field)),
//       })

//       setNewCustomField({
//         id: "",
//         name: "",
//         description: "",
//         type: "text",
//         required: false,
//       })

//       setEditingField(null)
//       setIsDialogOpen(false)
//     }
//   }

//   // Edit a custom field
//   const editCustomField = (field: CustomField) => {
//     setNewCustomField(field)
//     setEditingField(field.id)
//     setIsDialogOpen(true)
//   }

//   // Remove a custom field
//   const removeCustomField = (id: string) => {
//     setConfig({
//       ...config,
//       customFields: config.customFields.filter((field) => field.id !== id),
//     })
//   }

//   // Add option to custom field
//   const addCustomFieldOption = () => {
//     if (newOption.trim()) {
//       setNewCustomField({
//         ...newCustomField,
//         options: [...(newCustomField.options || []), newOption.trim()],
//       })
//       setNewOption("")
//     }
//   }

//   // Remove option from custom field
//   const removeCustomFieldOption = (index: number) => {
//     setNewCustomField({
//       ...newCustomField,
//       options: newCustomField.options?.filter((_, i) => i !== index),
//     })
//   }

//   // Save the configuration
//   const saveConfiguration = () => {
//     // Here you would typically send the config to your backend
//     console.log("Saving configuration:", config)
//     toast({
//       title: "Configuration saved",
//       description: "The verification form configuration has been updated.",
//     })
//   }

//   return (
//     <div className="container mx-auto py-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold">Verification Form Configuration</h1>
//           <p className="text-muted-foreground">Configure the inputs lawyers need to provide during verification</p>
//         </div>
//         <Button onClick={saveConfiguration}>
//           <Save className="mr-2 h-4 w-4" />
//           Save Configuration
//         </Button>
//       </div>

//       <Tabs defaultValue="default-fields">
//         <TabsList className="mb-4">
//           <TabsTrigger value="default-fields">Default Fields</TabsTrigger>
//           <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
//           <TabsTrigger value="preview">Preview</TabsTrigger>
//         </TabsList>

//         <TabsContent value="default-fields">
//           <div className="grid gap-6">
//             <Accordion type="multiple" defaultValue={["basic", "documents", "professional"]}>
//               {/* Basic Information */}
//               <AccordionItem value="basic">
//                 <AccordionTrigger>
//                   <div className="flex items-center">
//                     <Settings className="mr-2 h-5 w-5" />
//                     <span>Basic Information</span>
//                   </div>
//                 </AccordionTrigger>
//                 <AccordionContent>
//                   <Card>
//                     <CardContent className="pt-6">
//                       {/* Description Field */}
//                       <div className="mb-6 border-b pb-4">
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="text-lg font-medium">Description</h3>
//                             <p className="text-sm text-muted-foreground">
//                               Allow lawyers to provide additional information
//                             </p>
//                           </div>
//                           <div className="flex items-center space-x-4">
//                             <div className="flex items-center space-x-2">
//                               <Switch
//                                 id="description-enabled"
//                                 checked={config.description.enabled}
//                                 onCheckedChange={(checked) => handleToggle("description", "enabled", checked)}
//                               />
//                               <Label htmlFor="description-enabled">Enabled</Label>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <Switch
//                                 id="description-required"
//                                 checked={config.description.required}
//                                 onCheckedChange={(checked) => handleToggle("description", "required", checked)}
//                                 disabled={!config.description.enabled}
//                               />
//                               <Label htmlFor="description-required">Required</Label>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="description-max-length">Maximum Length</Label>
//                             <div className="flex items-center space-x-2">
//                               <Input
//                                 id="description-max-length"
//                                 type="number"
//                                 value={config.description.maxLength}
//                                 onChange={(e) =>
//                                   handleInputChange("description", "maxLength", Number.parseInt(e.target.value) || 0)
//                                 }
//                                 disabled={!config.description.enabled}
//                                 min={1}
//                               />
//                               <span>characters</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </AccordionContent>
//               </AccordionItem>

//               {/* Document Fields */}
//               <AccordionItem value="documents">
//                 <AccordionTrigger>
//                   <div className="flex items-center">
//                     <Settings className="mr-2 h-5 w-5" />
//                     <span>Document Fields</span>
//                   </div>
//                 </AccordionTrigger>
//                 <AccordionContent>
//                   <Card>
//                     <CardContent className="pt-6">
//                       {/* Bar Council Information */}
//                       <div className="mb-6 border-b pb-4">
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="text-lg font-medium">Bar Council Information</h3>
//                             <p className="text-sm text-muted-foreground">
//                               Configure bar council number and ID requirements
//                             </p>
//                           </div>
//                         </div>

//                         <div className="space-y-6">
//                           {/* Bar Council Number */}
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <div className="flex justify-between items-center mb-2">
//                                 <Label htmlFor="bar-council-number">Bar Council Number</Label>
//                                 <div className="flex items-center space-x-2">
//                                   <Switch
//                                     id="bar-council-number-required"
//                                     checked={config.barCouncilNumber.required}
//                                     onCheckedChange={(checked) => handleToggle("barCouncilNumber", "required", checked)}
//                                   />
//                                   <Label htmlFor="bar-council-number-required">Required</Label>
//                                 </div>
//                               </div>
//                               <Input
//                                 id="bar-council-number-validation"
//                                 placeholder="Validation pattern (regex)"
//                                 value={config.barCouncilNumber.validation}
//                                 onChange={(e) => handleInputChange("barCouncilNumber", "validation", e.target.value)}
//                               />
//                               <p className="text-xs text-muted-foreground mt-1">
//                                 Enter a regex pattern for validation or leave empty for no validation
//                               </p>
//                             </div>

//                             {/* Bar Council ID */}
//                             <div>
//                               <div className="flex justify-between items-center mb-2">
//                                 <Label htmlFor="bar-council-id">Bar Council ID</Label>
//                                 <div className="flex items-center space-x-2">
//                                   <Switch
//                                     id="bar-council-id-required"
//                                     checked={config.barCouncilId.required}
//                                     onCheckedChange={(checked) => handleToggle("barCouncilId", "required", checked)}
//                                   />
//                                   <Label htmlFor="bar-council-id-required">Required</Label>
//                                 </div>
//                               </div>
//                               <div className="space-y-2">
//                                 <div className="flex items-center space-x-2">
//                                   <Input
//                                     id="bar-council-id-max-size"
//                                     type="number"
//                                     value={config.barCouncilId.maxFileSize}
//                                     onChange={(e) =>
//                                       handleInputChange(
//                                         "barCouncilId",
//                                         "maxFileSize",
//                                         Number.parseInt(e.target.value) || 1,
//                                       )
//                                     }
//                                     min={1}
//                                   />
//                                   <span>MB max</span>
//                                 </div>
//                                 <div>
//                                   <Label htmlFor="bar-council-id-types" className="text-sm">
//                                     Accepted File Types
//                                   </Label>
//                                   <div className="flex flex-wrap gap-2 mt-1">
//                                     {["image/jpeg", "image/png", "application/pdf"].map((type) => (
//                                       <Badge
//                                         key={type}
//                                         variant={
//                                           config.barCouncilId.acceptedFileTypes.includes(type) ? "default" : "outline"
//                                         }
//                                         className="cursor-pointer"
//                                         onClick={() => {
//                                           const types = config.barCouncilId.acceptedFileTypes.includes(type)
//                                             ? config.barCouncilId.acceptedFileTypes.filter((t) => t !== type)
//                                             : [...config.barCouncilId.acceptedFileTypes, type]

//                                           handleInputChange("barCouncilId", "acceptedFileTypes", types)
//                                         }}
//                                       >
//                                         {type === "image/jpeg" ? "JPEG" : type === "image/png" ? "PNG" : "PDF"}
//                                       </Badge>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Enrollment Certificate */}
//                       <div className="mb-6 border-b pb-4">
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="text-lg font-medium">Enrollment Certificate</h3>
//                             <p className="text-sm text-muted-foreground">
//                               Configure enrollment certificate number and ID requirements
//                             </p>
//                           </div>
//                         </div>

//                         <div className="space-y-6">
//                           {/* Enrollment Certificate Number */}
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <div className="flex justify-between items-center mb-2">
//                                 <Label htmlFor="enrollment-number">Enrollment Certificate Number</Label>
//                                 <div className="flex items-center space-x-2">
//                                   <Switch
//                                     id="enrollment-number-required"
//                                     checked={config.enrollmentCertificateNumber.required}
//                                     onCheckedChange={(checked) =>
//                                       handleToggle("enrollmentCertificateNumber", "required", checked)
//                                     }
//                                   />
//                                   <Label htmlFor="enrollment-number-required">Required</Label>
//                                 </div>
//                               </div>
//                               <Input
//                                 id="enrollment-number-validation"
//                                 placeholder="Validation pattern (regex)"
//                                 value={config.enrollmentCertificateNumber.validation}
//                                 onChange={(e) =>
//                                   handleInputChange("enrollmentCertificateNumber", "validation", e.target.value)
//                                 }
//                               />
//                               <p className="text-xs text-muted-foreground mt-1">
//                                 Enter a regex pattern for validation or leave empty for no validation
//                               </p>
//                             </div>

//                             {/* Enrollment Certificate ID */}
//                             <div>
//                               <div className="flex justify-between items-center mb-2">
//                                 <Label htmlFor="enrollment-id">Enrollment Certificate ID</Label>
//                                 <div className="flex items-center space-x-2">
//                                   <Switch
//                                     id="enrollment-id-required"
//                                     checked={config.enrollmentCertificateId.required}
//                                     onCheckedChange={(checked) =>
//                                       handleToggle("enrollmentCertificateId", "required", checked)
//                                     }
//                                   />
//                                   <Label htmlFor="enrollment-id-required">Required</Label>
//                                 </div>
//                               </div>
//                               <div className="space-y-2">
//                                 <div className="flex items-center space-x-2">
//                                   <Input
//                                     id="enrollment-id-max-size"
//                                     type="number"
//                                     value={config.enrollmentCertificateId.maxFileSize}
//                                     onChange={(e) =>
//                                       handleInputChange(
//                                         "enrollmentCertificateId",
//                                         "maxFileSize",
//                                         Number.parseInt(e.target.value) || 1,
//                                       )
//                                     }
//                                     min={1}
//                                   />
//                                   <span>MB max</span>
//                                 </div>
//                                 <div>
//                                   <Label htmlFor="enrollment-id-types" className="text-sm">
//                                     Accepted File Types
//                                   </Label>
//                                   <div className="flex flex-wrap gap-2 mt-1">
//                                     {["image/jpeg", "image/png", "application/pdf"].map((type) => (
//                                       <Badge
//                                         key={type}
//                                         variant={
//                                           config.enrollmentCertificateId.acceptedFileTypes.includes(type)
//                                             ? "default"
//                                             : "outline"
//                                         }
//                                         className="cursor-pointer"
//                                         onClick={() => {
//                                           const types = config.enrollmentCertificateId.acceptedFileTypes.includes(type)
//                                             ? config.enrollmentCertificateId.acceptedFileTypes.filter((t) => t !== type)
//                                             : [...config.enrollmentCertificateId.acceptedFileTypes, type]

//                                           handleInputChange("enrollmentCertificateId", "acceptedFileTypes", types)
//                                         }}
//                                       >
//                                         {type === "image/jpeg" ? "JPEG" : type === "image/png" ? "PNG" : "PDF"}
//                                       </Badge>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Certificate of Practice */}
//                       <div className="mb-6">
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="text-lg font-medium">Certificate of Practice</h3>
//                             <p className="text-sm text-muted-foreground">
//                               Configure certificate of practice number and document requirements
//                             </p>
//                           </div>
//                         </div>

//                         <div className="space-y-6">
//                           {/* Certificate of Practice Number */}
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <div className="flex justify-between items-center mb-2">
//                                 <Label htmlFor="practice-number">Certificate of Practice Number</Label>
//                                 <div className="flex items-center space-x-2">
//                                   <Switch
//                                     id="practice-number-required"
//                                     checked={config.certificateOfPracticeNumber.required}
//                                     onCheckedChange={(checked) =>
//                                       handleToggle("certificateOfPracticeNumber", "required", checked)
//                                     }
//                                   />
//                                   <Label htmlFor="practice-number-required">Required</Label>
//                                 </div>
//                               </div>
//                               <Input
//                                 id="practice-number-validation"
//                                 placeholder="Validation pattern (regex)"
//                                 value={config.certificateOfPracticeNumber.validation}
//                                 onChange={(e) =>
//                                   handleInputChange("certificateOfPracticeNumber", "validation", e.target.value)
//                                 }
//                               />
//                               <p className="text-xs text-muted-foreground mt-1">
//                                 Enter a regex pattern for validation or leave empty for no validation
//                               </p>
//                             </div>

//                             {/* Certificate of Practice */}
//                             <div>
//                               <div className="flex justify-between items-center mb-2">
//                                 <Label htmlFor="practice-certificate">Certificate of Practice</Label>
//                                 <div className="flex items-center space-x-2">
//                                   <Switch
//                                     id="practice-certificate-required"
//                                     checked={config.certificateOfPractice.required}
//                                     onCheckedChange={(checked) =>
//                                       handleToggle("certificateOfPractice", "required", checked)
//                                     }
//                                   />
//                                   <Label htmlFor="practice-certificate-required">Required</Label>
//                                 </div>
//                               </div>
//                               <div className="space-y-2">
//                                 <div className="flex items-center space-x-2">
//                                   <Input
//                                     id="practice-certificate-max-size"
//                                     type="number"
//                                     value={config.certificateOfPractice.maxFileSize}
//                                     onChange={(e) =>
//                                       handleInputChange(
//                                         "certificateOfPractice",
//                                         "maxFileSize",
//                                         Number.parseInt(e.target.value) || 1,
//                                       )
//                                     }
//                                     min={1}
//                                   />
//                                   <span>MB max</span>
//                                 </div>
//                                 <div>
//                                   <Label htmlFor="practice-certificate-types" className="text-sm">
//                                     Accepted File Types
//                                   </Label>
//                                   <div className="flex flex-wrap gap-2 mt-1">
//                                     {["image/jpeg", "image/png", "application/pdf"].map((type) => (
//                                       <Badge
//                                         key={type}
//                                         variant={
//                                           config.certificateOfPractice.acceptedFileTypes.includes(type)
//                                             ? "default"
//                                             : "outline"
//                                         }
//                                         className="cursor-pointer"
//                                         onClick={() => {
//                                           const types = config.certificateOfPractice.acceptedFileTypes.includes(type)
//                                             ? config.certificateOfPractice.acceptedFileTypes.filter((t) => t !== type)
//                                             : [...config.certificateOfPractice.acceptedFileTypes, type]

//                                           handleInputChange("certificateOfPractice", "acceptedFileTypes", types)
//                                         }}
//                                       >
//                                         {type === "image/jpeg" ? "JPEG" : type === "image/png" ? "PNG" : "PDF"}
//                                       </Badge>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </AccordionContent>
//               </AccordionItem>

//               {/* Professional Details */}
//               <AccordionItem value="professional">
//                 <AccordionTrigger>
//                   <div className="flex items-center">
//                     <Settings className="mr-2 h-5 w-5" />
//                     <span>Professional Details</span>
//                   </div>
//                 </AccordionTrigger>
//                 <AccordionContent>
//                   <Card>
//                     <CardContent className="pt-6">
//                       {/* Practice Areas */}
//                       <div className="mb-6 border-b pb-4">
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="text-lg font-medium">Practice Areas</h3>
//                             <p className="text-sm text-muted-foreground">
//                               Configure practice areas lawyers can select from
//                             </p>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <Switch
//                               id="practice-areas-required"
//                               checked={config.practiceAreas.required}
//                               onCheckedChange={(checked) => handleToggle("practiceAreas", "required", checked)}
//                             />
//                             <Label htmlFor="practice-areas-required">Required</Label>
//                           </div>
//                         </div>

//                         <div className="space-y-4">
//                           <div className="flex items-center space-x-2">
//                             <Label htmlFor="practice-areas-max">Maximum Selections</Label>
//                             <Input
//                               id="practice-areas-max"
//                               type="number"
//                               className="w-20"
//                               value={config.practiceAreas.maxSelections}
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   "practiceAreas",
//                                   "maxSelections",
//                                   Number.parseInt(e.target.value) || 1,
//                                 )
//                               }
//                               min={1}
//                             />
//                           </div>

//                           <div>
//                             <Label>Available Practice Areas</Label>
//                             <div className="flex flex-wrap gap-2 mt-2">
//                               {config.practiceAreas.options.map((area, index) => (
//                                 <Badge key={index} className="flex items-center gap-1">
//                                   {area}
//                                   <button
//                                     type="button"
//                                     onClick={() => removeOption("practiceAreas", index)}
//                                     className="text-xs rounded-full hover:bg-red-500 hover:text-white p-0.5"
//                                   >
//                                     <X className="h-3 w-3" />
//                                   </button>
//                                 </Badge>
//                               ))}
//                               {config.practiceAreas.options.length === 0 && (
//                                 <p className="text-sm text-muted-foreground italic">No practice areas added yet.</p>
//                               )}
//                             </div>

//                             <div className="flex items-center space-x-2 mt-4">
//                               <Input
//                                 value={newOption}
//                                 onChange={(e) => setNewOption(e.target.value)}
//                                 placeholder="Add new practice area"
//                               />
//                               <Button
//                                 type="button"
//                                 size="sm"
//                                 onClick={() => addOption("practiceAreas")}
//                                 disabled={!newOption.trim()}
//                               >
//                                 Add
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Specialisation */}
//                       <div className="mb-6 border-b pb-4">
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="text-lg font-medium">Specialisation</h3>
//                             <p className="text-sm text-muted-foreground">
//                               Configure specialisations lawyers can select from
//                             </p>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <Switch
//                               id="specialisation-required"
//                               checked={config.specialisation.required}
//                               onCheckedChange={(checked) => handleToggle("specialisation", "required", checked)}
//                             />
//                             <Label htmlFor="specialisation-required">Required</Label>
//                           </div>
//                         </div>

//                         <div className="space-y-4">
//                           <div className="flex items-center space-x-2">
//                             <Label htmlFor="specialisation-max">Maximum Selections</Label>
//                             <Input
//                               id="specialisation-max"
//                               type="number"
//                               className="w-20"
//                               value={config.specialisation.maxSelections}
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   "specialisation",
//                                   "maxSelections",
//                                   Number.parseInt(e.target.value) || 1,
//                                 )
//                               }
//                               min={1}
//                             />
//                           </div>

//                           <div>
//                             <Label>Available Specialisations</Label>
//                             <div className="flex flex-wrap gap-2 mt-2">
//                               {config.specialisation.options.map((spec, index) => (
//                                 <Badge key={index} className="flex items-center gap-1">
//                                   {spec}
//                                   <button
//                                     type="button"
//                                     onClick={() => removeOption("specialisation", index)}
//                                     className="text-xs rounded-full hover:bg-red-500 hover:text-white p-0.5"
//                                   >
//                                     <X className="h-3 w-3" />
//                                   </button>
//                                 </Badge>
//                               ))}
//                               {config.specialisation.options.length === 0 && (
//                                 <p className="text-sm text-muted-foreground italic">No specialisations added yet.</p>
//                               )}
//                             </div>

//                             <div className="flex items-center space-x-2 mt-4">
//                               <Input
//                                 value={newOption}
//                                 onChange={(e) => setNewOption(e.target.value)}
//                                 placeholder="Add new specialisation"
//                               />
//                               <Button
//                                 type="button"
//                                 size="sm"
//                                 onClick={() => addOption("specialisation")}
//                                 disabled={!newOption.trim()}
//                               >
//                                 Add
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Experience */}
//                       <div className="mb-6 border-b pb-4">
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="text-lg font-medium">Experience</h3>
//                             <p className="text-sm text-muted-foreground">Configure experience range in years</p>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <Switch
//                               id="experience-required"
//                               checked={config.experience.required}
//                               onCheckedChange={(checked) => handleToggle("experience", "required", checked)}
//                             />
//                             <Label htmlFor="experience-required">Required</Label>
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="experience-min">Minimum Experience (years)</Label>
//                             <Input
//                               id="experience-min"
//                               type="number"
//                               value={config.experience.min}
//                               onChange={(e) =>
//                                 handleInputChange("experience", "min", Number.parseInt(e.target.value) || 0)
//                               }
//                               min={0}
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="experience-max">Maximum Experience (years)</Label>
//                             <Input
//                               id="experience-max"
//                               type="number"
//                               value={config.experience.max}
//                               onChange={(e) =>
//                                 handleInputChange("experience", "max", Number.parseInt(e.target.value) || 1)
//                               }
//                               min={1}
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       {/* Consultation Fee */}
//                       <div>
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="text-lg font-medium">Consultation Fee</h3>
//                             <p className="text-sm text-muted-foreground">Configure consultation fee range</p>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <Switch
//                               id="fee-required"
//                               checked={config.consultationFee.required}
//                               onCheckedChange={(checked) => handleToggle("consultationFee", "required", checked)}
//                             />
//                             <Label htmlFor="fee-required">Required</Label>
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="fee-currency">Currency</Label>
//                             <Select
//                               value={config.consultationFee.currency}
//                               onValueChange={(value) => handleInputChange("consultationFee", "currency", value)}
//                             >
//                               <SelectTrigger id="fee-currency">
//                                 <SelectValue placeholder="Select currency" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="₹">₹ (INR)</SelectItem>
//                                 <SelectItem value="$">$ (USD)</SelectItem>
//                                 <SelectItem value="€">€ (EUR)</SelectItem>
//                                 <SelectItem value="£">£ (GBP)</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="fee-min">Minimum Fee</Label>
//                             <Input
//                               id="fee-min"
//                               type="number"
//                               value={config.consultationFee.min}
//                               onChange={(e) =>
//                                 handleInputChange("consultationFee", "min", Number.parseInt(e.target.value) || 0)
//                               }
//                               min={0}
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="fee-max">Maximum Fee</Label>
//                             <Input
//                               id="fee-max"
//                               type="number"
//                               value={config.consultationFee.max}
//                               onChange={(e) =>
//                                 handleInputChange("consultationFee", "max", Number.parseInt(e.target.value) || 1)
//                               }
//                               min={1}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>
//           </div>
//         </TabsContent>

//         <TabsContent value="custom-fields">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle>Custom Fields</CardTitle>
//                   <CardDescription>
//                     Add additional fields that lawyers need to provide during verification
//                   </CardDescription>
//                 </div>
//                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                   <DialogTrigger asChild>
//                     <Button>
//                       <PlusCircle className="mr-2 h-4 w-4" />
//                       Add Custom Field
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>{editingField ? "Edit Custom Field" : "Add Custom Field"}</DialogTitle>
//                       <DialogDescription>
//                         Configure the custom field that lawyers will need to fill during verification.
//                       </DialogDescription>
//                     </DialogHeader>

//                     <div className="space-y-4 py-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="field-name">Field Name</Label>
//                         <Input
//                           id="field-name"
//                           value={newCustomField.name}
//                           onChange={(e) =>
//                             setNewCustomField({
//                               ...newCustomField,
//                               name: e.target.value,
//                             })
//                           }
//                           placeholder="Enter field name"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="field-description">Description</Label>
//                         <Textarea
//                           id="field-description"
//                           value={newCustomField.description}
//                           onChange={(e) =>
//                             setNewCustomField({
//                               ...newCustomField,
//                               description: e.target.value,
//                             })
//                           }
//                           placeholder="Enter field description"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="field-type">Field Type</Label>
//                         <Select
//                           value={newCustomField.type}
//                           onValueChange={(value: FieldType) =>
//                             setNewCustomField({
//                               ...newCustomField,
//                               type: value,
//                               options: value === "select" || value === "multiselect" ? [""] : undefined,
//                             })
//                           }
//                         >
//                           <SelectTrigger id="field-type">
//                             <SelectValue placeholder="Select field type" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="text">Text</SelectItem>
//                             <SelectItem value="textarea">Text Area</SelectItem>
//                             <SelectItem value="number">Number</SelectItem>
//                             <SelectItem value="date">Date</SelectItem>
//                             <SelectItem value="file">File Upload</SelectItem>
//                             <SelectItem value="select">Dropdown</SelectItem>
//                             <SelectItem value="multiselect">Multi-Select</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="flex items-center space-x-2">
//                         <Switch
//                           id="field-required"
//                           checked={newCustomField.required}
//                           onCheckedChange={(checked) =>
//                             setNewCustomField({
//                               ...newCustomField,
//                               required: checked,
//                             })
//                           }
//                         />
//                         <Label htmlFor="field-required">Required Field</Label>
//                       </div>

//                       {newCustomField.type === "text" && (
//                         <div className="space-y-2">
//                           <Label htmlFor="field-max-length">Maximum Length</Label>
//                           <Input
//                             id="field-max-length"
//                             type="number"
//                             value={newCustomField.maxLength || ""}
//                             onChange={(e) =>
//                               setNewCustomField({
//                                 ...newCustomField,
//                                 maxLength: Number.parseInt(e.target.value) || undefined,
//                               })
//                             }
//                             min={1}
//                             placeholder="No limit"
//                           />
//                         </div>
//                       )}

//                       {newCustomField.type === "textarea" && (
//                         <div className="space-y-2">
//                           <Label htmlFor="field-max-length">Maximum Length</Label>
//                           <Input
//                             id="field-max-length"
//                             type="number"
//                             value={newCustomField.maxLength || ""}
//                             onChange={(e) =>
//                               setNewCustomField({
//                                 ...newCustomField,
//                                 maxLength: Number.parseInt(e.target.value) || undefined,
//                               })
//                             }
//                             min={1}
//                             placeholder="No limit"
//                           />
//                         </div>
//                       )}

//                       {newCustomField.type === "number" && (
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="field-min">Minimum Value</Label>
//                             <Input
//                               id="field-min"
//                               type="number"
//                               value={newCustomField.min !== undefined ? newCustomField.min : ""}
//                               onChange={(e) =>
//                                 setNewCustomField({
//                                   ...newCustomField,
//                                   min: e.target.value ? Number.parseInt(e.target.value) : undefined,
//                                 })
//                               }
//                               placeholder="No minimum"
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="field-max">Maximum Value</Label>
//                             <Input
//                               id="field-max"
//                               type="number"
//                               value={newCustomField.max !== undefined ? newCustomField.max : ""}
//                               onChange={(e) =>
//                                 setNewCustomField({
//                                   ...newCustomField,
//                                   max: e.target.value ? Number.parseInt(e.target.value) : undefined,
//                                 })
//                               }
//                               placeholder="No maximum"
//                             />
//                           </div>
//                         </div>
//                       )}

//                       {newCustomField.type === "file" && (
//                         <div className="space-y-2">
//                           <Label>Accepted File Types</Label>
//                           <div className="flex flex-wrap gap-2">
//                             {[
//                               "image/jpeg",
//                               "image/png",
//                               "application/pdf",
//                               "application/msword",
//                               "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//                             ].map((type) => (
//                               <Badge
//                                 key={type}
//                                 variant={
//                                   (newCustomField.acceptedFileTypes || []).includes(type) ? "default" : "outline"
//                                 }
//                                 className="cursor-pointer"
//                                 onClick={() => {
//                                   const types = newCustomField.acceptedFileTypes || []
//                                   if (types.includes(type)) {
//                                     setNewCustomField({
//                                       ...newCustomField,
//                                       acceptedFileTypes: types.filter((t) => t !== type),
//                                     })
//                                   } else {
//                                     setNewCustomField({
//                                       ...newCustomField,
//                                       acceptedFileTypes: [...types, type],
//                                     })
//                                   }
//                                 }}
//                               >
//                                 {type === "image/jpeg"
//                                   ? "JPEG"
//                                   : type === "image/png"
//                                     ? "PNG"
//                                     : type === "application/pdf"
//                                       ? "PDF"
//                                       : type === "application/msword"
//                                         ? "DOC"
//                                         : "DOCX"}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {(newCustomField.type === "select" || newCustomField.type === "multiselect") && (
//                         <div className="space-y-2">
//                           <Label>Options</Label>
//                           <div className="space-y-2">
//                             {(newCustomField.options || []).map((option, index) => (
//                               <div key={index} className="flex items-center gap-2">
//                                 <Input
//                                   value={option}
//                                   onChange={(e) => {
//                                     const newOptions = [...(newCustomField.options || [])]
//                                     newOptions[index] = e.target.value
//                                     setNewCustomField({
//                                       ...newCustomField,
//                                       options: newOptions,
//                                     })
//                                   }}
//                                   placeholder={`Option ${index + 1}`}
//                                 />
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => removeCustomFieldOption(index)}
//                                   className="text-red-500 hover:text-red-700"
//                                 >
//                                   <X className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             ))}
//                             <div className="flex items-center space-x-2">
//                               <Input
//                                 value={newOption}
//                                 onChange={(e) => setNewOption(e.target.value)}
//                                 placeholder="Add new option"
//                               />
//                               <Button
//                                 type="button"
//                                 size="sm"
//                                 onClick={addCustomFieldOption}
//                                 disabled={!newOption.trim()}
//                               >
//                                 Add
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <DialogFooter>
//                       <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
//                         Cancel
//                       </Button>
//                       <Button onClick={editingField ? updateCustomField : addCustomField}>
//                         {editingField ? "Update" : "Add"} Field
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {config.customFields.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-muted-foreground">No custom fields added yet.</p>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Click the "Add Custom Field" button to add fields that lawyers need to fill.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {config.customFields.map((field) => (
//                     <Card key={field.id} className="overflow-hidden">
//                       <div className="flex items-center justify-between p-4 bg-muted">
//                         <div className="flex items-center gap-2">
//                           <h4 className="font-medium">{field.name}</h4>
//                           {field.required && (
//                             <Badge variant="outline" className="text-red-500 border-red-200">
//                               Required
//                             </Badge>
//                           )}
//                           <Badge variant="outline">
//                             {field.type === "text"
//                               ? "Text"
//                               : field.type === "textarea"
//                                 ? "Text Area"
//                                 : field.type === "number"
//                                   ? "Number"
//                                   : field.type === "date"
//                                     ? "Date"
//                                     : field.type === "file"
//                                       ? "File Upload"
//                                       : field.type === "select"
//                                         ? "Dropdown"
//                                         : field.type === "multiselect"
//                                           ? "Multi-Select"
//                                           : ""}
//                           </Badge>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Button variant="ghost" size="sm" onClick={() => editCustomField(field)}>
//                             <Settings className="h-4 w-4 mr-1" />
//                             Edit
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-red-500 hover:text-red-700"
//                             onClick={() => removeCustomField(field.id)}
//                           >
//                             <Trash2 className="h-4 w-4 mr-1" />
//                             Remove
//                           </Button>
//                         </div>
//                       </div>
//                       <div className="p-4">
//                         {field.description && <p className="text-sm text-muted-foreground mb-2">{field.description}</p>}

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                           {field.type === "text" && field.maxLength && (
//                             <div>
//                               <span className="font-medium">Maximum Length:</span> {field.maxLength} characters
//                             </div>
//                           )}

//                           {field.type === "textarea" && field.maxLength && (
//                             <div>
//                               <span className="font-medium">Maximum Length:</span> {field.maxLength} characters
//                             </div>
//                           )}

//                           {field.type === "number" && (
//                             <>
//                               {field.min !== undefined && (
//                                 <div>
//                                   <span className="font-medium">Minimum Value:</span> {field.min}
//                                 </div>
//                               )}
//                               {field.max !== undefined && (
//                                 <div>
//                                   <span className="font-medium">Maximum Value:</span> {field.max}
//                                 </div>
//                               )}
//                             </>
//                           )}

//                           {field.type === "file" && field.acceptedFileTypes && field.acceptedFileTypes.length > 0 && (
//                             <div>
//                               <span className="font-medium">Accepted File Types:</span>{" "}
//                               {field.acceptedFileTypes
//                                 .map((type) =>
//                                   type === "image/jpeg"
//                                     ? "JPEG"
//                                     : type === "image/png"
//                                       ? "PNG"
//                                       : type === "application/pdf"
//                                         ? "PDF"
//                                         : type === "application/msword"
//                                           ? "DOC"
//                                           : "DOCX",
//                                 )
//                                 .join(", ")}
//                             </div>
//                           )}

//                           {(field.type === "select" || field.type === "multiselect") && field.options && (
//                             <div className="col-span-2">
//                               <span className="font-medium">Options:</span> {field.options.join(", ")}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="preview">
//           <Card>
//             <CardHeader>
//               <CardTitle>Form Preview</CardTitle>
//               <CardDescription>This is how the verification form will appear to lawyers</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="border rounded-md p-6 space-y-6">
//                 <h2 className="text-xl font-bold">Lawyer Verification Form</h2>
//                 <p className="text-muted-foreground">
//                   Please provide the following information to verify your credentials.
//                 </p>

//                 {/* Basic Information */}
//                 {config.description.enabled && (
//                   <div className="space-y-2">
//                     <Label htmlFor="preview-description">
//                       Description
//                       {config.description.required && <span className="text-red-500 ml-1">*</span>}
//                     </Label>
//                     <Textarea id="preview-description" placeholder="Enter additional information" disabled />
//                     {config.description.maxLength && (
//                       <p className="text-xs text-muted-foreground">Maximum {config.description.maxLength} characters</p>
//                     )}
//                   </div>
//                 )}

//                 {/* Bar Council Information */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium">Bar Council Information</h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {config.barCouncilNumber.enabled && (
//                       <div className="space-y-2">
//                         <Label htmlFor="preview-bar-number">
//                           Bar Council Number
//                           {config.barCouncilNumber.required && <span className="text-red-500 ml-1">*</span>}
//                         </Label>
//                         <Input id="preview-bar-number" placeholder="Enter bar council number" disabled />
//                       </div>
//                     )}

//                     {config.barCouncilId.enabled && (
//                       <div className="space-y-2">
//                         <Label htmlFor="preview-bar-id">
//                           Bar Council ID
//                           {config.barCouncilId.required && <span className="text-red-500 ml-1">*</span>}
//                         </Label>
//                         <div className="flex items-center">
//                           <Button variant="outline" disabled className="w-full justify-start text-muted-foreground">
//                             Choose file...
//                           </Button>
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                           Accepted formats:{" "}
//                           {config.barCouncilId.acceptedFileTypes
//                             .map((type) => (type === "image/jpeg" ? "JPEG" : type === "image/png" ? "PNG" : "PDF"))
//                             .join(", ")}{" "}
//                           (Max: {config.barCouncilId.maxFileSize}MB)
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Enrollment Certificate */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium">Enrollment Certificate</h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {config.enrollmentCertificateNumber.enabled && (
//                       <div className="space-y-2">
//                         <Label htmlFor="preview-enrollment-number">
//                           Enrollment Certificate Number
//                           {config.enrollmentCertificateNumber.required && <span className="text-red-500 ml-1">*</span>}
//                         </Label>
//                         <Input
//                           id="preview-enrollment-number"
//                           placeholder="Enter enrollment certificate number"
//                           disabled
//                         />
//                       </div>
//                     )}

//                     {config.enrollmentCertificateId.enabled && (
//                       <div className="space-y-2">
//                         <Label htmlFor="preview-enrollment-id">
//                           Enrollment Certificate ID
//                           {config.enrollmentCertificateId.required && <span className="text-red-500 ml-1">*</span>}
//                         </Label>
//                         <div className="flex items-center">
//                           <Button variant="outline" disabled className="w-full justify-start text-muted-foreground">
//                             Choose file...
//                           </Button>
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                           Accepted formats:{" "}
//                           {config.enrollmentCertificateId.acceptedFileTypes
//                             .map((type) => (type === "image/jpeg" ? "JPEG" : type === "image/png" ? "PNG" : "PDF"))
//                             .join(", ")}{" "}
//                           (Max: {config.enrollmentCertificateId.maxFileSize}MB)
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Certificate of Practice */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium">Certificate of Practice</h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {config.certificateOfPracticeNumber.enabled && (
//                       <div className="space-y-2">
//                         <Label htmlFor="preview-practice-number">
//                           Certificate of Practice Number
//                           {config.certificateOfPracticeNumber.required && <span className="text-red-500 ml-1">*</span>}
//                         </Label>
//                         <Input
//                           id="preview-practice-number"
//                           placeholder="Enter certificate of practice number"
//                           disabled
//                         />
//                       </div>
//                     )}

//                     {config.certificateOfPractice.enabled && (
//                       <div className="space-y-2">
//                         <Label htmlFor="preview-practice-certificate">
//                           Certificate of Practice
//                           {config.certificateOfPractice.required && <span className="text-red-500 ml-1">*</span>}
//                         </Label>
//                         <div className="flex items-center">
//                           <Button variant="outline" disabled className="w-full justify-start text-muted-foreground">
//                             Choose file...
//                           </Button>
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                           Accepted formats:{" "}
//                           {config.certificateOfPractice.acceptedFileTypes
//                             .map((type) => (type === "image/jpeg" ? "JPEG" : type === "image/png" ? "PNG" : "PDF"))
//                             .join(", ")}{" "}
//                           (Max: {config.certificateOfPractice.maxFileSize}MB)
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Professional Details */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium">Professional Details</h3>

//                   {config.practiceAreas.enabled && (
//                     <div className="space-y-2">
//                       <Label>
//                         Practice Areas
//                         {config.practiceAreas.required && <span className="text-red-500 ml-1">*</span>}
//                       </Label>
//                       <div className="flex flex-wrap gap-2">
//                         {config.practiceAreas.options.length > 0 ? (
//                           config.practiceAreas.options.map((area, index) => (
//                             <Badge key={index} variant="outline" className="cursor-not-allowed">
//                               {area}
//                             </Badge>
//                           ))
//                         ) : (
//                           <p className="text-sm text-muted-foreground italic">No practice areas configured yet.</p>
//                         )}
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         Select up to {config.practiceAreas.maxSelections} areas
//                       </p>
//                     </div>
//                   )}

//                   {config.specialisation.enabled && (
//                     <div className="space-y-2">
//                       <Label>
//                         Specialisation
//                         {config.specialisation.required && <span className="text-red-500 ml-1">*</span>}
//                       </Label>
//                       <div className="flex flex-wrap gap-2">
//                         {config.specialisation.options.length > 0 ? (
//                           config.specialisation.options.map((spec, index) => (
//                             <Badge key={index} variant="outline" className="cursor-not-allowed">
//                               {spec}
//                             </Badge>
//                           ))
//                         ) : (
//                           <p className="text-sm text-muted-foreground italic">No specialisations configured yet.</p>
//                         )}
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         Select up to {config.specialisation.maxSelections} specialisations
//                       </p>
//                     </div>
//                   )}

//                   {config.experience.enabled && (
//                     <div className="space-y-2">
//                       <Label htmlFor="preview-experience">
//                         Experience (years)
//                         {config.experience.required && <span className="text-red-500 ml-1">*</span>}
//                       </Label>
//                       <div className="flex items-center gap-4">
//                         <Slider
//                           id="preview-experience"
//                           min={config.experience.min}
//                           max={config.experience.max}
//                           step={1}
//                           value={[Math.floor((config.experience.min + config.experience.max) / 2)]}
//                           className="flex-1"
//                           disabled
//                         />
//                         <span className="w-12 text-center">
//                           {Math.floor((config.experience.min + config.experience.max) / 2)}
//                         </span>
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         Range: {config.experience.min} to {config.experience.max} years
//                       </p>
//                     </div>
//                   )}

//                   {config.consultationFee.enabled && (
//                     <div className="space-y-2">
//                       <Label htmlFor="preview-fee">
//                         Consultation Fee
//                         {config.consultationFee.required && <span className="text-red-500 ml-1">*</span>}
//                       </Label>
//                       <div className="relative">
//                         <span className="absolute left-3 top-1/2 -translate-y-1/2">
//                           {config.consultationFee.currency}
//                         </span>
//                         <Input id="preview-fee" type="number" className="pl-8" disabled />
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         Range: {config.consultationFee.currency}
//                         {config.consultationFee.min} to {config.consultationFee.currency}
//                         {config.consultationFee.max}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Custom Fields */}
//                 {config.customFields.length > 0 && (
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Additional Information</h3>

//                     {config.customFields.map((field) => (
//                       <div key={field.id} className="space-y-2">
//                         <Label htmlFor={`preview-${field.id}`}>
//                           {field.name}
//                           {field.required && <span className="text-red-500 ml-1">*</span>}
//                         </Label>

//                         {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}

//                         {field.type === "text" && (
//                           <Input
//                             id={`preview-${field.id}`}
//                             placeholder={`Enter ${field.name.toLowerCase()}`}
//                             disabled
//                           />
//                         )}

//                         {field.type === "textarea" && (
//                           <Textarea
//                             id={`preview-${field.id}`}
//                             placeholder={`Enter ${field.name.toLowerCase()}`}
//                             disabled
//                           />
//                         )}

//                         {field.type === "number" && (
//                           <Input
//                             id={`preview-${field.id}`}
//                             type="number"
//                             placeholder={`Enter ${field.name.toLowerCase()}`}
//                             disabled
//                           />
//                         )}

//                         {field.type === "date" && <Input id={`preview-${field.id}`} type="date" disabled />}

//                         {field.type === "file" && (
//                           <div className="flex items-center">
//                             <Button variant="outline" disabled className="w-full justify-start text-muted-foreground">
//                               Choose file...
//                             </Button>
//                           </div>
//                         )}

//                         {field.type === "select" && (
//                           <Select disabled>
//                             <SelectTrigger id={`preview-${field.id}`}>
//                               <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {(field.options || []).map((option, index) => (
//                                 <SelectItem key={index} value={option}>
//                                   {option}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         )}

//                         {field.type === "multiselect" && (
//                           <div className="flex flex-wrap gap-2">
//                             {(field.options || []).map((option, index) => (
//                               <Badge key={index} variant="outline" className="cursor-not-allowed">
//                                 {option}
//                               </Badge>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div className="pt-4">
//                   <Button disabled>Submit for Verification</Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }
