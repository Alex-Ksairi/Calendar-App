import { useState, useEffect, useCallback } from "react";
import "../styles/Calendar.css";
import Popup from "./Popup";

export default function Calendar({ username }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [notification, setNotification] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);

    const url = "http://localhost:8000/backend/index.php?action=";

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const userID = localStorage.getItem("userID");

    useEffect(() => {
        fetchEvents();
    }, [currentDate, userID, url]);

    const fetchEvents = useCallback(async () => {
        try {
            const res = await fetch(`${url}list_events&user_id=${userID}`);
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            console.error("Error fetching events:", err);
        }
    }, [url, userID]);

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    const handleSaveEvent = async (eventData) => {
        try {
            const response = await fetch(`${url}create_event`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userID, ...eventData }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setNotification(`HTTP error: ${response.status} ${response.statusText} - ${errorText}`);
                setTimeout(() => setNotification(""), 3000);
                return;
            }

            const result = await response.json();

            if (result.success) {
                setShowPopup(false);
                setSelectedDate(null);
                await fetchEvents();

                setNotification("Event created successfully!");
                setTimeout(() => setNotification(""), 3000);
            } else {
                setNotification(result.message || "Failed to create event");
                setTimeout(() => setNotification(""), 3000);
            }
        } catch (err) {
            setNotification("An error occurred while creating the event.");
            setTimeout(() => setNotification(""), 3000);
        }
    };

    const handleUpdateEvent = async (eventData) => {
        try {
            const response = await fetch(`${url}update_event`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userID, ...eventData }),
            });

            const result = await response.json();

            if (result.success) {
                setNotification("Event updated successfully!");
                await fetchEvents();
                setShowPopup(false);
                setSelectedEvent(null);
            } else {
                setNotification(result.message || "Failed to update event");
            }
            setTimeout(() => setNotification(""), 3000);
        } catch (err) {
            setNotification("Error updating event");
            setTimeout(() => setNotification(""), 3000);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            const response = await fetch(`${url}delete_event`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const result = await response.json();

            if (result.success) {
                setNotification("Event deleted successfully!");
                await fetchEvents();
                setShowPopup(false);
                setSelectedEvent(null);
            } else {
                setNotification(result.message || "Failed to delete event");
            }
            setTimeout(() => setNotification(""), 3000);
        } catch (err) {
            setNotification("Error deleting event");
            setTimeout(() => setNotification(""), 3000);
        }
    };

    const handleDayClick = (day) => {
        setSelectedDate(new Date(year, month, day));
        setShowPopup(true);
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const jsFirstDay = new Date(year, month, 1).getDay();
    const firstDayOfMonth = (jsFirstDay + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const getEventsForDay = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return events.filter(ev => {
            if(!ev.start_datetime) return false;
            return ev.start_datetime.startsWith(dateStr);
        });
    };

    return (
        <div className="calendar">
            <div className="calendar-top-bar">
                <div className="calendar-user">Welcome, {username}</div>
                <button className="logout-button" onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userID");
                    window.location.href = "/login";
                }}>Logout</button>
            </div>
            {notification && (
                <div className="calendar-notification">
                    {notification}
                </div>
            )}

            <div className="calendar-header">
                <button className="nav-button" onClick={handlePrevMonth}>&lt;</button>
                <h2>{monthNames[month]} {year}</h2>
                <button className="nav-button" onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar-grid">
                {daysOfWeek.map((day) => (<div key={day} className="calendar-day header">{day}</div>))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="calendar-day empty"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayEvents = getEventsForDay(day);
                    return (
                        <div
                            key={day}
                            className={`calendar-day${isToday(day) ? " today" : ""}`}
                            onClick={() => handleDayClick(day)}
                        >
                            <div>{day}</div>
                            {dayEvents.length > 0 && (
                                <ul className="calendar-events">
                                    {dayEvents.map((ev, idx) => (
                                        <li key={ev.id || idx} className="calendar-event" onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedEvent(ev);
                                            setShowPopup(true);
                                        }}>
                                            {ev.title || ev.name || "Untitled Event"}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>

            {showPopup && (
                <Popup
                    date={selectedDate}
                    event={selectedEvent}
                    onClose={() => {
                        setShowPopup(false);
                        setSelectedEvent(null);
                    }}
                    onSave={handleSaveEvent}
                    onUpdate={handleUpdateEvent}
                    onDelete={handleDeleteEvent}
                />
            )}
        </div>
    );
}