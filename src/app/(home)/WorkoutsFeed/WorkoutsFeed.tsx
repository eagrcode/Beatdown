// styles
import styles from "./WorkoutsFeed.module.scss";

// components
import WorkoutPost from "@/src/components/ui/WorkoutPost/WorkoutPost";

// utils
import getWorkouts from "../getWorkouts";

export default async function WorkoutsFeed({ userID }: { userID: string }) {
  // fetch workouts data
  const workouts = await getWorkouts();

  return (
    <div className={styles.container}>
      {workouts?.map((workout) => (
        <WorkoutPost
          variant={"/workout/"}
          key={workout.id}
          id={workout.id}
          userID={userID}
          title={workout.title}
          description={workout.description}
          workoutRounds={workout.number_of_rounds}
          workoutWarmupTime={workout.warmup_time}
          workoutRoundTime={workout.round_time}
          workoutRestTime={workout.rest_time}
          createdBy={workout.profiles.username}
          createdAt={workout.created_at}
        />
      ))}
    </div>
  );
}
