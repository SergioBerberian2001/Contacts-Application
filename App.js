import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ContactForm from "./Screens/ContactForm";
import ContactsPage from "./Screens/ContactsPage";
import TabScreen from "./Screens/TabScreen";

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="TabScreen" screenOptions={{ headerShown: false, headerStyle: { height: 0 } }}>
			<Stack.Screen
					name="TabScreen"
					component={TabScreen}
					options={{
						title: "",
						headerStyle: {
						  backgroundColor: '#000000', 
						},
						headerTintColor: '#fff', 
					  }}
				/>
				<Stack.Screen
					name="ContactsPage"
					component={ContactsPage}
					options={{
						title: "Contacts",
						headerStyle: {
						  backgroundColor: '#000000', 
						},
						headerTintColor: '#fff', 
					  }}
				/>
				<Stack.Screen
					name="ContactForm"
					component={ContactForm}
					options={{title: "", 
					headerStyle: {
						backgroundColor: '#000000', 
					  },
					  headerTintColor: '#0E7AFE',}}
				/>
				
			</Stack.Navigator>
			
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({});
