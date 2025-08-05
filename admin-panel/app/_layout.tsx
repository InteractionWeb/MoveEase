import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

import LoginScreen from "./auth/login";
import SignupScreen from "./auth/signup";
import HomeScreen from "./tabs/home";
import OrdersScreen from "./tabs/orders";
import UsersScreen from "./tabs/users";
import RevenueScreen from "./tabs/revenue";
import OrderDetailsScreen from "./order/[id]";
import CustomerDetailsScreen from "./customerdetails";
import VendorDetailsScreen from "./vendor/[id]";

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Drawer.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: true,
        }}
      >
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Signup" component={SignupScreen} />
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Orders" component={OrdersScreen} />
        <Drawer.Screen name="Users" component={UsersScreen} />
        <Drawer.Screen name="Revenue" component={RevenueScreen} />
        <Drawer.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Drawer.Screen name="CustomerDetails" component={CustomerDetailsScreen} />
        <Drawer.Screen name="VendorDetails" component={VendorDetailsScreen} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
}
