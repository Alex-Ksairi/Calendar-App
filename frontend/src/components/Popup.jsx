import { useState, useEffect } from "react";
import "../styles/popup.css";

export default function Popup({ date, event, onClose, onSave, onUpdate, onDelete }) {
    const formatDate = (date) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatTime = (date) => {
        if (!date) return "00:00";
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    const now = new Date();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(date ? formatDate(date) : "");
    const [startTime, setStartTime] = useState(formatTime(now));
    const [endDate, setEndDate] = useState(date ? formatDate(date) : "");
    const [endTime, setEndTime] = useState(formatTime(now));
    const [error, setError] = useState("");

    useEffect(() => {
        if (endDate < startDate) {
            setEndDate(startDate);
            setError("End date adjusted because it can't be earlier than start date.");
        } else {
            setError("");
        }
    }, [startDate, endDate]);

    useEffect(() => {
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);

        if (end < start) {
            const nextDay = new Date(start);
            nextDay.setDate(nextDay.getDate() + 1);
            setEndDate(formatDate(nextDay));
            setEndTime(endTime || startTime);
            setError("End time adjusted to next day.");
        }
    }, [startTime, endTime, startDate, endDate]);

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDescription(event.description);
            setStartDate(event.start_datetime?.slice(0, 10) || "");
            setEndDate(event.end_datetime?.slice(0, 10) || "");
            setStartTime(event.start_datetime?.slice(11, 16) || "");
            setStartTime(event.end_datetime?.slice(11, 16) || "");
        } else {
            setTitle("");
            setDescription("");
            setStartDate("");
            setEndDate("");
            setStartTime("");
            setEndTime("");
        }
    }, [event]);

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
                    {event ? (
                        <>
                            <button
                                className="update-button"
                                onClick={() =>
                                    onUpdate({
                                        id: event.id,
                                        title,
                                        description,
                                        start_datetime: `${startDate}T${startTime}:00`,
                                        end_datetime: `${endDate}T${endTime}:00`,
                                    })
                                }
                            >
                                Update
                            </button>

                            <button
                                className="delete-button"
                                onClick={() => onDelete(event.id)}
                            >
                                Delete
                            </button>

                            <button onClick={onClose}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleSave}>Create</button>
                            <button onClick={onClose}>Cancel</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}