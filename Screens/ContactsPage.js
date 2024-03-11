import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Contacts from "../Components/Contacts";

function ContactsPage({ navigation, route }) {
	const [contactsList, setContactsList] = useState([]);


	useEffect(() => {
		const fetchContacts = async () => {
			try {
				const storedContactsString = await AsyncStorage.getItem("contactsList");
				if (storedContactsString) {
					const parsedContacts = JSON.parse(storedContactsString);
					setContactsList(parsedContacts);
				} else {
					console.info("No contacts found in storage.");
					setContactsList([]);
				}
			} catch (error) {
				console.error("Error fetching contacts from AsyncStorage:", error);
			}
		};

		fetchContacts();
	},[contactsList]);

	const navigateToAddContact = () => {
		navigation.navigate("ContactForm", { contactsList, isCreating: true });
	};

	const navigateToContact = (contactEdit) => {
		navigation.navigate("ContactForm", {
			contactEdit,
			contactsList,
			isCreating: false,
		});
	};

	return (
		<SafeAreaView style={styles.main}>
      <StatusBar barStyle="light-content" />
	  
			<View style={styles.topView}>
				<TouchableOpacity
					style={styles.addButton}
					onPress={navigateToAddContact}
				>
					<MaterialCommunityIcons name="plus" size={28} color="#0E7AFE" />
				</TouchableOpacity>
			</View>
			<FlatList
				style={styles.scroll}
				data={contactsList}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => navigateToContact(item)}>
						<Contacts contact={item} />
					</TouchableOpacity>
				)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: "#000000",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	topView: {
		alignItems: "flex-end",
		margin: 10,
		width: "100%",
	},
	addButton: {
		marginRight: 10,
    padding:5,
	},
	scroll: {
		width: "100%",
		flex: 1,
    margin:10,
	},

	contactContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
	},
	contactPhoto: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 10,
	},
	contactInfo: {
		flex: 1,
	},
	contactName: {
		fontSize: 16,
		fontWeight: "bold",
	},
	contactNumber: {
		fontSize: 14,
		color: "#666",
	},
});

export default ContactsPage;
