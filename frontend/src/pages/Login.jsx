// src/pages/Login.jsx
import React from "react";
import Form from "../components/Form";

export default function Login() {
    const fields = [
        { name: "username", label: "Username", type: "text", required: true },
        { name: "password", label: "Password", type: "password", required: true },
    ];

    const handleLogin = (data) => {
        console.log("Login data:", data);
        // Call API to login
    };

    return (
        <div>
            <Form fields={fields} onSubmit={handleLogin} buttonText="Login" pageName="Login" changeFormText="Don't have an account?" changeFormLink="/register" changeFormLinkText="Register" />
        </div>
    );
}