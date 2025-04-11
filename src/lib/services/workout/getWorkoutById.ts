"use server";

import { Workout } from "../../types/workout.types";
import { setApiHeaders } from "../../utils/setApiHeaders";

const getWorkoutById = async (
  id: string,
  URL: string,
  workoutID: string
): Promise<Workout | null> => {
  try {
    const headers = await setApiHeaders();

    const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + URL, {
      method: "POST",
      body: JSON.stringify({
        requesting_user_id: id,
        target_workout_id: workoutID,
      }),
      headers: headers,
      cache: "force-cache",
    });

    const data = await res.json();

    if (!data) {
      return null;
    }

    console.log("WORKOUT BY ID DATA: ", data[0]);

    return data[0];
  } catch (error: any) {
    console.error("Function error: ", error.message);
    throw error;
  }
};

export default getWorkoutById;
