import React, { useState } from "react";

export default function Form({
    fields,
    submitUrl,
    onSuccess,
    buttonText,
    pageName,
    changeFormText,
    changeFormLink,
    changeFormLinkText,
}) {
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
    );
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(submitUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setError(null); // clear error
            onSuccess(data); // trigger success handler
        } catch (err) {
            setError(err.message);

            // reset form fields
            setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}));

            // hide error after 3 seconds
            setTimeout(() => setError(null), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>{pageName}</h2>

            {error && <p className="error">{error}</p>}

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
                <p>
                    {changeFormText}{" "}
                    <a href={changeFormLink}>{changeFormLinkText}</a>
                </p>
            </div>
        </form>
    );
}