import { useState, useEffect, useRef } from "react";

function WorkoutCard({ workout, changeName, changeSets, changeRest }) {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);

  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const hasIncrementedRef = useRef(false);

  // Create audio ONCE
  useEffect(() => {
    audioRef.current = new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    );
  }, []);

  // Reset sets if total sets changes
  useEffect(() => {
    setCurrentSet(0);
  }, [workout.sets]);

  // Countdown logic
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);

          // ✅ StrictMode-safe increment
          if (!hasIncrementedRef.current) {
            hasIncrementedRef.current = true;

            setCurrentSet((prevSet) => {
              if (prevSet < Number(workout.sets)) {
                return prevSet + 1;
              }
              return prevSet;
            });

            // 🔊 Play sound
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, workout.sets]);

  // Start rest timer
  const handleStartTimer = () => {
    const seconds = Number(workout.rest);
    if (!seconds || seconds <= 0) return;

    // reset guard
    hasIncrementedRef.current = false;

    // 🔓 unlock audio (required by browser)
    audioRef.current
      .play()
      .then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      })
      .catch(() => {});

    setTimer(seconds);
    setIsRunning(true);
  };

  return (
    <div className="card workout-card mb-3">
      <div className="card-body">
        <h5 className="card-title">Workout</h5>

        {/* Exercise Name */}
        <div className="mb-3">
          <label className="form-label">Exercise Name</label>
          <input
            type="text"
            className="form-control"
            value={workout.name}
            onChange={changeName}
            placeholder="e.g. Squats"
          />
        </div>

        <div className="row">
          {/* Sets */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Sets</label>
            <input
              type="number"
              className="form-control"
              value={workout.sets}
              onChange={changeSets}
              placeholder="e.g. 4"
            />
            <small className="text-muted">
              {currentSet} / {workout.sets || 0} sets
            </small>
          </div>

          {/* Rest */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Rest (seconds)</label>
            <input
              type="number"
              className="form-control"
              value={workout.rest}
              onChange={changeRest}
              placeholder="e.g. 90"
            />

            <div className="mt-2 d-flex justify-content-between align-items-center">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleStartTimer}
                disabled={isRunning || currentSet >= workout.sets}
              >
                Start Rest
              </button>
              <span>{timer}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutCard;
