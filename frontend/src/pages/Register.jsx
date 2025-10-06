import Form from "../components/Form";

const url = "http://localhost:8000/index.php?action=";

export default function Register() {
    return (
        <Form
            fields={[
                { name: "username", label: "Username", type: "text", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "password", label: "Password", type: "password", required: true },
            ]}
            submitUrl={`${url}register`}
            onSuccess={(data) => {
                alert("Registration successful! You can now login.");
                window.location.href = "/login";
            }}
            buttonText="Register"
            pageName="Register"
            changeFormText="Already have an account?"
            changeFormLink="/login"
            changeFormLinkText="Login here"
        />
    );
}