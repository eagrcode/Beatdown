"use client";

// styles
import styles from "./CreateWorkoutForm.module.scss";

// react
import { useState } from "react";

// supabase client
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const CreateWorkoutForm = ({ userID }) => {
  // init state
  const [title, setTitle] = useState("");
  const [rounds, setRounds] = useState(1);
  const [roundTime, setRoundTime] = useState(5);
  const [restTime, setRestTime] = useState(5);
  const [warmupTime, setWarmupTime] = useState(5);
  const [sequences, setSequences] = useState([]);
  const [isPublic, setIsPublic] = useState(false);

  // supabase client
  const supabase = createClientComponentClient();

  // Function to format the time in "00:00" format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // handle input onChange values
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);
    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "rounds":
        setRounds(numericValue);
        break;
      case "roundTime":
        setRoundTime(numericValue);
        break;
      case "restTime":
        setRestTime(numericValue);
        break;
      case "warmup":
        setWarmupTime(numericValue);
        break;
      default:
        break;
    }
  };

  const handleSequenceChange = (index, sequenceString) => {
    let newSequences = [...sequences];
    newSequences[index] = sequenceString.split(",");
    setSequences(newSequences);
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const roundInfo = sequences.map((seq, idx) => ({
      round: idx + 1,
      sequence: seq,
    }));

    const { data, error } = await supabase
      .from("workouts")
      .insert([
        {
          title: title,
          number_of_rounds: rounds,
          round_time: roundTime,
          rest_time: restTime,
          warmup_time: warmupTime,
          round_info: roundInfo,
          is_public: isPublic,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Submitted to workouts!");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" onChange={handleInputChange} />
      <div className={styles.topContainer}>
        <div className={styles.labelContainer}>
          <label htmlFor="rounds">Rounds {rounds}</label>
          <label htmlFor="roundTime">Round / {formatTime(roundTime)}</label>
          <label htmlFor="restTime">Rest {formatTime(restTime)}</label>
          <label htmlFor="warmup">Warmup {formatTime(warmupTime)}</label>
        </div>
        <div className={styles.inputContainer}>
          <div>
            <input
              type="range"
              id="rounds"
              name="rounds"
              min="1"
              max="30"
              step="1"
              onChange={handleInputChange}
              value={rounds}
            />
          </div>
          <div>
            <input
              type="range"
              id="roundTime"
              name="roundTime"
              min="5"
              max="300"
              step="10"
              onChange={handleInputChange}
              value={roundTime}
            />
          </div>
          <div>
            <input
              type="range"
              id="restTime"
              name="restTime"
              min="0"
              max="60"
              step="5"
              onChange={handleInputChange}
              value={restTime}
            />
          </div>
          <div>
            <input
              type="range"
              id="warmup"
              name="warmup"
              min="10"
              max="30"
              step="5"
              onChange={handleInputChange}
              value={warmupTime}
            />
          </div>
        </div>
      </div>
      <input
        type="checkbox"
        id="public"
        name="public"
        onChange={() => setIsPublic((prev) => !prev)}
        checked={isPublic}
      />
      <label htmlFor="public">Set workout as public</label>
      {Array.from({ length: rounds }).map((_, index) => (
        <input
          key={index}
          type="text"
          onChange={(e) => handleSequenceChange(index, e.target.value)}
          placeholder={`Sequence for round ${index + 1} (e.g. Jab,Jab,Hook-L)`}
        />
      ))}
      <button type="submit" className={styles.fightBtn}>
        Submit
      </button>
    </form>
  );
};

export default CreateWorkoutForm;
