import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { images } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { router, Link } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [termsAgreed, setTermsAgreed] = useState(false);

  const handleSubmit = async () => {
    if (!termsAgreed) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "You must agree to the terms and conditions.",
      });
      return;
    }

    if (form.mobile.length !== 10) {
      Toast.show({
        type: "error",
        text1: "Invalid Mobile",
        text2: "Mobile number must be 10 digits long.",
      });
      setTermsAgreed(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.246.137:3000/api/v1/users/signup",
        {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
        }
      );

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Signup Successful",
          text2: "You have successfully signed up!",
        });
        setForm({ name: "", email: "", mobile: "", password: "" });
        setTimeout(() => {
          router.push("auth/sign-in");
        }, 900)
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "All fields are required.",
          });
        } else if (status === 422) {
          Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: "Invalid email or password must be at least 7 characters.",
          });
        } else if (status === 409) {
          Toast.show({
            type: "error",
            text1: "Conflict",
            text2: "Mobile number already registered.",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "An unknown error occurred. Please try again.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Server not reachable. Please try again later.",
        });
      }
    }
  };

  return (
    <ImageBackground source={images.lr}>
      <SafeAreaView className="h-full">
        <ScrollView>
          <View className="w-full h-full items-center mt-[90px]">
            <Text className="text-[35px] font-bold text-gray-500">
              Register
            </Text>
            <FormField
              title="Name"
              value={form.name}
              handleChangeText={(e) => setForm({ ...form, name: e })}
              otherStyles="mt-[50px] w-[350px]"
              placeholder="Name"
              name="person-outline"
            />
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-[1px] w-[350px]"
              placeholder="Email"
              name="mail-outline"
            />
            <FormField
              title="Mobile"
              value={form.mobile}
              handleChangeText={(e) => setForm({ ...form, mobile: e })}
              otherStyles="mt-[1px] w-[350px]"
              placeholder="Mobile No."
              name="call-outline"
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-[1px] w-[350px]"
              placeholder="Password"
              name="lock-closed-outline"
            />

            <View style={styles.termsContainer}>
              <TouchableOpacity onPress={() => setTermsAgreed(!termsAgreed)}>
                <Ionicons
                  name={termsAgreed ? "checkbox-outline" : "square-outline"}
                  size={24}
                  color={termsAgreed ? "green" : "#888"}
                />
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I have read and agree to the{" "}
                <Link href="" style={styles.link}>
                  Term of use
                </Link>
              </Text>
            </View>

            <CustomButton
              title="Register"
              handlePress={handleSubmit}
              containerStyles="w-[200px] mt-7"
            />

            <Text style={styles.loginText}>
              Already have an account yet?{" "}
              <Link style={styles.link} href="./sign-in">
                Login
              </Link>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Toast />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 5,
  },
  termsText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  link: {
    color: "#4CAF50",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 19,
    color: "#666",
  },
});

export default SignUp;
