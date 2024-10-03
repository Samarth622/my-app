import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder,
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <View className={`${otherStyles}`} style={styles.inputContainer}>
      <Ionicons name={name} size={24} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={handleChangeText}
        secureTextEntry={title === 'Password' && !showPassword}
      />
      {title == "Password" ? <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Ionicons
          name={showPassword ? "eye-outline" : "eye-off-outline"}
          size={24}
          color="#888"
        />
      </TouchableOpacity> : <></>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
});

export default FormField;
