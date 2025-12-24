// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Pencil, Trash2, Plus } from "lucide-react";

// import { AdminLayout } from "./layout/admin.layout";
// import SearchComponent from "@/components/SearchComponent";
// import PaginationComponent from "@/components/pagination";
// import { useFetchAllSpecializations } from "@/store/tanstack/Queries/SpecializationQueries";
// import { SelectComponent } from "@/components/SelectComponent";
// import {
//   useDeleteSpecialization,
//   useSpecializationMutation,
// } from "@/store/tanstack/mutations/SpecializationMutation";
// import Confirmation from "@/components/Confirmation";
// import { toast } from "sonner";
// import { SpecializationsType } from "@/types/types/SpecializationType";

// export default function Specializations() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [newSpec, setNewSpec] = useState("");
//   const [editIndex, setEditIndex] = useState<string | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [deleteSpec, setDeleteSpec] = useState<SpecializationsType | null>(
//     null
//   );
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [specError, setSpecError] = useState("");
//   const payload = {
//     limit: itemsPerPage,
//     page: currentPage,
//     search: searchTerm,
//   };
//   const { data: specializationsData } = useFetchAllSpecializations(payload);

//   useEffect(() => {
//     if (!isDialogOpen) {
//       setNewSpec("");
//       setEditIndex(null);
//     }
//   }, [isDialogOpen]);
//   const { mutate: DeleteSpec, isPending: deletingSpec } =
//     useDeleteSpecialization(payload);
//   const { mutate: saveSpecialization, isPending: savingSpec } =
//     useSpecializationMutation(payload, editIndex ?? "");
//   const specializations = specializationsData?.data;
//   const handleSave = async () => {
//     if (specError || !newSpec.trim()) {
//       return;
//     }

//     try {
//       await saveSpecialization({ name: newSpec.trim() });
//       setIsDialogOpen(false);
//       setNewSpec("");
//       setEditIndex(null);
//     } catch (error) {
//       console.error("Error while saving specialization", error);
//     }
//   };

//   const handleInput = (val: string) => {
//     setNewSpec(val);

//     if (!val.trim()) {
//       setSpecError("Specialization name is required");
//     } else if (val.trim().length < 3) {
//       setSpecError("Specialization should be at least 3 characters long");
//     } else if (val.trim().length > 50) {
//       setSpecError("Specialization cannot exceed 50 characters");
//     } else if (!/^[A-Za-z\s/&-]+$/.test(val)) {
//       setSpecError(
//         "Only letters, spaces, '-', '/' and '&' are allowed in specialization name"
//       );
//     } else {
//       setSpecError("");
//     }
//   };

//   const handleDelete = async () => {
//     const id = deleteSpec?.id;
//     if (!id) {
//       toast.error("spec id is required");
//       return;
//     }
//     try {
//       await DeleteSpec(id);
//     } catch (error) {
//       console.log("error deleting", error);
//     }
//   };

//   return (
//     <>
//       <AdminLayout>
//         <div className="px-32 py-10">
//           <div className="space-y-8">
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <CardTitle>Specializations</CardTitle>
//                     <CardDescription>
//                       Manage Lawyer Specializations
//                     </CardDescription>
//                   </div>
//                   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                     <DialogTrigger asChild>
//                       <Button>
//                         <Plus className="w-4 h-4 mr-2" />
//                         Add Specialization
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                       <DialogHeader>
//                         <DialogTitle>
//                           {editIndex
//                             ? "Edit Specialization"
//                             : "Add Specialization"}
//                         </DialogTitle>
//                       </DialogHeader>
//                       <Input
//                         value={newSpec}
//                         onChange={(e) => {
//                           const val = e.target.value;
//                           handleInput(val);
//                         }}
//                         placeholder="Enter specialization..."
//                       />
//                       {specError && (
//                         <span className="text-red-600 text-sm mt-1 block">
//                           {specError}
//                         </span>
//                       )}

//                       <DialogFooter>
//                         <Button
//                           variant="outline"
//                           onClick={() => setIsDialogOpen(false)}
//                         >
//                           Cancel
//                         </Button>
//                         <Button disabled={savingSpec} onClick={handleSave}>
//                           {editIndex !== null ? "Update" : "Save"}
//                         </Button>
//                       </DialogFooter>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {/* Search */}
//                 <div className="flex gap-3 mb-4">
//                   <SearchComponent
//                     className="w-full"
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     placeholder="Search specialization..."
//                   />
//                   <SelectComponent
//                     onSelect={(val) => {
//                       const num = Number.parseInt(val);
//                       if (!isNaN(num)) setItemsPerPage(num);
//                     }}
//                     selectedValue={itemsPerPage.toString()}
//                     label="Items per page"
//                     placeholder="Items"
//                     values={["5", "10", "20", "50"]}
//                   />
//                 </div>

//                 {/* Table */}
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>#</TableHead>
//                       <TableHead>Name</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {specializations &&
//                       specializations.length > 0 &&
//                       specializations.map((spec, i) => (
//                         <TableRow key={spec.id}>
//                           <TableCell>
//                             {(currentPage - 1) * itemsPerPage + i + 1}
//                           </TableCell>
//                           <TableCell>{spec.name}</TableCell>
//                           <TableCell className="text-right space-x-2">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               disabled={savingSpec}
//                               onClick={() => {
//                                 setEditIndex(spec.id);
//                                 setNewSpec(spec.name);
//                                 setIsDialogOpen(true);
//                               }}
//                             >
//                               <Pencil className="w-4 h-4 mr-1" /> Edit
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="destructive"
//                               disabled={savingSpec || deletingSpec}
//                               onClick={() => {
//                                 setDeleteSpec(spec);
//                                 setIsDeleteDialogOpen(true);
//                               }}
//                             >
//                               <Trash2 className="w-4 h-4 mr-1" /> Delete
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}

//                     {specializations && specializations.length === 0 && (
//                       <TableRow>
//                         <TableCell
//                           colSpan={3}
//                           className="text-center text-muted-foreground"
//                         >
//                           No specializations found
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>

//                 {/* Pagination */}
//                 <PaginationComponent
//                   currentPage={specializationsData?.currentPage || 1}
//                   handlePageChange={setCurrentPage}
//                   totalPages={specializationsData?.totalPage || 0}
//                   itemsPerPage={itemsPerPage}
//                   totalItems={specializationsData?.totalCount || 0}
//                 />
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </AdminLayout>
//       <Confirmation
//         description="are you sure You want to delete the specialization"
//         handleAction={() => handleDelete()}
//         open={isDeleteDialogOpen}
//         setOpen={setIsDeleteDialogOpen}
//         title={`Delete ${deleteSpec?.name} specialization`}
//         className="bg-red-700 hover:bg-red-500"
//       />
//     </>
//   );
// }
