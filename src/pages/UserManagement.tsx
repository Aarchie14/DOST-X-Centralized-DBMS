import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { DeleteConfirmModal } from "../components/common/DeleteConfirmModal";
import { Toast } from "../components/common/Toast";
import { UserToolbar } from "../components/common/UserToolbar";
import { UserTable } from "../components/common/UserTable";
import { UserFormModal } from "../components/common/UserFormModal";
import { useUserManagement } from "../hooks/useUserManagement";


/**
 * UserManagement Component
 * Allows administrators to search, create, modify, and delete users from the system.
 */
export default function UserManagement({
}) {
  const {
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
  } = useUserManagement();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 select-none antialiased">
      <Navbar /> 
      <Sidebar />

      <div className="sm:pl-64 transition-all duration-200">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          <UserToolbar 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
            onAddUserClick={openCreateModal} 
          />

          <UserTable 
            users={filteredUsers} 
            onEdit={openEditModal} 
            onDelete={startDeleteFlow} 
          />

        </main>
      </div>

      {/* --- ADD / EDIT USER DIALOG --- */}
      {isModalOpen && (
        <UserFormModal
          isEdit={!!editingEmail}
          userForm={userForm}
          onFormChange={setUserForm}
          onSubmit={submitForm}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        projectName={deletingUser ? `${deletingUser.name} (${deletingUser.email})` : ""}
      />

      {/* --- TOASTS --- */}
      {notification && <Toast notification={notification} />}
    </div>
  );
}