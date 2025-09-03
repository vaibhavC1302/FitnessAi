import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import { useState } from "react";
import { useEffect } from "react";
import { client } from "../../../../lib/sanity/client.js";
import { Ionicons } from "@expo/vector-icons";
import {
  //   formateDate,
  formatDate2,
  formatTime,
  formatWorkoutDuration,
  getTotalSet,
  getTotalVolume,
} from "../../../../utils/difficulty.js";

// query to get workout record
const getWorkoutRecordQuery =
  defineQuery(`*[_type == 'workout' && _id == $workoutId][0]{
    _id,
    _type,
    _createdAt,
    date,
    duration,
    exercises[] {
      exercise->{
        _id,
        name,
        description
      },
        sets[]{
          reps,
          weight,
          weightUnit,
          _type,
          _key
        },
        _type,
        _key
    }
}`);

const WorkoutRecord = () => {
  const { workoutId } = useLocalSearchParams();
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchWorkout = async () => {
      if (!workoutId) return;
      try {
        const results = await client.fetch(getWorkoutRecordQuery, {
          workoutId,
        });
        setWorkout(results);
      } catch (error) {
        console.log("Error fetching workout", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, []);

  //   delete workout function
  const handleDeleteWorkout = () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteWorkout,
        },
      ]
    );
  };

  const deleteWorkout = async () => {
    if (!workoutId) {
      console.log("No workout id");
      return;
    }
    setDeleting(true);
    try {
      await fetch("/api/delete-workout", {
        method: "POST",
        body: JSON.stringify({ workoutId }),
      });

      router.replace("/(app)/(tabs)/history?refresh=true");
    } catch (error) {
      console.log("error deleting workout", error);
      Alert.alert("Error", "Failed to delete workout. Please try again", [
        {
          text: "OK",
        },
      ]);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#3b82f6"} />
          <Text className="text-gray-600 mt-4">Loading workout...</Text>
        </View>
      </View>
    );
  }

  if (!workout) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <Ionicons name="alert-circle-outline" size={64} color={"#EF4444"} />
          <Text className="text-xl font-semibold text-gray-900 mt-4">
            Workout Not Found
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            This workout record could not be found.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-blue-600 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const { volume, unit } = getTotalVolume(workout);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* workout summary */}
        <View className="bg-white p-6 border-b border-gray-300">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Workout Summary
            </Text>
            <TouchableOpacity
              onPress={handleDeleteWorkout}
              disabled={deleting}
              className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center"
            >
              {deleting ? (
                <ActivityIndicator size={"small"} color={"#ffffff"} />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={16} color={"#ffffff"} />
                  <Text className="text-white font-medium ml-2">Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="calendar-outline" size={20} color={"#6b7280"} />
            <Text className="text-gray-700 ml-3 font-medium">
              {formatDate2(workout.date)} at {formatTime(workout.date)}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="time-outline" size={20} color={"#6b7280"} />
            <Text className="text-gray-700 ml-3 font-medium">
              {formatWorkoutDuration(workout.duration)}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="fitness-outline" size={20} color={"#6b7280"} />
            <Text className="text-gray-700 ml-3 font-medium">
              {workout.exercises?.length || 0} exercises
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="bar-chart-outline" size={20} color={"#6b7280"} />
            <Text className="text-gray-700 ml-3 font-medium">
              {getTotalSet(workout)} total sets
            </Text>
          </View>

          {volume > 0 && (
            <View className="flex-row items-center">
              <Ionicons name="barbell-outline" size={20} color={"#6b7280"} />
              <Text className="text-gray-700 ml-3 font-medium">
                {volume.toLocaleString()} total volume
              </Text>
            </View>
          )}
        </View>

        {/* exercise list */}
        <View className="space-y-4 p-6 gap-4">
          {workout.exercises?.map((ex, index) => (
            <View
              key={ex._key}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              {/* exercise header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {ex.exercise?.name || "Unknown Exercise"}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    {ex.sets?.length || 0} sets completed
                  </Text>
                </View>
                <View className="bg-blue-100 rounded-full w-10 h-10 items-center justify-center">
                  <Text className="text-blue-600 font-bold">{index + 1}</Text>
                </View>
              </View>

              {/* sets */}
              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Sets:
                </Text>
                {ex.sets?.map((set, setIndex) => (
                  <View
                    key={set._key}
                    className="bg-gray-50 rounded-lg p-3 flex-row items-center
                             justify-between"
                  >
                    <View className="flex-row items-center">
                      <View className="bg-gray-200 rounded-full w-6 h-6 items-center justify-center mr-3">
                        <Text className="text-gray-700 text-xs font-medium">
                          {setIndex + 1}
                        </Text>
                      </View>
                      <Text className="text-gray-900 font-medium">
                        {set.reps} reps
                      </Text>
                    </View>

                    {set.weight && (
                      <View className="flex-row items-center">
                        <Ionicons
                          name="barbell-outline"
                          size={16}
                          color={"#6b7280"}
                        />
                        <Text className="">
                          {set.weight} {set.weightUnit || "kg"}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {/* volume summary */}
              {ex.sets && ex.sets.length > 0 && (
                <View className="mt-4 pt-4 border-t border-gray-100">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-gray-600">
                      Exercise Volume:
                    </Text>
                    <Text className="text-sm font-medium text-gray-900">
                      {ex.sets
                        .reduce((total, set) => {
                          return total + (set.weight || 0) * (set.reps || 0);
                        }, 0)
                        .toLocaleString()}{" "}
                      {ex.sets[0]?.weightUnit || "kg"}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkoutRecord;
