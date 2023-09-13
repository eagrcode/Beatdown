// utils
import getWorkoutById from "@/src/lib/services/getWorkoutById";
import getWorkoutLikes from "@/src/lib/services/getWorkoutLikes";
import getWorkoutSaves from "@/src/lib/services/getWorkoutSaves";

// components
import Workout from "./Workout/Workout";

// supabase client
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// next
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface WorkoutPageProps {
  params: {
    id: string;
  };
}

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  // init supabase client
  const supabase = createServerComponentClient({ cookies });

  // get user data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userID = "";

  if (user) {
    userID = user.id;
  }

  // fetch data
  const likes = (await getWorkoutLikes(params.id)) || [];
  const saved = await getWorkoutSaves(params.id, userID);
  const workoutData = await getWorkoutById(params.id);

  return (
    <Workout
      id={workoutData?.id}
      createdBy={workoutData?.profiles.username}
      title={workoutData?.title}
      description={workoutData?.description}
      workoutRounds={workoutData?.number_of_rounds}
      workoutRoundTime={workoutData?.round_time}
      workoutRestTime={workoutData?.rest_time}
      workoutWarmupTime={workoutData?.warmup_time}
      roundInfo={workoutData?.round_info}
      createdAt={workoutData?.created_at}
      data={workoutData}
      likes={likes}
      saved={saved}
      userID={userID || ""}
    />
  );
}
