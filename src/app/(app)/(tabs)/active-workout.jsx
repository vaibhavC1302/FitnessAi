import {
  View,
  Text,
  TouchableOpacity,
  Touchable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { useWorkoutStore } from "../../../../store/workout-store.js";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ExerciseSelectionModal from "../../../components/ExerciseSelectionModal.jsx";
import { client } from "../../../lib/sanity/client.js";
import { defineQuery } from "groq";
import { useUser } from "@clerk/clerk-expo";

// query to find exercise by name
const findExerciseQuery =
  defineQuery(`*[_type == 'exercise' && name == $name][0]{
    _id,
    name
  }`);

const ActiveWorkout = () => {
  const { user } = useUser();
  const {
    workoutExercises,
    setWorkoutExercises,
    resetWorkout,
    weightUnit,
    setWeightUnit,
  } = useWorkoutStore();
  const router = useRouter();
  const { seconds, minutes, hours, totalSeconds, reset } = useStopwatch({
    autoStart: true,
  });
  const [showExerciseSelection, setShowExeriseSelection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // reset timer when screen is focused and no active workout (fresh start)
  useFocusEffect(
    useCallback(() => {
      // only reset if no exercises indicating a fresh start
      if (workoutExercises.length === 0) {
        reset();
      }
    }, [workoutExercises.length, reset])
  );

  // helper function
  const getWorkoutDuration = () => {
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const cancelWorkout = () => {
    Alert.alert(
      "Cancel Workout",
      "Are you sure you want to cancel the workout?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "End Workout",
          onPress: () => {
            resetWorkout();
            router.back();
          },
        },
      ]
    );
  };

  const addExercise = () => {
    setShowExeriseSelection(true);
  };

  const deleteExercise = (exerciseId) => {
    setWorkoutExercises((exercises) =>
      exercises.filter((exercise) => exercise.id !== exerciseId)
    );
  };

  const addNewSet = (exerciseId) => {
    const newSet = {
      id: Math.random().toString(),
      reps: "",
      weight: "",
      weightUnit: weightUnit,
      isCompleted: false,
    };

    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise
      )
    );
  };

  const updateSet = (exerciseId, setId, field, value) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      )
    );
  };

  const toggleSetCompletion = (exerciseId, setId) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId
                  ? { ...set, isCompleted: !set.isCompleted }
                  : set
              ),
            }
          : exercise
      )
    );
  };

  const deleteSet = (exerciseId, setId) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            }
          : exercise
      )
    );
  };

  const saveWorkout = () => {
    Alert.alert(
      "Complete workout",
      "Are you sure you want to complete the workout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Complete",
          onPress: async () => await endWorkout(),
        },
      ]
    );
  };

  const endWorkout = async () => {
    const saved = await saveWorkoutToDatabase();

    if (saved) {
      Alert.alert("Workout Saved", "Your workout has been saved successfully!");
      // reset workout
      resetWorkout();
      router.replace("/(app)/(tabs)/history?refresh=true");
    }
  };

  const saveWorkoutToDatabase = async () => {
    // check if already in saving state
    if (isSaving) return false;

    setIsSaving(true);
    try {
      // get total seconds
      const durationInSeconds = totalSeconds;

      // transform exercise data to match sanity schema
      const exercisesForSanity = await Promise.all(
        workoutExercises.map(async (exercise) => {
          const exerciseDoc = await client.fetch(findExerciseQuery, {
            name: exercise.name,
          });

          if (!exerciseDoc) {
            throw new Error(`Exercise ${exercise.name} not found in database`);
          }

          // transform sets to match sanity schema
          const setsForSanity = exercise.sets
            .filter((set) => set.isCompleted && set.reps && set.weight)
            .map((set) => ({
              _type: "set",
              _key: Math.random().toString(36).slice(2, 9),
              reps: parseInt(set.reps, 10) || 0,
              weight: parseFloat(set.weight) || 0,
              weightUnit: set.weightUnit,
            }));

          return {
            _type: "workoutExercise",
            _key: Math.random().toString(36).slice(2, 9),
            exercise: {
              _type: "reference",
              _ref: exerciseDoc._id,
            },
            sets: setsForSanity,
          };
        })
      );

      // filter out exercises with no completed sets
      const validExercises = exercisesForSanity.filter(
        (exercise) => exercise.sets.length > 0
      );

      if (validExercises.length === 0) {
        Alert.alert(
          "No Completed Sets",
          "Please complete at least one set before saving the workout"
        );
        return false;
      }

      // workout document that will be sent to backend api
      const workoutData = {
        _type: "workout",
        userId: user.id,
        date: new Date().toISOString(),
        duration: durationInSeconds,
        exercises: validExercises,
      };

      // save to sanity api
      const result = await fetch("/api/save-workout", {
        method: "POST",
        body: JSON.stringify({ workoutData }),
      });

      console.log("workout saved successfully:", result);
      return true;
    } catch (error) {
      console.error("Error saving workout", error);
      Alert.alert("Save Failed", "Failedd to save workout. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1">
      {/* header */}
      <View className="bg-gray-800 px-6 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-xl font-semibold">
              Active workout
            </Text>
            <Text className="text-gray-300">{getWorkoutDuration()}</Text>
          </View>
          <View className="flex-row items-center space-x-3 gap-2">
            {/* weight unit toggle */}
            <View className="flex-row bg-gray-700 rounded-lg p-1">
              <TouchableOpacity
                onPress={() => setWeightUnit("lbs")}
                className={`px-3 py-1 rounded-lg p-1 
                      ${weightUnit === "lbs" ? "bg-blue-600" : ""}`}
              >
                <Text
                  className={`text-sm font-medium 
                        ${weightUnit === "lbs" ? "text-white" : "text-gray-300"}`}
                >
                  lbs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setWeightUnit("kg")}
                className={`px-3 py-1 rounded-lg p-1 
                      ${weightUnit === "kg" ? "bg-blue-600" : ""}`}
              >
                <Text
                  className={`text-sm font-medium 
                        ${weightUnit === "kg" ? "text-white" : "text-gray-300"}`}
                >
                  kg
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={cancelWorkout}
              className="bg-red-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">End Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-1 bg-white">
        {/* workout progress */}
        <View className="px-6 mt-4">
          <Text className="text-center text-gray-600 mb-2">
            {workoutExercises.length} exercises
          </Text>
        </View>
        {/* if not exercises show a message */}
        {workoutExercises.length === 0 && (
          <View className="bg-gray-50 rounded-2xl p-8 items-center mx-6">
            <Ionicons name="barbell-outline" size={48} color={"#9ca3af"} />
            <Text className="text-gray-600 text-lg text-center mt-4 font-medium">
              No exercises yet
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Get started by adding your first exercise below
            </Text>
          </View>
        )}

        {/* all exercises vertical list */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1 px-6 mt-4">
            {workoutExercises.map((exercise) => (
              <View key={exercise.id} className="mb-8">
                {/* exercise header */}
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/exercise-detail",
                      params: {
                        id: exercise.sanityId,
                      },
                    })
                  }
                  className="bg-blue-50 rounded-2xl p-4 mb-3"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-gray-900 mb-2">
                        {exercise.name}
                      </Text>
                      <Text>
                        {exercise.sets.length} sets .{" "}
                        {exercise.sets.filter((set) => set.isCompleted).length}{" "}
                        completed
                      </Text>
                    </View>

                    {/* delete exercise button */}
                    <TouchableOpacity
                      onPress={() => deleteExercise(exercise.id)}
                      className="w-10 h-10 rounded-xl items-center justify-center bg-red-500 ml-3"
                    >
                      <Ionicons name="trash" size={16} color={"white"} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* exercise set */}
                <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
                  <Text className="text-lg font-semibold text-gray-900 mb-3">
                    Sets
                  </Text>
                  {exercise.sets.length === 0 ? (
                    <Text className="text-gray-500 text-center py-4">
                      No sets yet. Add your first set below.
                    </Text>
                  ) : (
                    exercise.sets.map((set, setIndex) => (
                      <View
                        key={set.id}
                        className={`py-3 px-3 mb-2 rounded-lg  border ${
                          set.isCompleted
                            ? "bg-green-100 border-green-300"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <View className="flex-row items-center justify-between">
                          <Text className="text-gray-700">
                            Set {setIndex + 1}
                          </Text>
                          {/* reps input */}
                          <View className="flex-1 mx-2">
                            <Text className="text-xs text-gray-500 mb-1">
                              Reps
                            </Text>
                            <TextInput
                              value={set.reps}
                              onChangeText={(value) =>
                                updateSet(exercise.id, set.id, "reps", value)
                              }
                              placeholder="0"
                              keyboardType="numeric"
                              className={`border rounded-lg px-3 py-2 text-center
                              ${
                                set.IsCompleted
                                  ? "bg-gray-100 border-gray-300 text-gray-50"
                                  : "bg-white border-gray-300"
                              } `}
                              editable={!set.isCompleted}
                            />
                          </View>

                          <View className="flex-1 mx-2">
                            <Text className="text-xs text-gray-500 mb-1">
                              `Weight`
                            </Text>
                            <TextInput
                              value={set.weight}
                              onChangeText={(value) =>
                                updateSet(exercise.id, set.id, "weight", value)
                              }
                              placeholder="0"
                              keyboardType="numeric"
                              className={`border rounded-lg px-3 py-2 text-center ${
                                set.isCompleted
                                  ? "bg-gray-100 border-gray-300 text-gray-500"
                                  : "bg-white border-gray-300"
                              }`}
                              editable={!set.isCompleted}
                            />
                          </View>

                          {/* complete button */}
                          <TouchableOpacity
                            onPress={() =>
                              toggleSetCompletion(exercise.id, set.id)
                            }
                            className={`w-12 h-12 rounded-xl items-center justify-center mx-1 ${
                              set.isCompleted ? "bg-green-500" : "bg-gray-200"
                            }`}
                          >
                            <Ionicons
                              name={
                                set.isCompleted
                                  ? "checkmark"
                                  : "checkmark-outline"
                              }
                              size={20}
                              color={set.isCompleted ? "white" : "#9ca3af"}
                            />
                          </TouchableOpacity>

                          {/* delete set button */}
                          <TouchableOpacity
                            onPress={() => deleteSet(exercise.id, set.id)}
                            className="w-12 h-12 rounded-xl items-center justify-center bg-red-500 ml-1"
                          >
                            <Ionicons name="trash" size={16} color={"white"} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}

                  {/* add new set  button */}
                  <TouchableOpacity
                    onPress={() => addNewSet(exercise.id)}
                    className="bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg py-3 items-center mt-2"
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="add" size={16} color={"#3b82f6"} />
                      <Text className="text-blue-600 font-medium">Add Set</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* add exercise button */}
            <TouchableOpacity
              onPress={addExercise}
              className="bg-blue-600 rounded-2xl py-4 items-center mb-8 active:bg-blue-700"
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="add"
                  size={20}
                  color={"white"}
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white font-semibold text-lg">
                  Add Exercise
                </Text>
              </View>
            </TouchableOpacity>

            {/* complete workout button */}
            <TouchableOpacity
              onPress={saveWorkout}
              className={`rounded-2xl py-4 items-center mb-8
                  ${
                    isSaving ||
                    workoutExercises.length === 0 ||
                    workoutExercises.some((exercise) =>
                      exercise.sets.some((set) => !set.isCompleted)
                    )
                      ? "bg-gray-400"
                      : "bg-green-600 active:bg-green-700"
                  }`}
              disabled={
                isSaving ||
                workoutExercises.lenght === 0 ||
                workoutExercises.some((exercise) =>
                  exercise.sets.some((set) => !set.isCompleted)
                )
              }
            >
              {isSaving ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size={"small"} color={"white"} />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Saving...
                  </Text>
                </View>
              ) : (
                <View>
                  <Text className="text-white font-semibold text-lg">
                    Save workout
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* exercise selection modal} */}
      <ExerciseSelectionModal
        visible={showExerciseSelection}
        onClose={() => setShowExeriseSelection(false)}
      />
    </View>
  );
};

export default ActiveWorkout;
