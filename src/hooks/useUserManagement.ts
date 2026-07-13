import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { User } from "../types/auth";
import type { FormEvent } from "react";
import { sanitizeUserRecord } from "../utils/userSanitizer";

// Define a type for the form that allows an optional password field
type UserFormState = User & { password?: string };

export function useUserManagement() {
  const { users, addUser, updateUser, deleteUser, addLog } = useContext(AuthContext)!;

  // --- UI STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // --- DATA STATES ---
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserFormState>({
    name: "",
    email: "",
    role: "user",
    department: "MIS",
systemAccess: ["read"],
    password: "",
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingEmail(null);
    setUserForm({
      name: "",
      email: "",
      role: "user",
      department: "MIS",
      systemAccess: ["read"],
      password: "", 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingEmail(user.email);
    setUserForm({ ...user, password: "" }); // Password not required on edit
    setIsModalOpen(true);
  };

const submitForm = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

    // Basic Validations
    if (!userForm.name.trim() || !userForm.email.trim()) {
      showToast("All fields are required", "error");
      return;
    }

    // Explicitly check for password only during creation
    if (!editingEmail && (!userForm.password || !userForm.password.trim())) {
      showToast("An initial account password is required", "error");
      return;
    }

    if (editingEmail) {
      const sanitizedUserForm = sanitizeUserRecord(userForm as User);
      const { password: _password, ...updatedUserData } = sanitizedUserForm;
      updateUser(editingEmail, updatedUserData);

      showToast(`User details for "${userForm.name}" updated`, "info");
      addLog("User Management - Update", `Updated details for system user: "${userForm.name}" (${userForm.email})`);
    } else {
      const sanitizedUserForm = sanitizeUserRecord(userForm as User);
      const isDuplicate = users.some((u) => u.email.toLowerCase() === sanitizedUserForm.email.toLowerCase());
      if (isDuplicate) {
        showToast("A user with this email address already exists", "error");
        return;
      }

      addUser(sanitizedUserForm);
      showToast(`User "${userForm.name}" added successfully`, "success");
      addLog("User Management - Register", `Registered new system user: "${userForm.name}" (${userForm.email})`);
    }

    setIsModalOpen(false);
  };

  const startDeleteFlow = (user: User) => {
    setDeletingUser(user);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deletingUser) {
      deleteUser(deletingUser.email);
      showToast(`User "${deletingUser.name}" has been deleted`, "error");
      addLog("User Management - Delete", `Deleted system user: "${deletingUser.name}" (${deletingUser.email})`);
      setIsDeleteOpen(false);
      setDeletingUser(null);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    notification,
    editingEmail,
    deletingUser,
    userForm,
    setUserForm,
    filteredUsers,
    openCreateModal,
    openEditModal,
    submitForm,
    startDeleteFlow,
    confirmDelete,
  };
}