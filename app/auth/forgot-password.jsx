import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

const ForgetPasword = () => {
  const [form, setForm] = useState({
    email: "",
  });

  return (
    <ImageBackground source={images.background}>
      <SafeAreaView className="h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full h-full px-10 my-5">
            <Text style={styles.title}>Forget password?</Text>
            <Text style={styles.subtitle} className="font-semibold">
              Enter your email address and we we'll send you email with
              instructions on how to change your password
            </Text>

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-[50px]"
              placeholder="Email Address"
              name="mail-outline"
            />

            <CustomButton
              title="Submit"
              containerStyles="w-full mt-7"
              handlePress={() => router.push("sign-in")}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 35,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 32,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ForgetPasword;
