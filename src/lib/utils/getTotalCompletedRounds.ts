"use server";

import { setApiHeaders } from "./setApiHeaders";

type PropType = {
  rounds: number;
};

export const getTotalCompletedRounds = async (query: string): Promise<number> => {
  try {
    const headers = setApiHeaders();

    const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + query, {
      headers: headers,
      cache: "force-cache",
    });

    const data: PropType[] = await res.json();

    const summedData: number = data?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.rounds;
    }, 0);

    console.log("FETCHED DATA: ", summedData);

    return summedData;
  } catch (error: any) {
    console.error("Function error: ", error.message);
    throw error;
  }
};