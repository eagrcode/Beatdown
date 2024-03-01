import styles from "../page.module.scss";
import WorkoutsFeed from "@/src/components/shared/WorkoutsFeed/WorkoutsFeed";
import { apiRoutes } from "@/src/lib/dbAPI/apiRoutes";
import { getUser } from "@/src/lib/services/user/getUser";
import getWorkoutById from "@/src/lib/services/workout/getWorkoutById";
import WorkoutTimer from "@/src/components/timers/WorkoutTimer/WorkoutTimer";
import Workout from "@/src/components/shared/Workout/Workout";
import getUserSavedWorkouts from "@/src/lib/services/profile/getUserSavedWorkouts";

const DEFAULT_SELECTED_INDEX: number = 0;

export default async function ProfileSavedWorkoutsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    timer_mode?: string;
  };
}) {
  const { id: userID } = await getUser();
  const query = searchParams?.query || "";
  const timerMode = searchParams?.timer_mode || "";

  // left view data
  // const workouts = await getUserWorkouts(apiRoutes.getUserWorkouts, userID);

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

  return (
    <div className={styles.pageWrapper}>
      {timerMode === "active" ? (
        <div className={styles.timerWrapper}>
          <WorkoutTimer selectedWorkoutID={workoutById.workout_id} />
        </div>
      ) : (
        <div className={styles.discoverWrapper}>
          <div className={styles.leftView}>
            <WorkoutsFeed workouts={workouts} selectedIndex={selectedIndex} />
          </div>
          <div className={styles.rightView}>
            <Workout selectedWorkout={workoutById} />
          </div>
        </div>
      )}
    </div>
  );
}