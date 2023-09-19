"use client";

// next
import Link from "next/link";
import { useRouter } from "next/navigation";

// react
import { useState } from "react";

// styles
import styles from "./SignInForm.module.scss";

// components
import Button from "./Button";

// utils
import signInEmail from "../signInEmail";
import signInGuest from "../signInGuest";

export default function SignInForm() {
  // init state
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // init hooks
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    await signInEmail(email, password);
    router.refresh();
  }

  async function handleGuestSubmit(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    await signInGuest();
    router.refresh();
  }

  return (
    <div className={styles.formWrapper}>
      <h1>Welcome back</h1>
      <p style={{ color: "var(--text-color-main)" }}>Sign in to your account</p>
      <button onClick={(e) => handleGuestSubmit(e)}>Guest User</button>
      <p>or</p>
      <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
        <div className={styles.inputRow}>
          <label htmlFor="email">Email</label>
          <input
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
        Don't have an account? <Link href="/signUp">Sign Up Now</Link>
      </p>
    </div>
  );
}