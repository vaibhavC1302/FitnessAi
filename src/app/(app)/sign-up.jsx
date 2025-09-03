import * as React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    if (!emailAddress || !password) {
      Alert.alert("Error", "Please enter all the fields");
      return;
    }
    setIsLoading(true);
    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    if (!code) {
      Alert.alert("Error", "Please enter verification code");
      return;
    }

    setIsLoading(true);

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 px-6">
          <View className="flex-1 justify-center">
            {/* logo branding */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-2xl items-center justify-center ">
                <Ionicons name="mail" size={40} color={"white"} />
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Check your Email
              </Text>
              <Text className="text-lg text-gray-600 text-center">
                We've sent a verification code to {"\n"}
                {emailAddress}
              </Text>
            </View>

            {/* verification form */}
            <View
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6
            "
            >
              <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Enter verification code
              </Text>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </Text>
                <View className="flex-row items-center text-gray-50 rounded-xl px-4 border border-gray-200">
                  <Ionicons name="key-outline" size={20} color={"#6B7280"} />
                  <TextInput
                    value={code}
                    placeholder="Enter 6 digit verification code"
                    placeholderTextColor="#9ca3af"
                    onChangeText={setCode}
                    className="flex-1 ml-3 text-gray-900 text-center text-sm tracking-widest"
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={onVerifyPress}
                disabled={isLoading}
                className={`rounded-xl py-4 shadow-sm mb-4 ${
                  isLoading ? "bg-gray-400" : "bg-green-600"
                }`}
              >
                <View className="flex-row items-center justify-center">
                  {isLoading ? (
                    <Ionicons name="refresh" size={28} color={"white"} />
                  ) : (
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color={"white"}
                    />
                  )}
                  <Text className="text-white font-semibold text-lg ml-2">
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* resend code */}
              <TouchableOpacity className="py-2">
                <Text className="text-blue-600 font-medium text-center">
                  Didn't recieve the code? Resend
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* footer */}
          <View className="pb-6">
            <Text className="text-center text-gray-500 text-sm">
              Almost there! Just one more step
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 px-6">
        {/* main */}
        <View className="flex-1 justify-center">
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-2xl items-center justify-center ">
              <Ionicons name="fitness" size={40} color={"white"} />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Join FitTracker
            </Text>
            <Text className="text-lg text-gray-600 text-center">
              Start your fitness journey{"\n"}and achieve your goals.
            </Text>
          </View>

          {/* signup form */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Create your account
            </Text>

            {/* email input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700">Email</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 mt-1 border border-gray-200">
                <Ionicons name="mail-outline" size={20} color={"#6b7280"} />
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor={"#9ca3af"}
                  onChangeText={setEmailAddress}
                  editable={!isLoading}
                  className="flex-1 ml-3 text-gray-900 h-10"
                />
              </View>
            </View>

            {/* password input */}
            <View className="mb-2">
              <Text className="text-sm font-medium text-gray-700">
                Password
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 mt-1  border border-gray-200">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={"#6b7280"}
                />
                <TextInput
                  autoCapitalize="none"
                  value={password}
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  placeholderTextColor={"#9ca3af"}
                  onChangeText={setPassword}
                  editable={!isLoading}
                  className="flex-1 ml-3 text-gray-900"
                />
              </View>
            </View>
          </View>
          {/* sing in button */}
          <TouchableOpacity
            onPress={onSignUpPress}
            disabled={isLoading}
            className={`rounded-xl py-4 shadow-sm
                            ${isLoading ? "bg-gray-400" : "bg-blue-600"}
                            `}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              {isLoading ? (
                <Ionicons name="refresh" size={20} color={"white"} />
              ) : (
                <Ionicons name="person-add-outline" size={20} color={"white"} />
              )}
              <Text className="text-white font-semibold text-lg ml-2">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* terms */}
          <Text className="text-xs text-gray-500 text-center mb-4">
            By signing up you agree to out Terms of services and Privacy Policy
          </Text>
        </View>

        {/* signup link  */}
        <View className="flex-row justify-center items-center mb-1">
          <Text className="text-gray-600">Already have an account?</Text>
          <Link href={"/sign-in"} asChild>
            <TouchableOpacity>
              <Text className="text-blue-600 font-semibold"> Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* footer section */}
        <View className="pb-6">
          <Text className="text-center text-gray-500 text-sm">
            Ready to transform your fitness
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// <View>
//   <>
//     <Text>Sign up</Text>
//     <TextInput
//       autoCapitalize="none"
//       value={emailAddress}
//       placeholder="Enter email"
//       onChangeText={(email) => setEmailAddress(email)}
//     />
//     <TextInput
//       value={password}
//       placeholder="Enter password"
//       secureTextEntry={true}
//       onChangeText={(password) => setPassword(password)}
//     />
//     <TouchableOpacity onPress={onSignUpPress}>
//       <Text>Continue</Text>
//     </TouchableOpacity>
//     <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
//       <Text>Already have an account?</Text>
//       <Link href="/sign-in">
//         <Text>Sign in</Text>
//       </Link>
//     </View>
//   </>
// </View>
