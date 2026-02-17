function WorkoutNumber({ numberOfCard, value }) {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <label className="form-label">Number of Workouts</label>
        <input
          type="number"
          className="form-control"
          placeholder="Enter number of workouts"
          onChange={numberOfCard}
          value={value}
        />
        <small className="text-muted">
          This will control how many workout cards are shown
        </small>
      </div>
    </div>
  );
}

export default WorkoutNumber;
