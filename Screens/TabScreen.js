import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import HomeScreen from "./HomeScreen.js";
import SettingsScreen from "./SettingsScreen.js";
import ContactsPage from "./ContactsPage.js";

const Tab = createBottomTabNavigator();

const TabScreen = () => {
	return (
		<View style={styles.main}>
			<Tab.Navigator
				screenOptions={{
					headerShown: true,
					headerShadowVisible: false,
                    tabBarShadowEnabled: false,
					tabBarStyle: {
                        backgroundColor: "rgba(0,0,0,0.1)",
                        borderTopWidth: 0,
                    },
                    
				}}
			>
				<Tab.Screen
					name="Home"
					component={HomeScreen}
					options={{
                        title: "Home",
						headerStyle: {
							backgroundColor: "#000000",
						},
						headerTintColor: "#fff",
						tabBarLabel: "Home",
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="home" color={color} size={size} />
						),
					}}
				/>
				<Tab.Screen
					name="ContactsPage"
					component={ContactsPage}
					options={{
						title: "Contacts",
						headerStyle: {
							backgroundColor: "#000000",
						},
						headerTintColor: "#fff",
						tabBarLabel: "Contacts",
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="account" color={color} size={size} />
						),
					}}
				/>
				<Tab.Screen
					name="SettingsScreen"
					component={SettingsScreen}
					options={{
						headerStyle: {
                            title: "Settings",
							backgroundColor: "#000000",
						},
						headerTintColor: "#fff",
						tabBarLabel: "Settings",
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="cog" color={color} size={size} />
						),
					}}
				/>
			</Tab.Navigator>
		</View>
	);
};

export default TabScreen;

const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: "#000000",
	},
});
