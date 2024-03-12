import React, { useState } from "react";
import {
	StyleSheet,
	View,
	TextInput,
	Text,
	TouchableOpacity,
	SafeAreaView,
	Image,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { useNavigation } from '@react-navigation/native';

const ContactForm = ({ navigation, route }) => {

	const [image, setImage] = useState();

	const {
		contactEdit = {
			id: "",
			firstName: "",
			lastName: "",
			phoneNumber: "",
			photo: require("../assets/images/user1.png"),
		},
		isCreating,
	} = route.params;
	const [error, setError] = useState("");
	const [contact, setContact] = useState({
		id: "",
		firstName: "",
		lastName: "",
		phoneNumber: "",
		photo: image,
	});

	const [editContact, setEditContact] = useState({
		id: contactEdit.id,
		firstName: contactEdit.firstName,
		lastName: contactEdit.lastName,
		phoneNumber: contactEdit.phoneNumber,
		photo: contactEdit.photo,
	});

	const sortContacts = (contactsList) => {
		return contactsList.sort((a, b) => {
		  const nameA = a.firstName.toLowerCase();
		  const nameB = b.firstName.toLowerCase();
		  if (nameA < nameB) return -1;
		  if (nameA > nameB) return 1;
		  return 0;
		});
	  };
	  

	const createContact = async () => {
		try {
			const existingContactsString = await AsyncStorage.getItem("contactsList");
			let existingContacts = [];
			if (existingContactsString) {
				existingContacts = JSON.parse(existingContactsString);
			}

			const newPhoneNumber = contact.phoneNumber;

			const isPhoneNumberUnique = existingContacts.every(
				(contact) => contact.phoneNumber !== newPhoneNumber
			);

			if (!isPhoneNumberUnique) {
				setError("Phone number must be unique");
				return;
			}

			const id =
				contact.firstName.charAt(0) +
				contact.lastName.charAt(0) +
				contact.phoneNumber;


			
			 const updatedContactsList = sortContacts([...existingContacts, { ...contact, id, photo: image }]);

			 
			await AsyncStorage.setItem(
				"contactsList",
				JSON.stringify(updatedContactsList)
			);
			navigation.navigate("TabScreen", {
				contactsList: updatedContactsList,
			});
		} catch (error) {
			console.error("Error saving contact:", error);
		}
	};

	const updateContact = async () => {
		if (handleError(editContact) === "") {
			try {
				const existingContactsString = await AsyncStorage.getItem(
					"contactsList"
				);
				let existingContacts = [];
				if (existingContactsString) {
					existingContacts = JSON.parse(existingContactsString);
				}

				const newPhoneNumber = editContact.phoneNumber;

				// Check if the new phone number is unique, excluding the current contact being edited
				const isPhoneNumberUnique = existingContacts.every(
					(contact) =>
						contact.id === editContact.id ||
						contact.phoneNumber !== newPhoneNumber
				);

				if (!isPhoneNumberUnique) {
					setError("Phone number must be unique");
					return;
				}

				const updatedContactsList = sortContacts(existingContacts.map((item) => {
					if (item.id === editContact.id) {
						return {
							...item,
							firstName: editContact.firstName,
							lastName: editContact.lastName,
							phoneNumber: editContact.phoneNumber,
							photo: image,
						};
					} else {
						return item;
					}
				}));

				await AsyncStorage.setItem(
					"contactsList",
					JSON.stringify(updatedContactsList)
				);
				navigation.navigate("TabScreen", {
					contactsList: updatedContactsList,
				});
				setError("");
			} catch (error) {
				console.error("Error updating contact:", error);
			}
		}
	};

	const deleteContact = async () => {
		try {
			const existingContactsString = await AsyncStorage.getItem("contactsList");
			let existingContacts = [];
			if (existingContactsString) {
				existingContacts = JSON.parse(existingContactsString);
			}

			const updatedContactsList = existingContacts.filter(
				(item) => item.id !== editContact.id
			);

			await AsyncStorage.setItem(
				"contactsList",
				JSON.stringify(updatedContactsList)
			);
			navigation.navigate("TabScreen", {
				contactsList: updatedContactsList,
			});
		} catch (error) {
			console.error("Error deleting contact:", error);
		}
	};

	const showDeleteConfirmation = () => {
		Alert.alert(
			"Delete Contact",
			"Are you sure you want to delete this contact?",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Delete", onPress: deleteContact },
			]
		);
	};

	const handleInputChange = (fieldName, value) => {
		setContact({
			...contact,
			[fieldName]: value,
		});
	};

	const handleError = (contactError) => {
		let message = "";
		if (contactError.phoneNumber.length !== 8) {
			message = "Number must be 8 characters";
		} else if (contactError.lastName.length === 0) {
			message = "Last name can't be empty";
		} else if (contactError.lastName.length >= 20) {
			message = "Last name must be shorter than 20 characters";
		} else if (contactError.firstName.length === 0) {
			message = "First name can't be empty";
		} else if (contactError.firstName.length >= 20) {
			message = "First name must be shorter than 20 characters";
		}
		setError(message);
		return message;
	};

	const handleUpdateInputChange = (fieldName, value) => {
		setEditContact({
			...editContact,
			[fieldName]: value,
		});
	};

	const addContact = () => {
		if (handleError(contact) === "") {
			createContact();
			setContact({
				id: "",
				firstName: "",
				lastName: "",
				phoneNumber: "",
				photo: require("../assets/images/user1.png"),
			});
			setError("");
		}
	};

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
		  mediaTypes: ImagePicker.MediaTypeOptions.All,
		  allowsEditing: true,
		  aspect: [4, 3],
		  quality: 1,
		});
	
		console.log(result);
	
		if (!result.canceled) {
		  setImage(result.assets[0].uri);
		}
	  };
	
	

	const navigations = useNavigation();

	const handleGoBack = () => {
		navigations.goBack();
	};

	return (
		<SafeAreaView style={styles.mainContainer}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<View style={styles.mainContainer}>
					<View style={styles.backCont}>
						<TouchableOpacity onPress={handleGoBack}>
							<MaterialCommunityIcons
								name="arrow-left"
								color="#0E7AFE"
								size={28}
							/>
						</TouchableOpacity>
					</View>
					<View style={styles.topCont}>
						{isCreating ? (
							<Text style={styles.newContact}>New Contact</Text>
						) : (
							<Text style={styles.newContact}>Edit Contact</Text>
						)}
						{isCreating ? (
							<TouchableOpacity onPress={addContact} style={styles.addButton}>
								<Text style={styles.addContactText}>Add Contact</Text>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								onPress={updateContact}
								style={styles.addButton}
							>
								<Text style={styles.addContactText}>Edit</Text>
							</TouchableOpacity>
						)}
					</View>
					<Text style={styles.errorText}>{error}</Text>
					{isCreating ? (
						<View style={styles.formView}>
							<View style={styles.photoContainer}>
								{image ? <Image source={{ uri: image }} style={styles.setPhoto} /> :<Image source={contact.photo} style={styles.photo} />}
							</View>
							<TouchableOpacity style={styles.addPhoto} onPress={pickImage}>
								<Text style={styles.addPhotoText}>Add Photo</Text>
							</TouchableOpacity>
							<View style={styles.inCont}>
								<TextInput
									placeholder="First Name"
									placeholderTextColor="#aaaaaa"
									value={contact.firstName}
									style={styles.inputs}
									onChangeText={(text) => handleInputChange("firstName", text)}
								/>
								<TextInput
									placeholder="Last Name"
									placeholderTextColor="#aaaaaa"
									value={contact.lastName}
									style={styles.inputs}
									onChangeText={(text) => handleInputChange("lastName", text)}
								/>
								<TextInput
									placeholder="Phone Number"
									placeholderTextColor="#aaaaaa"
									value={contact.phoneNumber}
									style={styles.phoneInput}
									onChangeText={(text) =>
										handleInputChange("phoneNumber", text)
									}
									keyboardType="numeric"
								/>
							</View>
						</View>
					) : (
						<View style={styles.formView}>
							<View style={styles.photoContainer}>
								{image ? <Image source={{ uri: image }} style={styles.setPhoto} /> :<Image source={editContact.photo} style={styles.photo} />}
							</View>
							<TouchableOpacity style={styles.addPhoto} onPress={pickImage}>
								<Text style={styles.addPhotoText}>Add Photo</Text>
							</TouchableOpacity>
							<View style={styles.inCont}>
								<TextInput
									placeholder="First Name"
									placeholderTextColor="#aaaaaa"
									value={editContact.firstName}
									style={styles.inputs}
									onChangeText={(text) =>
										handleUpdateInputChange("firstName", text)
									}
								/>
								<TextInput
									placeholder="Last Name"
									placeholderTextColor="#aaaaaa"
									value={editContact.lastName}
									style={styles.inputs}
									onChangeText={(text) =>
										handleUpdateInputChange("lastName", text)
									}
								/>
								<TextInput
									placeholder="Phone Number"
									placeholderTextColor="#aaaaaa"
									value={editContact.phoneNumber}
									style={styles.phoneInput}
									onChangeText={(text) =>
										handleUpdateInputChange("phoneNumber", text)
									}
									keyboardType="numeric"
								/>
							</View>
						</View>
					)}
					{!isCreating && (
						<TouchableOpacity
							onPress={showDeleteConfirmation}
							style={styles.deleteCont}
						>
							<Text style={styles.deleteText}>Delete Contact</Text>
						</TouchableOpacity>
					)}
				</View>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		width: "100%",
		backgroundColor: "#000000",
		alignItems: "center",
	},
	formView: {
		flex: 1,
		width: "100%",
		backgroundColor: "#000000",
		alignItems: "center",
	},
	photo: {
		width: 120,
		height: 120,
		borderRadius: 160,
		marginBottom: 10,
	},
	photoContainer: {
		width: 160,
		height: 160,
		borderRadius: 200,
		backgroundColor: "#333333",
		justifyContent: "center",
		alignItems: "center",
		margin: 20,
		justifyContent: "flex-end",
	},
	addPhoto: {
		width: 120,
		height: 40,
		borderRadius: 200,
		backgroundColor: "#333333",
		alignItems: "center",
		justifyContent: "center",
		padding: 4,
		marginBottom: 40,
	},
	addPhotoText: {
		color: "white",
		fontWeight: "600",
	},
	inputs: {
		width: "90%",
		backgroundColor: "#222222",
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#5a5a5a",
		alignSelf: "flex-end",
		color: "white",
		fontSize: 16,
	},
	phoneInput: {
		width: "90%",
		backgroundColor: "#222222",
		paddingVertical: 16,
		alignSelf: "flex-end",
		color: "white",
		fontSize: 16,
	},
	inCont: {
		width: "100%",
		backgroundColor: "#222222",
	},
	backCont: {
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	topCont: {
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-between",
		borderTopWidth: 1,
		borderColor: "rgba(100,100,100,0.3)",
		marginVertical: 3,
		paddingVertical: 5,
	},
	newContact: {
		color: "white",
		fontSize: 20,
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		marginLeft: 20,
		marginTop: 8,
		fontWeight: "600",
	},
	addButton: {
		right: 0,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 20,
		marginTop: 10,
	},
	addContactText: {
		color: "#0E7AFE",
		fontSize: 15,
		fontWeight: "500",
	},
	errorText: {
		color: "#ef3333",
		margin: 8,
	},
	deleteText: {
		color: "red",
		margin: 10,
	},
	deleteCont: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		borderBottomWidth: 1,
		borderTopWidth: 1,
		borderColor: "rgba(100,100,100,0.2)",
		backgroundColor: "rgba(100,100,100,0.2)",
		padding: 2,
	},
	setPhoto:{
		width: "100%",
		height: "100%",
		borderRadius: 160,
		borderWidth:1,
		borderColor:"rgba(200,200,200,1)",
	},
});

export default ContactForm;
