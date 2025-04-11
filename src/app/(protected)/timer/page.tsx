import styles from "./page.module.scss";
import Timer from "@/src/components/timers/Timer/Timer";
import InitiateTimerForm from "@/src/components/forms/InitiateTimerForm/InitiateTimerForm";
import ShowInfoButton from "@/src/components/buttons/ShowInfoButton/ShowInfoButton";

export default function TimerPage({ searchParams }: any) {
  const timerMode = searchParams?.timer_mode || "";

  // Show timer view
  if (timerMode === "active") {
    return (
      <div className={styles.timerWrapper}>
        <Timer />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <ShowInfoButton />
      <InitiateTimerForm />
    </div>
  );
}
