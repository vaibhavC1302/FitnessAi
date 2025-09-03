export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-500";
    case "intermediate":
      return "bg-yellow-500";
    case "advanced":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const getDifficultyText = (difficulty) => {
  switch (difficulty) {
    case "beginner":
      return "Beginner";
    case "intermediate":
      return "Intermediate";
    case "advanced":
      return "Advanced";
    default:
      return "Unknnown";
  }
};

export const formateDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
};

export const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  console.log(date);
  const value = date.toLocaleTimeString("en-US", {
    hours: "numeric",
    minute: "2-digit",
    hour12: false,
  });
  console.log("format time value: ", value);
  return value;
};

export const formatWorkoutDuration = (seconds) => {
  if (!seconds) return "Duration not recorded";
  return formatDuration(seconds);
};

export const formatDuration = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    if (remainingSeconds > 0) {
      return `${hours}h ${minutes} ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${hours}h`;
    }
  } else {
    if (remainingSeconds > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${minutes}m`;
    }
  }
};

export const getTotalSet = (workout) => {
  return (
    workout.exercises?.reduce((total, exercise) => {
      return total + (exercise.sets?.length || 0);
    }, 0) || 0
  );
};

export const getExerciseNames = (workout) => {
  return (
    workout.exercises?.map((ex) => ex.exercise?.name).filter(Boolean) || []
  );
};

export const getTotalVolume = (workout) => {
  let totalVolume = 0;
  let unit = "lbs";

  workout?.exercises?.forEach((exercise) => {
    exercise.sets?.forEach((set) => {
      if (set.weight && set.reps) {
        totalVolume += set.weight * set.reps;
        unit = set.weightUnit || "kg";
      }
    });
  });
  return { volume: totalVolume, unit };
};

export const formatDate2 = (dateString) => {
  if (!dateString) {
    return "Unknown Date";
  }
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
