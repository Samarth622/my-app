import * as SecureStore from "expo-secure-store";

async function saveToken(token) {
  console.log("Token : ", token);
  await SecureStore.setItemAsync("accessToken", token);
}

async function getToken() {
  let result = await SecureStore.getItemAsync("accessToken");
  if (result) {
    console.log("Token:", result);
    return result;
  } else {
    console.log("No token found");
    return null;
  }
}

async function deleteToken() {
  await SecureStore.deleteItemAsync("accessToken");
}

export { saveToken, getToken, deleteToken };
