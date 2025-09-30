// src/components/Form.jsx
import React, { useState } from "react";

export default function Form({ fields, onSubmit, buttonText, pageName, changeFormText, changeFormLink, changeFormLinkText }) {
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
    );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>{pageName}</h2>
            {fields.map((field) => (
                <div key={field.name} className="form-group">
                    <label>{field.label}</label>
                    <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required={field.required || false}
                    />
                </div>
            ))}
            <button type="submit">{buttonText}</button>
            <div className="change-form">
                <p>{changeFormText} <a href={changeFormLink}>{changeFormLinkText}</a></p>
            </div>
        </form>
    );
}