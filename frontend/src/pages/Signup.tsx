import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("customer"); // Default role
    const [token, setToken] = useState(""); // Token for owner/server
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        // TODO: Token Validation

        try {
            const response = await axios.post("http://localhost:4001/api/users", {
                username,
                email,
                password,
                role: role,
            });

            console.log("User created:", response.data);
            // Redirect to login after signup
            navigate("/login", {
                state: {
                    username,
                    password
                }
            });
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Sign Up</h2>

                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-gray-700 font-medium">Role</label>
                        <select
                            id="role"
                            required
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                        >
                            <option value="owner">Owner</option>
                            <option value="server">Server</option>
                            <option value="customer">Customer</option>
                        </select>

                        {(role === "owner" || role === "server") && (
                            <div className="mb-4">
                                <label htmlFor="token" className="block text-gray-700 font-medium">Token</label>
                                <input
                                    type="text"
                                    id='token'
                                    required
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="Enter your token"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-medium">Username</label>
                        <input
                            type="text"
                            id="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter a username"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
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
                            placeholder="Create a password"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-lg transition duration-300 ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-sm text-gray-600 text-center mt-4">
                    Already have an account?{" "}
                    <a href="/frontend/src/Login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Signup;