import styles from "./page.module.scss";
import WorkoutsFeed from "@/src/components/shared/WorkoutsFeed/WorkoutsFeed";
import { apiRoutes } from "@/src/lib/dbAPI/apiRoutes";
import { getUser } from "@/src/lib/services/user/getUser";
import getWorkoutById from "@/src/lib/services/workout/getWorkoutById";
import WorkoutTimer from "@/src/components/timers/WorkoutTimer/WorkoutTimer";
import Workout from "@/src/components/shared/Workout/Workout";
import getUserSavedWorkouts from "@/src/lib/services/profile/getUserSavedWorkouts";
import NoWorkouts from "@/src/components/profile/NoWorkouts/NoWorkouts";
import { notFound } from "next/navigation";

const DEFAULT_SELECTED_INDEX: number = 0;

export default async function ProfileSavedWorkoutsPage({ searchParams }: any) {
  const user = await getUser();
  const query = searchParams?.query || "";
  const timerMode = searchParams?.timer_mode || "";

  let userID: string = "";

  if (user) {
    userID += user.id;
  }

  // left view data

  const workouts = await getUserSavedWorkouts(userID);

  const findIndex: number = workouts.findIndex(
    (entry: { workout_id: string }) => entry.workout_id === query
  );

  // apply default index because findIndex() returns -1 if no match is found
  const selectedIndex = findIndex === -1 ? DEFAULT_SELECTED_INDEX : findIndex;

  // right view data
  const workoutById = await getWorkoutById(
    userID,
    apiRoutes.getWorkoutByID,
    query ? query : workouts[DEFAULT_SELECTED_INDEX]?.workout_id
  );

  if (!workoutById) {
    return notFound();
  }

  return (
    <div className={styles.pageWrapper}>
      {timerMode === "active" ? (
        <div className={styles.timerWrapper}>
          <WorkoutTimer selectedWorkoutID={workoutById.workout_id} />
        </div>
      ) : (
        <div className={styles.discoverWrapper}>
          <div className={styles.leftView}>
            {workouts.length ? (
              <WorkoutsFeed workouts={workouts} selectedIndex={selectedIndex} />
            ) : (
              <NoWorkouts variant={"profile-saved"} />
            )}
          </div>
          <div className={styles.rightView}>
            {workoutById && <Workout selectedWorkout={workoutById} />}
          </div>
        </div>
      )}
    </div>
  );
}
