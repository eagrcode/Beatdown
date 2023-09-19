"use client";

// styles
import styles from "./Workout.module.scss";

// react
import React from "react";
import { useState } from "react";

// context
import { useWorkoutTimerDataContext } from "@/src/context/WorkoutTimerData.context";

// components
import WorkoutTimer from "@/src/components/timers/WorkoutTimer/WorkoutTimer";
import LikeButton from "@/src/components/buttons/LikeButton/LikeButton";
import LikesDisplay from "../../../../../components/ui/LikesDisplay/LikesDisplay";
import SaveButton from "@/src/components/buttons/SaveButton/SaveButton";

// icons
import { GiHighPunch } from "react-icons/gi";
import { MdOutlineTimer } from "react-icons/md";
import { BsLightningCharge, BsHourglassTop } from "react-icons/bs";
import { HiArrowSmRight } from "react-icons/hi";

// utils
import formatTimeAgo from "@/src/lib/utils/formatTimeAgo";
import formatTimeDisplay from "@/src/lib/utils/formatTimeDisplay";

// db types
import type { Database } from "@/src/lib/database.types";

interface WorkoutPropTypes {
  id: string;
  userID: string;
  title: string;
  description: string;
  roundInfo: { round: number; sequence: string[] }[];
  workoutRounds: number;
  workoutWarmupTime: number;
  workoutRoundTime: number;
  workoutRestTime: number;
  createdAt: string;
  createdBy: string;
  saved: { created_at: string; id: string; user_id: string | null; workout_id: string }[];
  likes: {
    created_at: string;
    id: number;
    user_id: string | null;
    workout_id: string | null;
  }[];
}

export default function Workout({
  id,
  userID,
  title,
  description,
  roundInfo,
  workoutRounds,
  workoutWarmupTime,
  workoutRoundTime,
  workoutRestTime,
  createdAt,
  createdBy,
  saved,
  likes,
}: WorkoutPropTypes) {
  // init state
  const [isWorkoutMode, setIsWorkoutMode] = useState(false);

  // destructure context
  const {
    setWorkoutRounds,
    setWorkoutRoundTime,
    setWorkoutRestTime,
    setWorkoutWarmupTime,
    setRoundInfo,
  } = useWorkoutTimerDataContext();

  // calc total workout time
  const totalTime = Math.floor(
    workoutWarmupTime + workoutRoundTime * workoutRounds + workoutRestTime * (workoutRounds - 1)
  );

  // handle workout timer start
  const handleStart = () => {
    setRoundInfo({ round_info: roundInfo });
    setWorkoutRounds(workoutRounds);
    setWorkoutRoundTime(workoutRoundTime);
    setWorkoutRestTime(workoutRestTime);
    setWorkoutWarmupTime(workoutWarmupTime);
    setIsWorkoutMode(true);
  };

  if (!isWorkoutMode) {
    return (
      <div key={id} className={styles.card}>
        <div className={styles.cardTop}>
          <div className={styles.usernameContainer}>
            <GiHighPunch size={20} />
            <p>{createdBy}</p>
          </div>
          <span>{formatTimeAgo(createdAt)}</span>
        </div>
        <h1>{title}</h1>
        <div className={styles.overview}>
          <p>{description}</p>
        </div>
        <div className={styles.info}>
          <div className={styles.infoDisplay}>
            <MdOutlineTimer size={20} />
            <span>{formatTimeDisplay(totalTime)}</span>
          </div>
          <div className={styles.infoDisplay}>
            <BsLightningCharge size={20} />
            <span>
              {workoutRounds} round{workoutRounds > 1 && "s"}
            </span>
          </div>
          <div className={styles.infoDisplay}>
            <BsHourglassTop size={20} />
            <span>{formatTimeDisplay(workoutRoundTime)} / round</span>
          </div>
          {/* <span>{workoutWarmupTime} sec / warmup</span> */}
        </div>
        <div className={styles.comboContainer}>
          {roundInfo.map((round, index) => (
            <div className={styles.row} key={index}>
              <h2>Round {round.round}</h2>
              <ul className={styles.ul}>
                {round.sequence.map((punch, index) => (
                  <React.Fragment key={index}>
                    <li className={styles.punchTag}>{punch}</li>{" "}
                    <div className={styles.arrow}>
                      <HiArrowSmRight />
                    </div>
                  </React.Fragment>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.socialBtnContainer}>
          <LikeButton id={id} userID={userID} likes={likes} />
          <SaveButton id={id} saved={saved} />
        </div>
        <div className={styles.workoutBottom}>
          <LikesDisplay likes={likes} />
          <div className={styles.btnContainer}>
            <button onClick={handleStart} className={styles.btnStart}>
              START
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isWorkoutMode) {
    return <WorkoutTimer setIsWorkoutMode={setIsWorkoutMode} />;
  }
}
