import React, { useState, useEffect } from "react";
import "../styles/popup.css";

export default function Popup({ date, onClose, onSave }) {
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    const now = new Date();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(formatDate(date));
    const [startTime, setStartTime] = useState(formatTime(now)); // ⏰ default current time
    const [endDate, setEndDate] = useState(formatDate(date));
    const [endTime, setEndTime] = useState(formatTime(now));
    const [error, setError] = useState("");

    // Ensure endDate is never before startDate
    useEffect(() => {
        if (endDate < startDate) {
            setEndDate(startDate);
            setError("End date adjusted because it can't be earlier than start date.");
        } else {
            setError("");
        }
    }, [startDate, endDate]);

    // Ensure endTime is not before startTime (on same day)
    useEffect(() => {
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);

        if (end <= start) {
            // if times conflict → push end date to next day
            const nextDay = new Date(start);
            nextDay.setDate(nextDay.getDate() + 1);
            setEndDate(formatDate(nextDay));
            setEndTime(endTime || startTime); // keep chosen endTime, or fallback
            setError("End time adjusted to next day.");
        }
    }, [startTime, endTime, startDate, endDate]);

    const handleSave = () => {
        if (!title || !startDate || !startTime || !endDate || !endTime) {
            alert("Please fill in all required fields");
            return;
        }

        const startDatetime = `${startDate}T${startTime}`;
        const endDatetime = `${endDate}T${endTime}`;

        onSave({
            title,
            description,
            start_datetime: startDatetime,
            end_datetime: endDatetime,
        });
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>Create Event</h3>

                <input
                    type="text"
                    placeholder="Event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="date">
                    <h5>Start date</h5>
                    <div className="startdate">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>

                    <h5>End date</h5>
                    <div className="enddate">
                        <input
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className="popup-buttons">
                    <button onClick={handleSave}>Create</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}