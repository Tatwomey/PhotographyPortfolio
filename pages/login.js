// pages/login.js
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const router = useRouter();

const handleLogin = async (e) => {
e.preventDefault();
setError("");

const result = await signIn("credentials", {
redirect: false,
username,
password,
});

if (result?.error) {
setError("You fucked up.");
return;
}

// ✅ Get the fresh session from NextAuth
const session = await getSession();
console.log("🔐 Session after login:", session);

const rawPages = session?.user?.allowedPages ?? [];

// ✅ Clean up any weird entries / whitespace
const allowedPages = rawPages
.filter((p) => typeof p === "string")
.map((p) => p.trim())
.filter(Boolean);

console.log("✅ Sanitized allowedPages:", allowedPages);

// ✅ Your preferred landing page
const preferred = "/music/iamx25";

let target = preferred;

if (!allowedPages.includes(preferred) && allowedPages.length > 0) {
// If iamx25 isn’t in allowedPages, fall back to the first allowed page
target = allowedPages[0];
}

console.log("➡️ Redirecting to:", target);
router.push(target);
};

return (
<div className="flex justify-center items-center h-screen bg-black">
{/* Black Container */}
<div className="bg-black p-6 rounded-lg shadow-lg w-96 border border-gray-700">
<h2 className="text-xl font-bold text-white text-center mb-4 bg-black p-2 rounded">
Client Login
</h2>
{error && <p className="text-red-500 text-center">{error}</p>}
<form onSubmit={handleLogin}>
<input
type="text"
placeholder="Username"
value={username}
onChange={(e) => setUsername(e.target.value)}
className="w-full p-2 mb-2 border border-gray-600 bg-white text-black rounded"
/>
<input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="w-full p-2 mb-4 border border-gray-600 bg-white text-black rounded"
/>
<button
type="submit"
className="w-full bg-black text-white p-2 rounded border border-gray-600 hover:bg-gray-900 transition"
>
Login
</button>
</form>
</div>
</div>
);
}
