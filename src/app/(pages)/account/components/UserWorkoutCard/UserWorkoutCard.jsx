"use client";

// styles
import styles from "./UserWorkoutCard.module.scss";

// next
import { useRouter } from "next/navigation";
import Link from "next/link";

// icons
import { RiTimerLine } from "react-icons/ri";

export default function UserWorkoutCard({ id, title, workoutRounds, workoutRoundTime, createdAt }) {
  // format created_at response from db
  function formatDate(timestamp) {
    const date = new Date(timestamp);

    const day = ("0" + date.getDate()).slice(-2); // ensures 2 digits
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // ensures 2 digits, +1 because months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // call function and assign formatted value
  createdAt = formatDate(createdAt);

  return (
    <Link className={styles.workoutLink} href={`/account/userWorkout/${id}`}>
      <div key={id} className={styles.card}>
        <div className={styles.cardTop}>
          <h2>{title}</h2>
          <p>
            <RiTimerLine /> {workoutRounds} x {workoutRoundTime} min
          </p>
        </div>
        {<p className={styles.createdBy}>Created at {createdAt}</p>}
      </div>
    </Link>
  );
}
