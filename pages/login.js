import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { status } = useSession(); // ✅ Ensures authentication state is checked
  const router = useRouter();

  // ✅ Redirect authenticated users immediately
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/music/korn24");
    }
  }, [status, router]);

  // ✅ Import Lenis only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@studio-freight/lenis").then(({ default: Lenis }) => {
        const lenis = new Lenis();
        const raf = (time) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        return () => lenis.destroy();
      });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (!result || result.error) {
      setError("Invalid login credentials.");
    } else {
      router.push("/music/korn24");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Client Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleLogin}>
        {/* ✅ Username Input */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded text-black placeholder-gray-400"
        />

        {/* ✅ Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black placeholder-gray-400"
        />

        {/* ✅ Submit Button */}
        <button type="submit" className="w-full bg-black text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
