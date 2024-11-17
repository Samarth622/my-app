import { View, Text, Image, BackHandler } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { icons } from "../../constants";
import { getToken } from "../../constants/token";
import { useState, useEffect } from "react";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={icon}
        resizeMode="contain"  // Fix typo here from 'conatin' to 'contain'
        style={{ tintColor: color, width: 28, height: 28 }}  // Adjust style for React Native
      />
    </View>
  );
};

const TabsLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken("accessToken");
      setIsAuthenticated(!!token);
      if (!token) {
        router.replace("/sign-in");
      }
    };

    checkToken();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!isAuthenticated) {
        router.replace("/sign-in");
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#4fad07",
        tabBarInactiveTintColor: "#c4ccbe",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#000",
          height: 50,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.plus}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
