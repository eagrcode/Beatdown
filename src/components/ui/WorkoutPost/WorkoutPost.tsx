// styles
import styles from "./WorkoutPost.module.scss";

// next
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

// utils
import getWorkoutLikesCount from "@/src/lib/services/getWorkoutLikes";
import isSavedByUser from "@/src/lib/services/isSavedByUser";
import isLikedByUser from "@/src/lib/services/isLikedByUser";
import formatTimeAgo from "@/src/lib/utils/formatTimeAgo";
import formatTimeDisplay from "@/src/lib/utils/formatTimeDisplay";
import getWorkoutSavesCount from "@/src/lib/services/getWorkoutSaves";

// components
import SocialDataDisplay from "@/src/components/ui/SocialDataDisplay/SocialDataDisplay";

// icons
import { GiHighPunch } from "react-icons/gi";
import { MdOutlineTimer } from "react-icons/md";
import { BsLightningCharge, BsHourglassTop } from "react-icons/bs";

// types
import type { WorkoutPostPropTypes } from "./workoutPost.types";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function WorkoutPost({
  variant,
  id,
  userID,
  title,
  description,
  workoutRounds,
  workoutWarmupTime,
  workoutRoundTime,
  workoutRestTime,
  createdBy,
  createdAt,
  plays,
  name,
}: WorkoutPostPropTypes) {
  // init supabase client
  const supabase = createServerComponentClient({ cookies });

  // get session data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // calc total workout time
  const totalTime = Math.floor(
    workoutWarmupTime + workoutRoundTime * workoutRounds + workoutRestTime * (workoutRounds - 1)
  );

  // fetch workout likes
  const likes = await getWorkoutLikesCount(id);
  const isLiked = await isLikedByUser(id, userID);
  const saved = await isSavedByUser(id, userID);
  const savesCount = await getWorkoutSavesCount(id);

  return (
    <div key={id} className={styles.card}>
      <Link className={styles.linkWrapper} href={`${variant}${id}`}>
        <div className={styles.cardTop}>
          <div className={styles.usernameContainer}>
            {/* <GiHighPunch size={20} /> */}
            <div className={styles.avatar}>
              <div>{name?.charAt(0)}</div>
            </div>
            <p>{createdBy}</p>
          </div>
          <span>{formatTimeAgo(createdAt)}</span>
        </div>

        <h2 className={styles.title}>{title}</h2>

        <div className={styles.overview}>
          <p>{description}</p>
        </div>
        <div className={styles.info}>
          <div className={styles.infoDisplay}>
            <MdOutlineTimer size={18} />
            <span>{formatTimeDisplay(totalTime)}</span>
          </div>
          <div className={styles.infoDisplay}>
            <BsLightningCharge size={18} />
            <span>
              {workoutRounds} round{workoutRounds > 1 && "s"}
            </span>
          </div>
          <div className={styles.infoDisplay}>
            <BsHourglassTop size={16} />
            <span>{formatTimeDisplay(workoutRoundTime)}</span>
          </div>
        </div>
      </Link>

      <SocialDataDisplay
        likes={likes}
        plays={plays}
        id={id}
        userID={userID}
        saved={saved}
        isLiked={isLiked}
        savesCount={savesCount}
      />
    </div>
  );
}
