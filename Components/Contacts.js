import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const Contacts = ({ contact }) => {
    return (
        <View style={styles.container}>
            <View style={styles.photoContainer}>
                <Image source={contact.photo} style={styles.photo} />
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{contact.firstName} {contact.lastName}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#222222',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    photoContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 15,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    detailsContainer: {
        flex: 1,
    },
    name: {
        color: 'white',
        fontSize: 18,
    },
});

export default Contacts;
