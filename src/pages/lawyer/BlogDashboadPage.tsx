import { BlogDashboard } from "@/components/Lawyer/Blog/BlogDashboard";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import Footer from "./layout/Footer";
import { BlogType } from "@/types/types/BlogType";
import { useState } from "react";
import { EditorModal } from "@/components/Lawyer/Blog/EditorModal";
import {
  useAddBlogMutation,
  useDeleteBlogMutation,
  useEditBlogMutation,
  useToggleBlogStatusMutation,
} from "@/store/tanstack/mutations/BlogMutations";

export default function BlogDashboadPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogType | null>(null);
  const { mutateAsync: AddBlog } = useAddBlogMutation();
  const { mutateAsync: editBlog } = useEditBlogMutation();
  const { mutateAsync: deleteBlog } = useDeleteBlogMutation();
  const { mutateAsync: ToggleBlogStatus } = useToggleBlogStatusMutation();

  const handleCreateNew = () => {
    setEditingBlog(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (blog: BlogType) => {
    setEditingBlog(blog);
    setTimeout(() => {
      setIsEditorOpen(true);
    }, 50);
  };

  const handleSave = async (data: {
    title: string;
    content: string;
    coverImage?: File | string;
    isDraft: boolean;
  }) => {
    try {
      if (editingBlog) {
        if (!editingBlog.id) return;
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("isPublished", (!data.isDraft).toString());
        if (typeof data.coverImage === "string") {
          formData.append("coverImage", data.coverImage);
        } else if (data.coverImage instanceof File) {
          formData.append("file", data.coverImage);
        }
        await editBlog({ id: editingBlog.id, params: formData });
      } else {
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("isPublished", (!data.isDraft).toString());
        if (data.coverImage instanceof File) {
          formData.append("file", data.coverImage);
        }
        await AddBlog(formData);
      }
    } catch (error) {
      console.log("Blog saving error:", error);
    }
  };

  const handleClose = () => {
    setIsEditorOpen(false);
    setEditingBlog(null);
  };

  const handleDelete = async (id: string) => {
    if (!id.trim()) return;
    try {
      await deleteBlog(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTogglePublish = async (id: string) => {
    if (!id) return;
    try {
      await ToggleBlogStatus(id);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full p-3">
          <BlogDashboard
            onCreateNew={handleCreateNew}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onTogglePublish={handleTogglePublish}
          />
        </div>
        {isEditorOpen && (
          <EditorModal
            blog={editingBlog}
            onSave={handleSave}
            onClose={handleClose}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
