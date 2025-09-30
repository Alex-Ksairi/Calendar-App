// src/pages/Register.jsx
import React from "react";
import Form from "../components/Form";

export default function Register() {
    const fields = [
        { name: "username", label: "Username", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Password", type: "password", required: true },
    ];

    const handleRegister = (data) => {
        console.log("Register data:", data);
        // Call API to register
    };

    return (
        <div>
            <Form fields={fields} onSubmit={handleRegister} buttonText="Register" pageName="Register" changeFormText="Already have an account?" changeFormLink="/login" changeFormLinkText="Login" />
        </div>
    );
}