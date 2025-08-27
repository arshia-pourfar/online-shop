"use client";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import React, { useState, useEffect } from "react";
import SortableTH from "@/components/AdminDashboard/Sortable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faEye,
    faTrash,
    faBan,
    faReply,
    faEyeSlash,
    faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import DeleteConfirmModal from "@/components/AdminDashboard/DeleteConfirmModal";
import BlockConfirmModal from "@/components/AdminDashboard/BlockConfirmModal";
import ReportStatusBadge, { ReportStatus } from "@/components/AdminDashboard/ReportStatusBadge";
import AnswerReportsModal from "@/components/AnswerReportsModal";
import { getReports, deleteReport, saveReport } from '@/lib/api/reports';
import { Report } from "../../types/report";
import { useDebounce } from 'use-debounce';

export default function ReportsPage() {
    // State Management
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Filter and Sort States
    const [globalSearch, setGlobalSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortField, setSortField] = useState<keyof Report | 'generatedBy' | null>(null);
    const [sortAsc, setSortAsc] = useState(true);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Bulk Action States
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [targetIds, setTargetIds] = useState<number[] | null>(null);
    const [confirmMessage, setConfirmMessage] = useState("");

    // Debounced search term for better performance
    const [debouncedGlobalSearch] = useDebounce(globalSearch, 500);

    // Fetch reports from the API
    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const data = await getReports();
                setReports(data as unknown as Report[]);
                setError(null);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred while fetching reports. Please check your backend server.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    // Statistics
    const totalReports = reports.length;
    const generatedReports = reports.filter(r => r.status === "GENERATED").length;
    const failedReports = reports.filter(r => r.status === "FAILED").length;
    const blockedReports = reports.filter(r => r.status === "BLOCKED").length;
    const inProgressReports = reports.filter(r => r.status === "IN_PROGRESS").length;
    const hiddenReports = reports.filter(r => r.status === "HIDDEN").length;
    const answeredReports = reports.filter(r => r.status === "ANSWERED").length;

    // Filter reports based on all criteria
    let filteredReports = reports.filter((r) => {
        const lowerGlobalSearch = debouncedGlobalSearch.toLowerCase();

        const matchGlobalSearch = !debouncedGlobalSearch ||
            r.title.toLowerCase().includes(lowerGlobalSearch) ||
            r.type.toLowerCase().includes(lowerGlobalSearch) ||
            r.status.toLowerCase().includes(lowerGlobalSearch) ||
            r.author?.name?.toLowerCase().includes(lowerGlobalSearch);

        const matchType = !filterType || r.type === filterType;
        const matchStatus = !filterStatus || r.status === filterStatus;

        return matchGlobalSearch && matchType && matchStatus;
    });

    // Sort reports based on the selected field
    if (sortField) {
        filteredReports = filteredReports.sort((a, b) => {
            let valA: string | number | undefined;
            let valB: string | number | undefined;

            if (sortField === "generatedBy") {
                valA = a.author?.name || '';
                valB = b.author?.name || '';
            } else {
                valA = a[sortField] as string | number | undefined;
                valB = b[sortField] as string | number | undefined;
            }

            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }

            if (valA! < valB!) return sortAsc ? -1 : 1;
            if (valA! > valB!) return sortAsc ? 1 : -1;
            return 0;
        });
    }

    // Pagination logic
    const pageCount = Math.ceil(filteredReports.length / itemsPerPage);
    const paginatedReports = filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Handlers
    const onSortClick = (field: keyof Report | 'generatedBy') => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedReports.length && paginatedReports.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedReports.map((r) => r.id));
        }
    };

    const toggleSelectId = (id: number) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]);
    };

    const prepareDelete = () => {
        if (selectedIds.length === 0) return;
        setTargetIds(selectedIds);
        setConfirmMessage(`Are you sure you want to delete ${selectedIds.length} selected reports? This action is irreversible.`);
        setShowDeleteConfirm(true);
    };

    const prepareBlock = () => {
        if (selectedIds.length === 0) return;
        setTargetIds(selectedIds);
        setConfirmMessage(`Are you sure you want to block ${selectedIds.length} selected reports? They will no longer be available.`);
        setShowBlockConfirm(true);
    };

    const toggleHide = async (id: number) => {
        const reportToUpdate = reports.find(r => r.id === id);
        if (!reportToUpdate) return;

        const newStatus = reportToUpdate.status === "HIDDEN" ? "GENERATED" : "HIDDEN";
        try {
            await saveReport({ ...reportToUpdate, status: newStatus as ReportStatus, reportDate: new Date(reportToUpdate.reportDate) });
            setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch (error) {
            console.error("Failed to update report status:", error);
        }
    };

    const toggleBlock = async (id: number) => {
        const reportToUpdate = reports.find(r => r.id === id);
        if (!reportToUpdate) return;

        const newStatus = reportToUpdate.status === "BLOCKED" ? "GENERATED" : "BLOCKED";
        try {
            await saveReport({ ...reportToUpdate, status: newStatus as ReportStatus, reportDate: new Date(reportToUpdate.reportDate) });
            setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch (error) {
            console.error("Failed to update report status:", error);
        }
    };

    const handleAnswer = (selectedReports: Report[], answerText: string) => {
        console.log(`Answering ${selectedReports.length} reports with: "${answerText}"`);
        const idsToAnswer = selectedReports.map(r => r.id);
        setReports(prevReports =>
            prevReports.map(r =>
                idsToAnswer.includes(r.id) ? { ...r, status: "ANSWERED" } : r
            )
        );
        setShowAnswerModal(false);
        setSelectedIds([]);
    };

    const executeDelete = async () => {
        const idsToDelete = targetIds || [];
        try {
            await Promise.all(idsToDelete.map(id => deleteReport(id)));
            setReports(reports.filter(r => !idsToDelete.includes(r.id)));
            setSelectedIds([]);
            setShowDeleteConfirm(false);
            setTargetIds(null);
        } catch (error) {
            console.error("Failed to delete reports:", error);
        }
    };

    const executeBlock = async () => {
        const idsToBlock = targetIds || [];
        try {
            await Promise.all(idsToBlock.map(id => {
                const reportToUpdate = reports.find(r => r.id === id);
                if (reportToUpdate) {
                    return saveReport({ ...reportToUpdate, status: "BLOCKED" as ReportStatus, reportDate: new Date(reportToUpdate.reportDate) });
                }
                return Promise.resolve();
            }));

            setReports(reports.map(r =>
                idsToBlock.includes(r.id) ? { ...r, status: "BLOCKED", fileUrl: "" } : r
            ));
            setSelectedIds([]);
            setShowBlockConfirm(false);
            setTargetIds(null);
        } catch (error) {
            console.error("Failed to block reports:", error);
        }
    };

    // Render logic
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-primary-bg font-sans">
                <div className="text-xl font-semibold text-primary-text">Loading reports...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-primary-bg p-4 font-sans">
                <div className="text-red-500 font-semibold p-4 border rounded-md bg-secondary-bg shadow-lg">
                    Error: {error}. Please ensure your backend server is running and accessible at http://localhost:5000.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <Header />
            <div className="p-8 bg-primary-bg text-primary-text font-sans">
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-secondary-text mb-1">Total Reports</div>
                        <div className="text-2xl font-bold text-primary-text">{totalReports}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-status-positive mb-1">Generated</div>
                        <div className="text-2xl font-bold text-status-positive">{generatedReports}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-status-negative mb-1">Failed</div>
                        <div className="text-2xl font-bold text-status-negative">{failedReports}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-yellow-500 mb-1">In Progress</div>
                        <div className="text-2xl font-bold text-yellow-500">{inProgressReports}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-gray-500 mb-1">Blocked</div>
                        <div className="text-2xl font-bold text-gray-500">{blockedReports}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-red-400 mb-1">Hidden</div>
                        <div className="text-2xl font-bold text-red-400">{hiddenReports}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-purple-500 mb-1">Answered</div>
                        <div className="text-2xl font-bold text-purple-500">{answeredReports}</div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
                    <input
                        type="text"
                        placeholder="Search all reports (title, type, status, author)..."
                        className="flex-1 min-w-52 rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 text-primary-text placeholder-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
                        value={globalSearch}
                        onChange={(e) => { setGlobalSearch(e.target.value); setCurrentPage(1); }}
                    />
                    <div className="relative inline-block min-w-32 max-w-44 w-full">
                        <select
                            className="appearance-none w-full rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 pr-10 text-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
                            value={filterType}
                            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="" className="bg-secondary-bg text-primary-text">All Types</option>
                            <option value="SALES" className="bg-secondary-bg text-primary-text">Sales</option>
                            <option value="INVENTORY" className="bg-secondary-bg text-primary-text">Inventory</option>
                            <option value="CUSTOMER" className="bg-secondary-bg text-primary-text">Customer</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondary-text">
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                    </div>
                    <div className="relative inline-block min-w-32 max-w-44 w-full">
                        <select
                            className="appearance-none w-full rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 pr-10 text-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
                            value={filterStatus}
                            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="" className="bg-secondary-bg text-primary-text">All Statuses</option>
                            <option value="GENERATED" className="bg-secondary-bg text-primary-text">Generated</option>
                            <option value="FAILED" className="bg-secondary-bg text-primary-text">Failed</option>
                            <option value="IN_PROGRESS" className="bg-secondary-bg text-primary-text">In Progress</option>
                            <option value="BLOCKED" className="bg-secondary-bg text-primary-text">Blocked</option>
                            <option value="HIDDEN" className="bg-secondary-bg text-primary-text">Hidden</option>
                            <option value="ANSWERED" className="bg-secondary-bg text-primary-text">Answered</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondary-text">
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <label className="gap-2 select-none inline-flex items-center cursor-pointer group">
                            <div className="w-5 h-5 rounded-md border-2 border-gray-400 group-hover:border-primary flex items-center justify-center transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === paginatedReports.length && paginatedReports.length > 0}
                                    onChange={toggleSelectAll}
                                    className="peer sr-only"
                                />
                                <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            </div>
                            Select All
                        </label>
                        <button
                            disabled={selectedIds.length === 0}
                            onClick={prepareBlock}
                            className={`flex items-center justify-center text-center gap-2 px-4 py-3 rounded-md text-white transition ${selectedIds.length === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"}`}
                        >
                            <FontAwesomeIcon icon={faBan} className="text-sm" />
                            Block ({selectedIds.length})
                        </button>
                        <button
                            disabled={selectedIds.length === 0}
                            onClick={prepareDelete}
                            className={`flex items-center justify-center text-center gap-2 px-4 py-3 rounded-md text-white transition ${selectedIds.length === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}
                        >
                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            Delete ({selectedIds.length})
                        </button>
                    </div>
                    <button
                        className="flex items-center justify-center text-center gap-2 bg-accent text-white px-4 py-3 rounded-md hover:bg-accent/90 transition"
                        onClick={() => {
                            if (selectedIds.length > 0) {
                                setShowAnswerModal(true);
                            } else {
                                console.log("Please select one or more reports to answer.");
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={faReply} className="text-sm" />
                        Answer Selected
                    </button>
                </div>

                {/* Reports Table */}
                <div className="overflow-x-auto rounded-xl shadow bg-secondary-bg border border-secondary-text/30">
                    <table className="min-w-full text-sm text-left table-fixed">
                        <thead className="bg-primary-bg text-accent select-none">
                            <tr>
                                <th className="w-10 px-2 py-3"></th>
                                <SortableTH title="Title" onClick={() => onSortClick("title")} sortable={true} sortAsc={sortAsc} isActive={sortField === "title"} width="w-48" />
                                <SortableTH title="Type" onClick={() => onSortClick("type")} sortable={true} sortAsc={sortAsc} isActive={sortField === "type"} width="w-28" />
                                <SortableTH title="Date" onClick={() => onSortClick("reportDate")} sortable={true} sortAsc={sortAsc} isActive={sortField === "reportDate"} width="w-32" />
                                <SortableTH
                                    title="Generated By"
                                    onClick={() => onSortClick("generatedBy")}
                                    sortable={true}
                                    sortAsc={sortAsc}
                                    isActive={sortField === "generatedBy"}
                                    width="w-32"
                                />
                                <SortableTH title="Status" onClick={() => onSortClick("status")} sortable={true} sortAsc={sortAsc} isActive={sortField === "status"} width="w-28" />
                                <th className="px-2 py-3 w-40">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-6 text-secondary-text">No reports found.</td>
                                </tr>
                            ) : (
                                paginatedReports.map((r) => (
                                    <tr key={r.id} className="border-b last:border-none hover:bg-primary-bg/50 transition">
                                        <td className="px-2 py-2 text-center">
                                            <label className="gap-2 select-none inline-flex items-center cursor-pointer group">
                                                <div className="w-5 h-5 rounded-md border-2 border-gray-400 group-hover:border-primary flex items-center justify-center transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(r.id)}
                                                        onChange={() => toggleSelectId(r.id)}
                                                        className="peer sr-only"
                                                    />
                                                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                </div>
                                            </label>
                                        </td>
                                        <td className="px-2 py-2 font-semibold">{r.title}</td>
                                        <td className="px-2 py-2">{r.type}</td>
                                        <td className="px-2 py-2">{r.reportDate.toLocaleDateString()}</td>
                                        <td className="px-2 py-2">{r.author?.name}</td>
                                        <td className="px-2 py-2">
                                            <ReportStatusBadge status={r.status as ReportStatus} />
                                        </td>
                                        <td className="px-2 h-20 flex items-center gap-2 justify-evenly">
                                            <button
                                                title={r.status === "HIDDEN" ? "Remove Hide" : "Hide Report"}
                                                className={`text-red-400 hover:text-red-600 transition`}
                                                onClick={() => toggleHide(r.id)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={r.status === "HIDDEN" ? faEye : faEyeSlash}
                                                    className="text-xl"
                                                />
                                            </button>
                                            <button
                                                title="View Report"
                                                className={`text-blue-500 ${r.status !== "GENERATED" ? "opacity-50 cursor-not-allowed" : "hover:text-blue-600"}`}
                                                disabled={r.status !== "GENERATED"}
                                                onClick={() => window.open(r.fileUrl || '', '_blank')}
                                            >
                                                <FontAwesomeIcon icon={faEye} className="text-xl" />
                                            </button>
                                            <button
                                                title={r.status === "BLOCKED" ? "Unblock Report" : "Block Report"}
                                                className={`transition ${r.status === "BLOCKED" ? "text-green-500 hover:text-green-600" : "text-yellow-500 hover:text-yellow-600"}`}
                                                onClick={() => toggleBlock(r.id)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={r.status === "BLOCKED" ? faCircleCheck : faBan}
                                                    className="text-xl"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={setCurrentPage} />

                {/* Modals */}
                {showBlockConfirm && (
                    <BlockConfirmModal
                        show={showBlockConfirm}
                        message={confirmMessage}
                        onCancel={() => { setShowBlockConfirm(false); setTargetIds(null); }}
                        onConfirm={executeBlock}
                    />
                )}
                {showDeleteConfirm && (
                    <DeleteConfirmModal
                        show={showDeleteConfirm}
                        message={confirmMessage}
                        onCancel={() => { setShowDeleteConfirm(false); setTargetIds(null); }}
                        onConfirm={executeDelete}
                    />
                )}
                {showAnswerModal && (
                    <AnswerReportsModal
                        show={showAnswerModal}
                        reports={reports.filter(r => selectedIds.includes(r.id)) as unknown as Report[]}
                        onAnswer={handleAnswer as (reports: Report[], answer: string) => void}
                        onCancel={() => setShowAnswerModal(false)}
                    />
                )}
            </div>
        </div>
    );
}