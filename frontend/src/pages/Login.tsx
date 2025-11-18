import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/authContext";

const Login = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const location = useLocation();
    const [username, setUsername] = useState(location.state?.username || "");
    const [password, setPassword] = useState(location.state?.password || "");

    // Clear sensitive data - avoid credentials lingering in memory after loading
    useEffect(() => {
        window.history.replaceState({}, document.title);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        // try {
        //     const response = await fetch("http://localhost:5000/api/users/login", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({ username, password }),
        //     });
        //
        //     const data = await response.json();
        //     console.log("Response data:", data); // Log the response data for debugging
        //     if (!response.ok) {
        //         throw new Error(data.message || "Invalid username or password");
        //     }
        //
        //     console.log("Login successful:", data.user);
        //     setUser(data.user);
        //     // Redirect to /restaurant on successful login
        //     navigate("/");
        // } catch (err) {
        //     setError(err.message);
        // }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>

                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-medium">Username</label>
                        <input
                            type="text"
                            id="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-gray-600 text-center mt-4">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;