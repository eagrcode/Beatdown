"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import styles from "./SignUpForm.module.scss";
import Button from "./Button";
import signUpEmail from "@/src/lib/auth/signUpEmail";

export default function SignUpForm() {
  // init state
  const [fullName, setFullName] = useState<string>("");

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // init hooks
  const router = useRouter();

  // handle user sign up
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    await signUpEmail(email, password, username, fullName);
    router.push("/signUp/success");
  }

  return (
    <div className={styles.formWrapper}>
      <h1>Get Started</h1>
      <p style={{ color: "var(--text-color-main)" }}>Create a new account</p>

      <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
        <div className={styles.inputRow}>
          <label htmlFor="firstName">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div className={styles.inputRow}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="superuser123"
            required
          />
        </div>
        <div className={styles.inputRow}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className={styles.inputRow}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="••••••••"
            required
          />
        </div>
        <Button isLoading={isLoading} />
      </form>

      <p>
        Already have an account? <Link href="/login">Log In Now</Link>
      </p>
    </div>
  );
}
