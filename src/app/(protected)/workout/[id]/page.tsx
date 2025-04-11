import styles from "./page.module.scss";
import getWorkoutById from "@/src/lib/services/workout/getWorkoutById";
import { getUser } from "@/src/lib/services/user/getUser";
import dynamic from "next/dynamic";
import PostSkeleton from "@/src/components/shared/PostSkeleton/PostSkeleton";
import { apiRoutes } from "@/src/lib/dbAPI/apiRoutes";
import Workout from "@/src/components/shared/Workout/Workout";
import WorkoutTimer from "@/src/components/timers/WorkoutTimer/WorkoutTimer";
import { notFound } from "next/navigation";

type PropTypes = {
  params: {
    id: string;
  };
  searchParams: {
    timer_mode: string;
  };
};

export default async function WorkoutPage({ params, searchParams }: any) {
  const { id: userID } = await getUser();
  const timerMode = searchParams?.timer_mode || "";

  const workoutById = await getWorkoutById(
    userID,
    apiRoutes.getWorkoutByID,
    params.id
  );

  if (!workoutById) {
    return notFound();
  }

  return (
    <div className={styles.wrapper}>
      {timerMode === "active" ? (
        <div className={styles.timerWrapper}>
          <WorkoutTimer selectedWorkoutID={workoutById.workout_id} />
        </div>
      ) : (
        <Workout selectedWorkout={workoutById} />
      )}
    </div>
  );
}
