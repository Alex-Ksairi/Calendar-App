import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";

const url = "http://localhost:8000/index.php?action=";

export default function Home() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const res = await fetch(`${url}getProfile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setUsername(data.user.username);
            } else {
                console.error("Unauthorized or failed request");
                navigate("/login");
            }
        };

        fetchProfile();
    }, [navigate]);

    return (
        <div>
            <Calendar username={username} />
        </div>
    );
}