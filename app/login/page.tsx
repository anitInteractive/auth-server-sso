"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("123456");

  const sso_session = Cookies.get("sso_session");
  console.log("sso_session", sso_session);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const redirectUri =
    searchParams.get("redirect_uri") || "http://localhost:3000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("accessToken", data.token);
      window.location.href = redirectUri; // redirect after successful login
    } else {
      alert("Login failed");
    }
  };

  useEffect(() => {
    if (window.location.href.includes("redirect_uri")) {
      localStorage.clear();
      fetch("http://localhost:3000/api/logout", { method: "POST" });
    }
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-2 py-1"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-2 py-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Login
        </button>
      </form>
    </main>
  );
}
