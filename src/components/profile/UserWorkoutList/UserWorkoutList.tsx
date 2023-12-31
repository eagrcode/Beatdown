import styles from "./UserWorkoutList.module.scss";
import Link from "next/link";
import WorkoutPost from "../../shared/WorkoutPost/WorkoutPost";
import getUserWorkouts from "@/src/lib/services/getUserWorkouts";

export default async function UserWorkoutList({ userID }: { userID: string }) {
  // get workouts
  const userWorkouts = await getUserWorkouts(userID);

  return (
    <div className={styles.wrapper}>
      {userWorkouts && (
        <div className={styles.container}>
          {userWorkouts.map((workout) => (
            <WorkoutPost
              variant={"/account/userWorkout/"}
              key={workout.id}
              id={workout.id}
              userID={userID}
              title={workout.title}
              description={workout.description}
              workoutRounds={workout.number_of_rounds}
              workoutWarmupTime={workout.warmup_time}
              workoutRoundTime={workout.round_time}
              workoutRestTime={workout.rest_time}
              createdAt={workout.created_at}
              createdBy={workout.profiles.username || workout.profiles.email}
              plays={workout.plays}
              name={workout.profiles.full_name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
