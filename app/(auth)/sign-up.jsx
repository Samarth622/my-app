import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Alert,
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
      Alert.alert("Error", "You must agree to the terms and conditions.");
      return;
    }

    if (form.mobile.length != 10) {
      Alert.alert("Mobile is of 10 characters");
      // setForm({ name: "", email: "", mobile: "", password: "" });
      setTermsAgreed(false);
      return;
    }
    try {
      const response = await axios.post(
        "http://192.168.181.137:3000/api/v1/users/signup",
        // "http://10.0.2.2:3000/api/v1/users/signup",
        {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
        }
      );

      if (response.status == 200) {
        Alert.alert("Signup Successful", "You have successfully signed up!");
        form.name = "";
        form.email = "";
        form.mobile = "";
        form.password = "";
        router.push("sign-in");
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        const status = error.response.status;

        if (status === 400) {
          Alert.alert("All Fields are required");
          // setForm({ name: "", email: "", mobile: "", password: "" });
        } else if (status === 422) {
          Alert.alert("Email is not valid or Minimum password length is 7");
          // setForm({ name: "", email: "", mobile: "", password: "" }); // Keep mobile number, reset password
        } else if (status === 409) {
          Alert.alert("Mobile already registered.");
          // setForm({ name: "", email: "", mobile: "", password: "" });
        } else {
          Alert.alert(
            "Login failed",
            "An unknown error occurred. Please try again."
          );
        }
      } else {
        // If the error doesn't have a response, it's a network or other issue
        Alert.alert(
          "Error during login:",
          "Network error or server is not reachable."
        );
      }
    }
  };

  return (
    <ImageBackground source={images.background}>
      <SafeAreaView className="h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full h-full items-center">
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
  registerButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
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
