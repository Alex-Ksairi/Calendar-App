import Form from "../components/Form";

const url = "http://localhost:8000/index.php?action=";

export default function Login() {
    return (
        <Form
            fields={[
                { name: "email", label: "Email", type: "email", required: true },
                { name: "password", label: "Password", type: "password", required: true },
            ]}
            submitUrl={`${url}login`}
            onSuccess={(data) => {
                // Save token or user info from backend
                localStorage.setItem("token", data.token);
                localStorage.setItem("userID", JSON.stringify(data.user.id));
                window.location.href = "/";
            }}
            buttonText="Login"
            pageName="Login"
            changeFormText="Don’t have an account?"
            changeFormLink="/register"
            changeFormLinkText="Register here"
        />
    );
}