"use client";

import Header from "@/components/Header";
import Pagination from "@/components/Pagination"; // Using the user's provided Pagination component
import React, { useState, useEffect } from "react";
import { getUsers } from "@/lib/api/users"; // API call to fetch users (customers)
import CustomerModal from "@/components/EditAddCustomerModal"; // Custom modal for adding/editing customers
import DeleteConfirmModal from "@/components/DeleteConfirmModal"; // Confirmation for deletion
import SortableTH from "@/components/Sortable";
import { getStatuses } from "@/lib/api/statuses"; // Now needed again for user statuses
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faEdit,
    faPlus,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import StatusBadge from "@/components/StatusBadge"; // Re-used for User status in table
import { User } from "types/user"; // Import the User type

export default function CustomersPage() {
    const [customers, setCustomers] = useState<User[]>([]);
    const [customerStatuses, setCustomerStatuses] = useState<string[]>([]); // Re-added for status filter and modal

    // State for Filters and Search
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>(""); // Re-added for status filter
    const [sortField, setSortField] = useState<keyof User | null>(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Adjust items per page as needed

    const [selectedIds, setSelectedIds] = useState<string[]>([]); // Changed to string[] to match User.id type

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit">("add");
    const [currentCustomer, setCurrentCustomer] = useState<User | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | 'bulk' | null>(null); // Can be product ID or 'bulk'
    const [deleteConfirmMessage, setDeleteConfirmMessage] = useState(""); // State for delete confirmation message

    // State for general feedback/error messages (e.g., after delete operations)
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);


    // Load Data on Component Mount
    useEffect(() => {
        // Fetch user data (which represents customers)
        getUsers().then(setCustomers);
        // Fetch general statuses which will be used for customer statuses
        getStatuses().then(setCustomerStatuses); // Re-added
    }, []);

    // Customer Statistics (Re-added status counts)
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.status === "ACTIVE").length;
    const inactiveCustomers = customers.filter((c) => c.status === "INACTIVE").length;
    const pendingCustomers = customers.filter((c) => c.status === "PENDING").length;
    const suspendedCustomers = customers.filter((c) => c.status === "SUSPENDED").length;

    // Filter Customers
    let filteredCustomers = customers.filter((user) => {
        const matchSearch =
            !search ||
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            (user.phone && user.phone.toLowerCase().includes(search.toLowerCase())); // Re-added phone search

        const matchStatus = !filterStatus || user.status === filterStatus; // Re-added status filter

        return matchSearch && matchStatus; // Both search and status filter apply
    });

    // Sort Customers
    if (sortField) {
        filteredCustomers = filteredCustomers.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];

            // Handle potential null/undefined values for sorting
            if (valA === null || valA === undefined) valA = "";
            if (valB === null || valB === undefined) valB = "";

            // Ensure consistent type for comparison (e.g., convert to string for comparison if mixed)
            const stringA = String(valA).toLowerCase();
            const stringB = String(valB).toLowerCase();

            if (stringA < stringB) return sortAsc ? -1 : 1;
            if (stringA > stringB) return sortAsc ? 1 : -1;
            return 0;
        });
    }

    // Pagination
    const pageCount = Math.ceil(filteredCustomers.length / itemsPerPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Select All / Individual Customer Selection
    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedCustomers.length && paginatedCustomers.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedCustomers.map((c) => c.id));
        }
    };

    const toggleSelectId = (id: string) => { // Changed id to string
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((sid) => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // Bulk Delete Customers
    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return; // Do nothing if no items are selected

        // Show the confirmation modal for bulk delete
        setDeleteTargetId("bulk"); // Use a special ID to indicate bulk delete
        setDeleteConfirmMessage(`Are you sure you want to delete ${selectedIds.length} selected customers?`);
        setShowDeleteConfirm(true);
    };

    // Save Customer (Add/Edit)
    const handleSave = (user: User) => {
        // This function is called by CustomerModal after its internal API call succeeds.
        // It updates the local state with the saved/updated user.
        if (modalType === "add") {
            setCustomers([user, ...customers]); // Add the new user returned from API
        } else {
            setCustomers(customers.map((c) => (c.id === user.id ? user : c))); // Update the user
        }
        setShowModal(false); // Close the modal
    };

    // Confirm Individual Delete (Shows confirmation modal)
    const confirmDelete = (id: string) => { // Changed id to string
        setDeleteTargetId(id);
        setDeleteConfirmMessage("Are you sure you want to delete this customer?");
        setShowDeleteConfirm(true);
    };

    // Execute Delete (after confirmation from DeleteConfirmModal)
    const executeDelete = async () => {
        if (deleteTargetId === null) {
            console.error("executeDelete called with null deleteTargetId.");
            return;
        }

        try {
            let successMessage = "";
            if (deleteTargetId === "bulk") {
                console.log("Attempting bulk delete for customer IDs:", selectedIds);
                const deleteRequests = selectedIds.map((id) => {
                    console.log(`Sending DELETE request for customer ID: ${id}`);
                    return fetch(`http://localhost:5000/api/users/${id}`, {
                        method: "DELETE",
                    });
                });

                const responses = await Promise.all(deleteRequests);
                const allSuccessful = responses.every((res) => res.ok);

                if (!allSuccessful) {
                    const errorResponses = responses.filter(res => !res.ok);
                    const errorDetails = await Promise.all(errorResponses.map(async res => {
                        try {
                            const errorData = await res.json();
                            return errorData.error || `Status: ${res.status}`;
                        } catch {
                            return `Status: ${res.status} (No JSON response)`;
                        }
                    }));
                    throw new Error(`Some customers could not be deleted: ${errorDetails.join(', ')}`);
                } else {
                    successMessage = "Selected customers successfully deleted.";
                }

                setCustomers((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
                setSelectedIds([]); // Clear selection after deletion
            } else {
                // Individual delete
                console.log(`Attempting individual delete for customer ID: ${deleteTargetId}`);
                const res = await fetch(`http://localhost:5000/api/users/${deleteTargetId}`, { // Adjust API endpoint for users
                    method: "DELETE",
                });

                console.log(`Response status for ID ${deleteTargetId}: ${res.status}`);
                if (!res.ok) {
                    let errorData;
                    try {
                        errorData = await res.json();
                    } catch (e) {
                        console.error("Failed to parse error response as JSON:", e);
                        throw new Error(`Customer deletion failed. Status: ${res.status}`);
                    }
                    throw new Error(errorData.error || "Customer deletion failed.");
                }

                setCustomers((prev) => prev.filter((c) => c.id !== deleteTargetId));
                setSelectedIds((prev) => prev.filter((cid) => cid !== deleteTargetId)); // Also remove from selected
                successMessage = "Customer successfully deleted.";
            }
            setFeedbackMessage(successMessage);
            setFeedbackType('success');

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error during customer deletion:", error);
                setFeedbackMessage(`Customer deletion failed: ${error.message || "An unexpected error occurred."}`);
                setFeedbackType('error');
            }
        } finally {
            setShowDeleteConfirm(false); // Always close the confirmation modal
            setDeleteTargetId(null); // Clear the target ID
            setDeleteConfirmMessage(""); // Clear the message
            // Clear feedback message after a short delay
            setTimeout(() => {
                setFeedbackMessage(null);
                setFeedbackType(null);
            }, 3000); // Message disappears after 3 seconds
        }
    };

    // Sort by column header click
    const onSortClick = (field: keyof User) => {
        if (sortField === field) {
            setSortAsc(!sortAsc); // Toggle sort direction if same field clicked
        } else {
            setSortField(field); // Set new sort field
            setSortAsc(true); // Default to ascending for new field
        }
    };

    // Change page
    const handlePageChange = (page: number) => { // Renamed to match Pagination prop
        if (page < 1 || page > pageCount) return; // Prevent going out of bounds
        setCurrentPage(page);
        setSelectedIds([]); // Clear selection on page change for consistency
    };

    return (
        <div className="w-full h-full flex flex-col">
            <Header /> {/* Admin Header Component */}
            <div className="p-8 bg-primary-bg text-primary-text font-sans">
                {/* Customer Statistics Section (Full) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-secondary-text mb-1">Total Customers</div>
                        <div className="text-2xl font-bold text-primary-text">{totalCustomers}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-status-positive mb-1">Active Customers</div>
                        <div className="text-2xl font-bold text-status-positive">{activeCustomers}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-status-negative mb-1">Inactive Customers</div>
                        <div className="text-2xl font-bold text-status-negative">{inactiveCustomers}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-accent mb-1">Pending Customers</div>
                        <div className="text-2xl font-bold text-accent">{pendingCustomers}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-status-neutral mb-1">Suspended Customers</div>
                        <div className="text-2xl font-bold text-status-neutral">{suspendedCustomers}</div>
                    </div>
                </div>

                {/* Filters and Search Section (Full) */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
                    <input
                        type="text"
                        placeholder="Search customer name, email, or phone..."
                        className="flex-1 min-w-64 rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 text-primary-text placeholder-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1); // Reset page on search
                        }}
                    />
                    {/* Status filter dropdown - Re-added */}
                    <div className="relative inline-block min-w-32 max-w-44 w-full">
                        <select
                            className="appearance-none w-full rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 pr-10 text-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setCurrentPage(1); // Reset page on filter change
                            }}
                        >
                            <option value="" className="bg-secondary-bg text-primary-text">All Statuses</option>
                            {customerStatuses.map((status: string) => (
                                <option key={status} value={status} className="bg-secondary-bg text-primary-text">
                                    {status}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondary-text">
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                    </div>
                </div>

                {/* Bulk Actions and Add Customer Button Section */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <label className="gap-2 select-none inline-flex items-center cursor-pointer group">
                            <div className="w-5 h-5 rounded-md border-2 border-gray-400 group-hover:border-primary flex items-center justify-center transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === paginatedCustomers.length && paginatedCustomers.length > 0}
                                    onChange={toggleSelectAll}
                                    className="peer sr-only"
                                />
                                <svg
                                    className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            Select All
                        </label>
                        <button
                            disabled={selectedIds.length === 0}
                            onClick={handleBulkDelete}
                            className={`flex items-center justify-center text-center gap-2 px-4 py-3 rounded-md text-white transition
                                ${selectedIds.length === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}
                            `}
                        >
                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            Delete Selected ({selectedIds.length})
                        </button>
                    </div>
                    <button
                        className="flex items-center justify-center text-center gap-2 bg-accent text-white px-4 py-3 rounded-md hover:bg-accent/90 transition"
                        onClick={() => {
                            setModalType("add");
                            setCurrentCustomer(null); // Clear current customer for 'add' mode
                            setShowModal(true); // Show the modal
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-sm" />
                        Add Customer
                    </button>
                </div>

                {/* Feedback Message Display */}
                {feedbackMessage && (
                    <div className={`p-3 rounded-md text-sm font-medium text-center mb-4 ${feedbackType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'} shadow-md`}>
                        {feedbackMessage}
                    </div>
                )}

                {/* Customers Table Section */}
                <div className="overflow-x-auto rounded-xl shadow bg-secondary-bg border border-secondary-text/30">
                    <table className="min-w-full text-sm text-left table-fixed">
                        <thead className="bg-primary-bg text-accent select-none">
                            <tr>
                                <th className="w-10 px-2 py-3"></th>
                                <SortableTH
                                    title="Name"
                                    onClick={() => onSortClick("name")}
                                    sortable={true}
                                    sortAsc={sortAsc}
                                    isActive={sortField === "name"}
                                    width="w-48"
                                />
                                <SortableTH
                                    title="Email"
                                    onClick={() => onSortClick("email")}
                                    sortable={true}
                                    sortAsc={sortAsc}
                                    isActive={sortField === "email"}
                                    width="w-64"
                                />
                                <SortableTH
                                    title="Phone"
                                    onClick={() => onSortClick("phone")} // Re-added Phone column
                                    sortable={true}
                                    sortAsc={sortAsc}
                                    isActive={sortField === "phone"}
                                    width="w-36"
                                />
                                <SortableTH
                                    title="Status"
                                    onClick={() => onSortClick("status")} // Re-added Status column
                                    sortable={true}
                                    sortAsc={sortAsc}
                                    isActive={sortField === "status"}
                                    width="w-32"
                                />
                                <th className="px-2 py-3 w-40">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-secondary-text">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedCustomers.map((user) => (
                                    <tr key={user.id} className="border-b last:border-none hover:bg-primary-bg/50 transition">
                                        <td className="px-2 py-2 text-center">
                                            <label className="gap-2 select-none inline-flex items-center cursor-pointer group">
                                                <div className="w-5 h-5 rounded-md border-2 border-gray-400 group-hover:border-primary flex items-center justify-center transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(user.id)}
                                                        onChange={() => toggleSelectId(user.id)}
                                                        className="peer sr-only"
                                                    />
                                                    <svg
                                                        className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                            </label>
                                        </td>
                                        <td className="px-2 py-2 font-semibold">{user.name}</td>
                                        <td className="px-2 py-2">{user.email}</td>
                                        <td className="px-2 py-2">{user.phone || "N/A"}</td>
                                        <td className="px-2 py-2">
                                            {/* Safely pass status to StatusBadge */}
                                            <StatusBadge status={user.status || "UNKNOWN"} />
                                        </td>
                                        <td className="px-2 h-20 flex items-center gap-2 justify-evenly">
                                            <button
                                                title="Edit"
                                                className="text-yellow-400 hover:text-yellow-500"
                                                onClick={() => {
                                                    setModalType("edit");
                                                    setCurrentCustomer(user);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="text-xl" />
                                            </button>
                                            <button
                                                title="Delete"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => confirmDelete(user.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-xl" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Component */}
                <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Modals */}
            {showModal && (
                <CustomerModal
                    type={modalType}
                    customer={currentCustomer}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                    allStatuses={customerStatuses}
                />
            )}

            {showDeleteConfirm && (
                <DeleteConfirmModal
                    show={showDeleteConfirm}
                    message={deleteConfirmMessage}
                    onConfirm={executeDelete}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                        setDeleteTargetId(null);
                        setDeleteConfirmMessage("");
                    }}
                />
            )}
        </div>
    );
}


// "use client";

// import Header from "@/components/Header";
// import Pagination from "@/components/Pagination"; // Using the user's provided Pagination component
// import React, { useState, useEffect } from "react";
// import { getUsers } from "@/lib/api/users"; // API call to fetch users (customers)
// import CustomerModal from "@/components/EditAddCustomerModal"; // Custom modal for adding/editing customers
// import DeleteConfirmModal from "@/components/DeleteConfirmModal"; // Confirmation for deletion
// import SortableTH from "@/components/Sortable";
// import { getStatuses } from "@/lib/api/statuses"; // Now needed again for user statuses
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//     faAngleDown,
//     faEdit,
//     faPlus,
//     faTrash,
// } from "@fortawesome/free-solid-svg-icons";
// import StatusBadge from "@/components/StatusBadge"; // Re-used for User status in table
// import { User } from "types/user"; // Import the User type

// export default function CustomersPage() {
//     const [customers, setCustomers] = useState<User[]>([]);
//     const [customerStatuses, setCustomerStatuses] = useState<string[]>([]); // Re-added for status filter and modal

//     // State for Filters and Search
//     const [search, setSearch] = useState("");
//     const [filterStatus, setFilterStatus] = useState<string>(""); // Re-added for status filter
//     const [sortField, setSortField] = useState<keyof User | null>(null);
//     const [sortAsc, setSortAsc] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 8; // Adjust items per page as needed

//     const [selectedIds, setSelectedIds] = useState<string[]>([]); // Changed to string[] to match User.id type

//     // Modal States
//     const [showModal, setShowModal] = useState(false);
//     const [modalType, setModalType] = useState<"add" | "edit">("add");
//     const [currentCustomer, setCurrentCustomer] = useState<User | null>(null);
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//     const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null); // Changed to string | null

//     // Load Data on Component Mount
//     useEffect(() => {
//         // Fetch user data (which represents customers)
//         getUsers().then(setCustomers);
//         // Fetch general statuses which will be used for customer statuses
//         getStatuses().then(setCustomerStatuses); // Re-added
//     }, []);

//     // Customer Statistics (Re-added status counts)
//     const totalCustomers = customers.length;
//     const activeCustomers = customers.filter((c) => c.status === "ACTIVE").length;
//     const inactiveCustomers = customers.filter((c) => c.status === "INACTIVE").length;
//     const pendingCustomers = customers.filter((c) => c.status === "PENDING").length;
//     const suspendedCustomers = customers.filter((c) => c.status === "SUSPENDED").length;

//     // Filter Customers
//     let filteredCustomers = customers.filter((user) => {
//         const matchSearch =
//             !search ||
//             user.name.toLowerCase().includes(search.toLowerCase()) ||
//             user.email.toLowerCase().includes(search.toLowerCase()) ||
//             (user.phone && user.phone.toLowerCase().includes(search.toLowerCase())); // Re-added phone search

//         const matchStatus = !filterStatus || user.status === filterStatus; // Re-added status filter

//         return matchSearch && matchStatus; // Both search and status filter apply
//     });

//     // Sort Customers
//     if (sortField) {
//         filteredCustomers = filteredCustomers.sort((a, b) => {
//             let valA = a[sortField];
//             let valB = b[sortField];

//             // Handle potential null/undefined values for sorting
//             if (valA === null || valA === undefined) valA = "";
//             if (valB === null || valB === undefined) valB = "";

//             // Ensure consistent type for comparison (e.g., convert to string for comparison if mixed)
//             const stringA = String(valA).toLowerCase();
//             const stringB = String(valB).toLowerCase();

//             if (stringA < stringB) return sortAsc ? -1 : 1;
//             if (stringA > stringB) return sortAsc ? 1 : -1;
//             return 0;
//         });
//     }

//     // Pagination
//     const pageCount = Math.ceil(filteredCustomers.length / itemsPerPage);
//     const paginatedCustomers = filteredCustomers.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     // Select All / Individual Customer Selection
//     const toggleSelectAll = () => {
//         if (selectedIds.length === paginatedCustomers.length && paginatedCustomers.length > 0) {
//             setSelectedIds([]);
//         } else {
//             setSelectedIds(paginatedCustomers.map((c) => c.id));
//         }
//     };

//     const toggleSelectId = (id: string) => { // Changed id to string
//         if (selectedIds.includes(id)) {
//             setSelectedIds(selectedIds.filter((sid) => sid !== id));
//         } else {
//             setSelectedIds([...selectedIds, id]);
//         }
//     };

//     // Bulk Delete Customers
//     const handleBulkDelete = async () => {
//         if (selectedIds.length === 0) return; // Do nothing if no items are selected

//         // Show the confirmation modal for bulk delete
//         setDeleteTargetId("bulk"); // Use a special ID to indicate bulk delete
//         setShowDeleteConfirm(true);
//     };

//     // Save Customer (Add/Edit)
//     const handleSave = (user: User) => {
//         if (modalType === "add") {
//             // For 'add', assign a temporary ID (in a real app, backend would assign it)
//             // Use a string representation of Date.now() for ID
//             setCustomers([{ ...user, id: String(Date.now()) }, ...customers]);
//         } else {
//             // For 'edit', update the existing user in the list
//             setCustomers(customers.map((c) => (c.id === user.id ? user : c)));
//         }
//         setShowModal(false); // Close the modal
//     };

//     // Confirm Individual Delete (Shows confirmation modal)
//     const confirmDelete = (id: string) => { // Changed id to string
//         setDeleteTargetId(id);
//         setShowDeleteConfirm(true);
//     };

//     // Execute Delete (after confirmation from DeleteConfirmModal)
//     const executeDelete = async () => {
//         if (deleteTargetId === "bulk") {
//             try {
//                 const deleteRequests = selectedIds.map((id) =>
//                     fetch(`http://localhost:5000/api/users/${id}`, { // Adjust API endpoint for users
//                         method: "DELETE",
//                     })
//                 );

//                 const responses = await Promise.all(deleteRequests);
//                 const allSuccessful = responses.every((res) => res.ok);

//                 if (!allSuccessful) {
//                     console.warn("Some customers could not be deleted.");
//                 } else {
//                     console.log("Selected customers successfully deleted.");
//                 }

//                 setCustomers((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
//                 setSelectedIds([]); // Clear selection after deletion
//             } catch (error) {
//                 console.error("Error during bulk delete:", error);
//                 console.error("Bulk deletion failed.");
//             } finally {
//                 setShowDeleteConfirm(false); // Always close the confirmation modal
//                 setDeleteTargetId(null); // Clear the target ID
//             }
//         } else if (deleteTargetId !== null) {
//             try {
//                 const res = await fetch(`http://localhost:5000/api/users/${deleteTargetId}`, { // Adjust API endpoint for users
//                     method: "DELETE",
//                 });

//                 if (!res.ok) throw new Error("Failed to delete customer");

//                 // Update the state to remove the deleted customer
//                 setCustomers((prev) => prev.filter((c) => c.id !== deleteTargetId));
//                 setSelectedIds((prev) => prev.filter((cid) => cid !== deleteTargetId)); // Also remove from selected
//                 console.log("Customer successfully deleted.");
//             } catch (error) {
//                 console.error("Error deleting customer:", error);
//                 console.error("Customer deletion failed.");
//             } finally {
//                 setShowDeleteConfirm(false); // Always close the confirmation modal
//                 setDeleteTargetId(null); // Clear the target ID
//             }
//         }
//     };

//     // Sort by column header click
//     const onSortClick = (field: keyof User) => {
//         if (sortField === field) {
//             setSortAsc(!sortAsc); // Toggle sort direction if same field clicked
//         } else {
//             setSortField(field); // Set new sort field
//             setSortAsc(true); // Default to ascending for new field
//         }
//     };

//     // Change page
//     const handlePageChange = (page: number) => { // Renamed to match Pagination prop
//         if (page < 1 || page > pageCount) return; // Prevent going out of bounds
//         setCurrentPage(page);
//         setSelectedIds([]); // Clear selection on page change for consistency
//     };

//     return (
//         <div className="w-full h-full flex flex-col">
//             <Header /> {/* Admin Header Component */}
//             <div className="p-8 bg-primary-bg text-primary-text font-sans">
//                 {/* Customer Statistics Section (Full) */}
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
//                     <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
//                         <div className="text-sm text-secondary-text mb-1">Total Customers</div>
//                         <div className="text-2xl font-bold text-primary-text">{totalCustomers}</div>
//                     </div>
//                     <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
//                         <div className="text-sm text-status-positive mb-1">Active Customers</div>
//                         <div className="text-2xl font-bold text-status-positive">{activeCustomers}</div>
//                     </div>
//                     <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
//                         <div className="text-sm text-status-negative mb-1">Inactive Customers</div>
//                         <div className="text-2xl font-bold text-status-negative">{inactiveCustomers}</div>
//                     </div>
//                     <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
//                         <div className="text-sm text-accent mb-1">Pending Customers</div>
//                         <div className="text-2xl font-bold text-accent">{pendingCustomers}</div>
//                     </div>
//                     <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
//                         <div className="text-sm text-status-neutral mb-1">Suspended Customers</div>
//                         <div className="text-2xl font-bold text-status-neutral">{suspendedCustomers}</div>
//                     </div>
//                 </div>

//                 {/* Filters and Search Section (Full) */}
//                 <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
//                     <input
//                         type="text"
//                         placeholder="Search customer name, email, or phone..."
//                         className="flex-1 min-w-64 rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 text-primary-text placeholder-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
//                         value={search}
//                         onChange={(e) => {
//                             setSearch(e.target.value);
//                             setCurrentPage(1); // Reset page on search
//                         }}
//                     />
//                     {/* Status filter dropdown - Re-added */}
//                     <div className="relative inline-block min-w-32 max-w-44 w-full">
//                         <select
//                             className="appearance-none w-full rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 pr-10 text-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
//                             value={filterStatus}
//                             onChange={(e) => {
//                                 setFilterStatus(e.target.value);
//                                 setCurrentPage(1); // Reset page on filter change
//                             }}
//                         >
//                             <option value="" className="bg-secondary-bg text-primary-text">All Statuses</option>
//                             {customerStatuses.map((status: string) => (
//                                 <option key={status} value={status} className="bg-secondary-bg text-primary-text">
//                                     {status}
//                                 </option>
//                             ))}
//                         </select>
//                         <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondary-text">
//                             <FontAwesomeIcon icon={faAngleDown} />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Bulk Actions and Add Customer Button Section */}
//                 <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
//                     <div className="flex items-center gap-4">
//                         <label className="gap-2 select-none inline-flex items-center cursor-pointer group">
//                             <div className="w-5 h-5 rounded-md border-2 border-gray-400 group-hover:border-primary flex items-center justify-center transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary">
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedIds.length === paginatedCustomers.length && paginatedCustomers.length > 0}
//                                     onChange={toggleSelectAll}
//                                     className="peer sr-only"
//                                 />
//                                 <svg
//                                     className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="3"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                 >
//                                     <polyline points="20 6 9 17 4 12" />
//                                 </svg>
//                             </div>
//                             Select All
//                         </label>
//                         <button
//                             disabled={selectedIds.length === 0}
//                             onClick={handleBulkDelete}
//                             className={`flex items-center justify-center text-center gap-2 px-4 py-3 rounded-md text-white transition
//                                 ${selectedIds.length === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}
//                             `}
//                         >
//                             <FontAwesomeIcon icon={faTrash} className="text-sm" />
//                             Delete Selected ({selectedIds.length})
//                         </button>
//                     </div>
//                     <button
//                         className="flex items-center justify-center text-center gap-2 bg-accent text-white px-4 py-3 rounded-md hover:bg-accent/90 transition"
//                         onClick={() => {
//                             setModalType("add");
//                             setCurrentCustomer(null); // Clear current customer for 'add' mode
//                             setShowModal(true); // Show the modal
//                         }}
//                     >
//                         <FontAwesomeIcon icon={faPlus} className="text-sm" />
//                         Add Customer
//                     </button>
//                 </div>

//                 {/* Customers Table Section */}
//                 <div className="overflow-x-auto rounded-xl shadow bg-secondary-bg border border-secondary-text/30">
//                     <table className="min-w-full text-sm text-left table-fixed">
//                         <thead className="bg-primary-bg text-accent select-none">
//                             <tr>
//                                 <th className="w-10 px-2 py-3"></th>
//                                 <SortableTH
//                                     title="Name"
//                                     onClick={() => onSortClick("name")}
//                                     sortable={true}
//                                     sortAsc={sortAsc}
//                                     isActive={sortField === "name"}
//                                     width="w-48"
//                                 />
//                                 <SortableTH
//                                     title="Email"
//                                     onClick={() => onSortClick("email")}
//                                     sortable={true}
//                                     sortAsc={sortAsc}
//                                     isActive={sortField === "email"}
//                                     width="w-64"
//                                 />
//                                 <SortableTH
//                                     title="Phone"
//                                     onClick={() => onSortClick("phone")} // Re-added Phone column
//                                     sortable={true}
//                                     sortAsc={sortAsc}
//                                     isActive={sortField === "phone"}
//                                     width="w-36"
//                                 />
//                                 <SortableTH
//                                     title="Status"
//                                     onClick={() => onSortClick("status")} // Re-added Status column
//                                     sortable={true}
//                                     sortAsc={sortAsc}
//                                     isActive={sortField === "status"}
//                                     width="w-32"
//                                 />
//                                 <th className="px-2 py-3 w-40">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {paginatedCustomers.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={6} className="text-center py-6 text-secondary-text">
//                                         No customers found.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 paginatedCustomers.map((user) => (
//                                     <tr key={user.id} className="border-b last:border-none hover:bg-primary-bg/50 transition">
//                                         <td className="px-2 py-2 text-center">
//                                             <label className="gap-2 select-none inline-flex items-center cursor-pointer group">
//                                                 <div className="w-5 h-5 rounded-md border-2 border-gray-400 group-hover:border-primary flex items-center justify-center transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary">
//                                                     <input
//                                                         type="checkbox"
//                                                         checked={selectedIds.includes(user.id)}
//                                                         onChange={() => toggleSelectId(user.id)}
//                                                         className="peer sr-only"
//                                                     />
//                                                     <svg
//                                                         className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
//                                                         viewBox="0 0 24 24"
//                                                         fill="none"
//                                                         stroke="currentColor"
//                                                         strokeWidth="3"
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                     >
//                                                         <polyline points="20 6 9 17 4 12" />
//                                                     </svg>
//                                                 </div>
//                                             </label>
//                                         </td>
//                                         <td className="px-2 py-2 font-semibold">{user.name}</td>
//                                         <td className="px-2 py-2">{user.email}</td>
//                                         <td className="px-2 py-2">{user.phone || "N/A"}</td>
//                                         <td className="px-2 py-2">
//                                             {/* Safely pass status to StatusBadge */}
//                                             <StatusBadge status={user.status || "UNKNOWN"} />
//                                         </td>
//                                         <td className="px-2 h-20 flex items-center gap-2 justify-evenly">
//                                             <button
//                                                 title="Edit"
//                                                 className="text-yellow-400 hover:text-yellow-500"
//                                                 onClick={() => {
//                                                     setModalType("edit");
//                                                     setCurrentCustomer(user);
//                                                     setShowModal(true);
//                                                 }}
//                                             >
//                                                 <FontAwesomeIcon icon={faEdit} className="text-xl" />
//                                             </button>
//                                             <button
//                                                 title="Delete"
//                                                 className="text-red-600 hover:text-red-700"
//                                                 onClick={() => confirmDelete(user.id)}
//                                             >
//                                                 <FontAwesomeIcon icon={faTrash} className="text-xl" />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination Component */}
//                 <Pagination
//                     currentPage={currentPage}
//                     pageCount={pageCount}
//                     onPageChange={handlePageChange}
//                 />
//             </div>

//             {/* Modals */}
//             {showModal && (
//                 <CustomerModal
//                     type={modalType}
//                     customer={currentCustomer}
//                     onSave={handleSave}
//                     onClose={() => setShowModal(false)}
//                     allStatuses={customerStatuses}
//                 />
//             )}

//             {showDeleteConfirm && (
//                 <DeleteConfirmModal
//                     show={showDeleteConfirm}
//                     message={deleteTargetId === "bulk" ? `Are you sure you want to delete ${selectedIds.length} selected customers?` : "Are you sure you want to delete this customer?"}
//                     onConfirm={executeDelete}
//                     onCancel={() => {
//                         setShowDeleteConfirm(false);
//                         setDeleteTargetId(null);
//                     }}
//                 />
//             )}
//         </div>
//     );
// }
