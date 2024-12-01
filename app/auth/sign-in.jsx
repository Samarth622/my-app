import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../../components/CustomButton";
import { router, Link } from "expo-router";
import { saveToken } from "../../constants/token";
import axios from "axios";
import Toast from "react-native-toast-message";

const SignIn = () => {
  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    const mobilePattern = /^[0-9]{10}$/; // Simple pattern for 10-digit mobile number
    if (!mobilePattern.test(form.mobile)) {
      Toast.show({
        type: "error",
        text1: "Invalid Mobile Number",
        text2: "Please enter a valid 10-digit mobile number.",
      });
      return false;
    }

    if (form.password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Invalid Password",
        text2: "Password must be at least 6 characters long.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.post(
        // "http://10.0.2.2:3000/api/v1/users/login",
        "http://192.168.246.137:3000/api/v1/users/login",
        {
          mobile: form.mobile,
          password: form.password,
        }
      );

      if (response.status === 200) {
        const { accessToken } = response.data.data;
        await saveToken(accessToken);
        Toast.show({
          type: "success",
          text1: "Login Successful",
        });
        setTimeout(() => {
          router.replace("tabs/home");
        }, 900)
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          Toast.show({
            type: "error",
            text1: "Login Failed",
            text2: "Mobile and Password is required.",
          });
          setForm({ mobile: "", password: "" });
        } else if (status === 401) {
          Toast.show({
            type: "error",
            text1: "Login Failed",
            text2: "Password is incorrect.",
          });
          setForm({ password: "" });
        } else if (status === 404) {
          Toast.show({
            type: "error",
            text1: "Login Failed",
            text2: "Mobile number does not exist.",
          });
          setForm({ mobile: "", password: "" });
        } else {
          Toast.show({
            type: "error",
            text1: "Login Failed",
            text2: "An unknown error occurred. Please try again.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Server is not reachable.",
        });
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={images.lr} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <SafeAreaView className="h-full">
            <ScrollView contentContainerStyle={{ height: "100%" }}>
              <View className="w-full h-full px-10 mt-[90px]">
                <Text className="text-[35px] font-bold text-gray-600">
                  Welcome Back
                </Text>
                <Text className="font-regular text-[18px] text-gray-400">
                  Sign in to continue
                </Text>
                <FormField
                  title="Mobile"
                  value={form.mobile}
                  handleChangeText={(e) => setForm({ ...form, mobile: e })}
                  otherStyles="mt-[50px]"
                  placeholder="Mobile No."
                  name="person-outline"
                />
                <FormField
                  title="Password"
                  value={form.password}
                  handleChangeText={(e) => setForm({ ...form, password: e })}
                  otherStyles="mt-[5px]"
                  placeholder="Password"
                  name="lock-closed-outline"
                />
                <View style={styles.rememberMeContainer}>
                  <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
                    <Ionicons
                      name={rememberMe ? "checkbox-outline" : "square-outline"}
                      size={24}
                      color={rememberMe ? "green" : "#888"}
                    />
                  </TouchableOpacity>
                  <Text style={styles.rememberMeText}>Remember Me</Text>
                </View>

                <CustomButton
                  title="Login"
                  handlePress={handleSubmit}
                  containerStyles="w-full mt-[50px]"
                />

                <TouchableOpacity>
                  <Link href="forgot-password" style={styles.forgotPassword}>
                    Forget password?
                  </Link>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>
                    Don't have an account yet?{" "}
                  </Text>
                  <TouchableOpacity>
                    <Link href="./sign-up" style={styles.registerLink}>
                      Register
                    </Link>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
        <Toast />
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberMeText: {
    marginLeft: 10,
  },
  forgotPassword: {
    color: "#4CAF50",
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
    marginBottom: 20,
    marginTop: 10,
  },
  registerContainer: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    color: "#888",
  },
  registerLink: {
    color: "#4CAF50",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default SignIn;
