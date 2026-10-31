
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import api, { getErrorMessage } from "../lib/api";

export default function Registration() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data } = await api.post("/user/userRegistr", form);

      if (!data.success) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Account created successfully. Redirecting to login…");

      setTimeout(() => {
        navigate("/admin/login", { replace: true });
      }, 900);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create your account."));
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-black placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200";

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-7 flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
            <BookOpen size={28} />
          </span>

          <span className="mt-3 text-3xl font-extrabold tracking-tight text-black">
            LearnHub
          </span>

          <span className="mt-1 text-xs tracking-wide text-gray-500">
            LEARN TODAY, LEAD TOMORROW
          </span>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-7 shadow-xl sm:p-9"
        >
          <div className="mb-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-black">
              <BookOpen size={28} />
            </div>

            <h1 className="mt-4 text-2xl font-extrabold text-black">
              Create Your Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create your account to get started.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-4 rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-black"
            >
              {success}
            </div>
          )}

          <label htmlFor="name" className="mb-2 block text-sm font-semibold text-black">
            Full name
          </label>

          <input
            id="name"
            required
            maxLength={80}
            autoComplete="name"
            value={form.name}
            onChange={(event) =>
              setForm({ ...form, name: event.target.value })
            }
            placeholder="Enter your full name"
            className={`${inputClass} mb-4`}
          />

          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-black">
            Email address
          </label>

          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            placeholder="Enter your email"
            className={`${inputClass} mb-4`}
          />

          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-black">
            Password
          </label>

          <div className="relative mb-4">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              placeholder="At least 8 characters"
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label="Toggle password visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-black"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            disabled={loading || Boolean(success)}
            className="mt-6 w-full rounded-xl bg-black px-4 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p className="mt-6 border-t border-gray-200 pt-5 text-center text-sm text-gray-500">
            Already registered?{" "}
            <Link
              to="/admin/login"
              className="font-bold text-black underline underline-offset-4 hover:text-gray-600"
            >
              Login now
            </Link>
          </p>
        </form>

        <p className="mt-5 text-center">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
