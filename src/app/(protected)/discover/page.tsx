import styles from "./page.module.scss";
import WorkoutsFeed from "@/src/components/shared/WorkoutsFeed/WorkoutsFeed";
import { apiRoutes } from "@/src/lib/dbAPI/apiRoutes";
import { getUser } from "@/src/lib/services/user/getUser";
import getWorkoutById from "@/src/lib/services/workout/getWorkoutById";
import getWorkouts from "@/src/lib/services/workout/getWorkouts";
import WorkoutTimer from "@/src/components/timers/WorkoutTimer/WorkoutTimer";
import Workout from "@/src/components/shared/Workout/Workout";
import { redirect } from "next/dist/server/api-utils";
import { notFound } from "next/navigation";

const DEFAULT_SELECTED_INDEX: number = 0;

export default async function DiscoverPage({ searchParams }: any) {
  const user = await getUser();
  const query = searchParams?.query || "";
  const timerMode = searchParams?.timer_mode || "";

  let userID: string = "";

  if (user) {
    userID += user.id;
  }

  // left pane data
  const workouts = await getWorkouts(apiRoutes.getWorkouts, userID);

  const findIndex: number = workouts.findIndex(
    (entry: { workout_id: string }) => entry.workout_id === query
  );

  const selectedIndex = findIndex === -1 ? DEFAULT_SELECTED_INDEX : findIndex;

  // right pane data
  // const selectedWorkout = workouts[selectedIndex];

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
          <WorkoutTimer selectedWorkoutID={workoutById?.workout_id as string} />
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
