import React, { useState, useEffect } from "react";
import "../styles/Calendar.css";
import Popup from "./Popup";

export default function Calendar({ username }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);

    const url = "http://localhost:8000/backend/index.php?action=";

    const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    const daysOfWeek = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];

    const userId = localStorage.getItem("userID");

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    useEffect(() => {
        fetchEvents();
    }, [currentDate]);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${url}list_events&user_id=${userId}`);
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            console.error("Error fetching events:", err);
        }
    };

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    const handleDayClick = (day) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        setShowPopup(true);
    };

    const handleSaveEvent = async (eventData) => {
        try {
            const response = await fetch(`${url}create_event`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, ...eventData }),
            });
            const result = await response.json();
            if (result.success) {
                fetchEvents(); // 🔄 refresh events
                setShowPopup(false);
            } else {
                alert(result.message || "Failed to create event");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

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

            <div className="calendar-header">
                <button className="nav-button" onClick={handlePrevMonth}>&lt;</button>
                <h2>{monthNames[month]} {year}</h2>
                <button className="nav-button" onClick={handleNextMonth}>&gt;</button>
            </div>

            <div className="calendar-grid">
                {daysOfWeek.map((day) => (
                    <div key={day} className="calendar-day header">{day}</div>
                ))}

                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={"empty" + i} className="calendar-day empty"></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayEvents = events.filter(event => {
                        const eventDate = new Date(event.start_datetime);
                        return (
                            eventDate.getFullYear() === year &&
                            eventDate.getMonth() === month &&
                            eventDate.getDate() === day
                        );
                    });

                    return (
                        <div key={i} className={`calendar-day ${day === new Date().getDate() && month === new Date().getMonth() ? "today" : ""}`} onClick={() => handleDayClick(day)}>
                            <div>{day}</div>
                            {dayEvents.map(event => (
                                <div key={event.id} className="calendar-event">
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {showPopup && (
                <Popup
                    date={selectedDate}
                    onClose={() => setShowPopup(false)}
                    onSave={handleSaveEvent}
                />
            )}
        </div>
    );
}