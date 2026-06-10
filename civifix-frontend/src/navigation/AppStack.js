import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import ComplaintsListScreen from "../screens/Complaints/ComplaintsListScreen";
import CreateComplaintScreen from "../screens/Complaints/CreateComplaintScreen";
import ComplaintDetailScreen from "../screens/Complaints/ComplaintDetailScreen";
import WardListScreen from "../screens/Ward/WardListScreen";
import WardDetailScreen from "../screens/Ward/WardDetailScreen";
import { COLORS, SPACING } from "../constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#F9FAFB" },
      }}
    >
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="CreateComplaint" component={CreateComplaintScreen} />
      <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
    </Stack.Navigator>
  );
};

const ComplaintsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#F9FAFB" },
      }}
    >
      <Stack.Screen name="ComplaintsHome" component={ComplaintsListScreen} />
      <Stack.Screen name="CreateComplaint" component={CreateComplaintScreen} />
      <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#F9FAFB" },
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const WardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#F9FAFB" },
      }}
    >
      <Stack.Screen name="WardList" component={WardListScreen} />
      <Stack.Screen name="WardDetail" component={WardDetailScreen} />
    </Stack.Navigator>
  );
};

export const AppStack = () => {
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textGray,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.card,
          paddingTop: SPACING.sm,
          paddingBottom: (insets.bottom || SPACING.sm) + SPACING.sm,
          height: 64 + (insets.bottom || 0),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: SPACING.xs,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Complaints"
        component={ComplaintsStack}
        options={{
          tabBarLabel: "Complaints",
          tabBarIcon: ({ color, size }) => (
            <Icon name="clipboard-text-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Wards tab for DISTRICT_ADMIN and INSPECTOR */}
      {(user?.role === "DISTRICT_ADMIN" || user?.role === "INSPECTOR") && (
        <Tab.Screen
          name="Wards"
          component={WardStack}
          options={{
            tabBarLabel: "Wards",
            tabBarIcon: ({ color, size }) => (
              <Icon name="map-outline" color={color} size={size} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Raise"
        component={DashboardStack}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                backgroundColor: focused ? COLORS.secondary : COLORS.primary,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 22,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Icon name="plus" color={COLORS.card} size={28} />
            </View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              activeOpacity={0.85}
              onPress={() =>
                props.accessibilityState?.selected
                  ? props.onPress?.()
                  : props.onPress?.()
              }
            />
          ),
          listeners: ({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Dashboard", { screen: "CreateComplaint" });
            },
          }),
        }}
      />
      <Tab.Screen
        name="Status"
        component={DashboardStack}
        options={{
          tabBarLabel: "Status",
          tabBarIcon: ({ color, size }) => (
            <Icon name="magnify" color={color} size={size} />
          ),
          listeners: ({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Complaints", { screen: "ComplaintsHome" });
            },
          }),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
