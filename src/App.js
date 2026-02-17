import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import Header from "./header";
import WorkoutNumber from "./workoutNumber";
import WorkoutCard from "./workoutCard";
import { useEffect, useState } from "react";

export default function App() {
  const [numberOfWorkout, setNumberOfWorkout] = useState(() => {
    const saved = localStorage.getItem("number of workout");
    return saved ? JSON.parse(saved) : 1;
  });

  const [workOuts, setWorkOuts] = useState(() => {
    const saved = localStorage.getItem("workouts");
    return saved
      ? JSON.parse(saved)
      : Array.from({ length: numberOfWorkout }, () => ({
          name: "",
          sets: "",
          rest: "",
        }));
  });

  // Persist number of workouts
  useEffect(() => {
    localStorage.setItem("number of workout", JSON.stringify(numberOfWorkout));
  }, [numberOfWorkout]);

  // Persist workouts data
  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workOuts));
  }, [workOuts]);

  // Update number of cards
  function handleWorkoutNumber(event) {
    const value = Number(event.target.value);
    setNumberOfWorkout(value);

    setWorkOuts((prev) => {
      const newArr = [...prev];
      while (newArr.length < value)
        newArr.push({ name: "", sets: "", rest: "" });
      return newArr.slice(0, value);
    });
  }

  // Update card fields by index
  function handleWorkoutChange(event, index, field) {
    const newWorkouts = [...workOuts];
    newWorkouts[index] = { ...newWorkouts[index], [field]: event.target.value };
    setWorkOuts(newWorkouts);
  }

  return (
    <div className="container mt-5">
      <Header />
      <WorkoutNumber
        numberOfCard={handleWorkoutNumber}
        value={numberOfWorkout}
      />

      {Array.from({ length: numberOfWorkout }).map((_, index) => (
        <WorkoutCard
          key={index}
          workout={workOuts[index]}
          changeName={(e) => handleWorkoutChange(e, index, "name")}
          changeSets={(e) => handleWorkoutChange(e, index, "sets")}
          changeRest={(e) => handleWorkoutChange(e, index, "rest")}
        />
      ))}
    </div>
  );
}
