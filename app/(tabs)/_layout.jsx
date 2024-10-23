import { View, Text, Image } from "react-native";
import { Tabs, Redirect, useRouter, Stack } from "expo-router";
import { icons } from "../../constants";
import { getToken } from "../../constants/token";
import { useState, useEffect } from "react";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-1">
      <Image
        source={icon}
        resizeMode="conatin"
        tintColor={color}
        className="w-7 h-7"
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
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace("/sign-in");
      }
    };

    checkToken();
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <>
          <Tabs
            screenOptions={{
              tabBarShowLabel: false,
              tabBarActiveTintColor: "#4fad07",
              tabBarInactiveTintColor: "#c4ccbe",
              tabBarStyle: {
                backgroundColor: "#fff",
                borderTopWidth: 1,
                borderTopColor: "black",
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
                    name="Home"
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
                    name="Scan"
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
                    name="Profile"
                    focused={focused}
                  />
                ),
              }}
            />
          </Tabs>
        </>
      ) : null}
    </>
  );
};

export default TabsLayout;
