import { Stack } from "expo-router";

const HistoryLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="workout-record"
        options={{
          headerShown: true,
          headerTitle: "Workout Record",
          headerBackTitle: "History",
        }}
      />
    </Stack>
  );
};

export default HistoryLayout;
