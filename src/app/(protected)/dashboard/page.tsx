import styles from "./page.module.scss";
import DataDisplaySmall from "@/src/components/shared/DataDisplaySmall/DataDisplaySmall";
import DataDisplayGraph from "@/src/components/shared/DataDisplayGraph/DataDisplayGraph";
import { GiPunchingBag } from "react-icons/gi";
import { GiPunch } from "react-icons/gi";
import { MdTimer } from "react-icons/md";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { getTotalCompletedWorkouts } from "@/src/lib/services/dashboard/getTotalCompletedWorkouts";
import { apiRoutes } from "@/src/lib/dbAPI/apiRoutes";
import { getGraphData } from "@/src/lib/services/dashboard/getGraphData";
import { getUser } from "@/src/lib/services/user/getUser";
import { getTotalCompletedTime } from "@/src/lib/services/dashboard/getTotalCompletedTime";
import { getTotalCompletedRounds } from "@/src/lib/services/dashboard/getTotalCompletedRounds";
import { getAverageWorkoutLength } from "@/src/lib/services/dashboard/getAverageWorkoutLength";
import { notFound } from "next/navigation";

const FILTER_6_MONTHS: string = "_6_months";
const FILTER_1_MONTH: string = "_1_month";
const FILTER_7_DAYS: string = "_7_days";

const ARR_LENGTH_6_MONTHS: number = 6;
const ARR_LENGTH_1_MONTH: number = 4;
const ARR_LENGTH_7_DAYS: number = 7;

const TEXT_6_MONTHS: string = "6 Months";
const TEXT_1_MONTH: string = "1 Month";
const TEXT_7_DAYS: string = "7 Days";

const BASE_PARAM_COMPLETED_WORKOUTS: string = "get_completed_workouts";
const BASE_PARAM_COMPLETED_TIME: string = "get_completed_time";
const BASE_PARAM_COMPLETED_ROUNDS: string = "get_completed_rounds";
const BASE_PARAM_AVERAGE_WORKOUT: string = "get_average_workout";

export default async function Index({ searchParams }: any) {
  const user = await getUser();
  const params = await searchParams;
  const query = params?.query || "";

  let userID: string = "";

  if (user) {
    userID += user.id;
  }

  const [
    cachedTotalCompletedWorkouts,
    cachedTotalCompletedTime,
    cachedTotalCompletedRounds,
    cachedAverageWorkoutLength,
  ] = await Promise.all([
    getTotalCompletedWorkouts(apiRoutes.getTotalCompletedWorkouts(user.id)),
    getTotalCompletedTime(apiRoutes.getTotalCompletedTime(user.id)),
    getTotalCompletedRounds(apiRoutes.getTotalCompletedRounds(user.id)),
    getAverageWorkoutLength(apiRoutes.getTotalCompletedTime(user.id)),
  ]);

  const timeSeriesData = await getGraphData(
    apiRoutes.getGraphData(query),
    userID
  );

  const filterButtons = [
    {
      filter: FILTER_6_MONTHS,
      arrLength: ARR_LENGTH_6_MONTHS,
      text: TEXT_6_MONTHS,
      isActive: !query || query.endsWith(FILTER_6_MONTHS),
    },
    {
      filter: FILTER_1_MONTH,
      arrLength: ARR_LENGTH_1_MONTH,
      text: TEXT_1_MONTH,
      isActive: query.endsWith(FILTER_1_MONTH),
    },
    {
      filter: FILTER_7_DAYS,
      arrLength: ARR_LENGTH_7_DAYS,
      text: TEXT_7_DAYS,
      isActive: query.endsWith(FILTER_7_DAYS),
    },
  ];

  const activeFilterParam =
    filterButtons.find((btn) => btn.isActive)?.filter || FILTER_6_MONTHS;

  const tiles = [
    {
      id: 1,
      data: cachedTotalCompletedWorkouts,
      title: "Workouts",
      icon: <GiPunch size={25} />,
      text: "completed",
      baseParam: BASE_PARAM_COMPLETED_WORKOUTS,
      queryParam: BASE_PARAM_COMPLETED_WORKOUTS + activeFilterParam,
      isActive:
        query === "" ||
        query === BASE_PARAM_COMPLETED_WORKOUTS + activeFilterParam,
    },
    {
      id: 2,
      data: cachedTotalCompletedTime,
      title: "Bag Time",
      icon: <MdTimer size={25} />,
      text: "mins",
      baseParam: BASE_PARAM_COMPLETED_TIME,
      queryParam: BASE_PARAM_COMPLETED_TIME + activeFilterParam,
      isActive: query === BASE_PARAM_COMPLETED_TIME + activeFilterParam,
    },
    {
      id: 3,
      data: cachedTotalCompletedRounds,
      title: "Rounds",
      icon: <BsFillLightningChargeFill size={25} />,
      text: "completed",
      baseParam: BASE_PARAM_COMPLETED_ROUNDS,
      queryParam: BASE_PARAM_COMPLETED_ROUNDS + activeFilterParam,
      isActive: query === BASE_PARAM_COMPLETED_ROUNDS + activeFilterParam,
    },
    {
      id: 4,
      data: cachedAverageWorkoutLength,
      title: "Avg Workout",
      icon: <GiPunchingBag size={25} />,
      text: "mins",
      baseParam: BASE_PARAM_AVERAGE_WORKOUT,
      queryParam: BASE_PARAM_AVERAGE_WORKOUT + activeFilterParam,
      isActive: query === BASE_PARAM_AVERAGE_WORKOUT + activeFilterParam,
    },
  ];

  const activeTileParam = tiles.find((tile) => tile.isActive)?.baseParam || "";

  const validQueries = tiles.map((tile) => tile.queryParam);

  if (query && !validQueries.includes(query)) {
    notFound();
  }

  return (
    <div className={styles.pageWrapperUser}>
      <div className={styles.dashboardWrapper}>
        <h1 className={styles.welcomeText}>
          Welcome back,{" "}
          {user.email === "guest@guest.com"
            ? "Guest"
            : user.user_metadata.full_name.split(" ")[0]}
        </h1>
        <p className={styles.tag}>Monitor your progress to date</p>
        <div className={styles.timeSeriesWrapper}>
          <div className={styles.dataDisplayGrid}>
            {tiles.map((item, index) => (
              <DataDisplaySmall
                key={index}
                index={index}
                data={item.data}
                title={item.title}
                icon={item.icon}
                text={item.text}
                queryParam={item.queryParam}
                isActive={item.isActive}
                currentQuery={query}
              />
            ))}
          </div>
          <DataDisplayGraph
            timeSeriesData={timeSeriesData}
            filterButtons={filterButtons}
            activeTileParam={activeTileParam}
            activeFilterParam={activeFilterParam}
          />
        </div>
      </div>
    </div>
  );
}
