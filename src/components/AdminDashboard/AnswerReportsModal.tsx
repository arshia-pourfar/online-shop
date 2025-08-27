// components/AnswerReportsModal.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { Report } from "../../types/report";

interface AnswerReportsModalProps {
    show: boolean;
    reports: Report[];
    onAnswer: (reports: Report[], answer: string) => void;
    onCancel: () => void;
}

export default function AnswerReportsModal({ show, reports, onAnswer, onCancel }: AnswerReportsModalProps) {
    const [answerText, setAnswerText] = useState("");

    if (!show) {
        return null;
    }

    const handleConfirm = () => {
        if (answerText.trim() === "") {
            alert("Please write an answer before submitting.");
            return;
        }
        onAnswer(reports, answerText);
        setAnswerText(""); // Reset the text area
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-sans">
            <div className="bg-secondary-bg p-8 rounded-lg shadow-xl max-w-2xl w-full m-4 border-2 border-accent">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 flex-shrink-0 bg-accent rounded-full flex items-center justify-center text-white">
                        <FontAwesomeIcon icon={faReply} className="text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-text">Answer Reports</h2>
                </div>
                <p className="text-secondary-text mb-4">
                    You are about to respond to the following **{reports.length}** reports:
                </p>
                <ul className="list-disc list-inside bg-primary-bg/50 rounded-md p-4 mb-6 max-h-40 overflow-y-auto">
                    {reports.map((r) => (
                        <li key={r.id} className="text-primary-text">{r.title}</li>
                    ))}
                </ul>
                <textarea
                    className="w-full h-40 p-4 rounded-md border border-secondary-text/30 bg-primary-bg text-primary-text placeholder-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition resize-none"
                    placeholder="Write your answer here..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                />
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 rounded-md border border-secondary-text/30 text-secondary-text hover:bg-primary-bg transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-3 rounded-md bg-accent text-white hover:bg-accent/90 transition"
                    >
                        Submit Answer
                    </button>
                </div>
            </div>
        </div>
    );
}