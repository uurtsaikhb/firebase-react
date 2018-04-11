import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Expo from 'expo';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyBYun5M3tPk4rKRr0Y2t6Zr9q8rq9gRswU',
  authDomain: 'react-native-firebase-c9650.firebaseapp.com',
  databaseURL: 'https://react-native-firebase-c9650.firebaseio.com',
  projectId: 'react-native-firebase-c9650',
  storageBucket: ''
};

firebase.initializeApp(firebaseConfig);

import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        console.log(user);
      }
    });
  }

  signUpUser = (email, password) => {
    try {
      if (password.lenght < 6) {
        alert('please at least 6 characters');
        return;
      }

      firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  loginUser = (email, password) => {
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          console.log(user);
        });
    } catch (error) {
      console.log(error.toString());
    }
  };

  async loginWithFacebook() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('187562625376552', {
      permissions: ['public_profile']
    });

    if (type === 'success') {
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);

      firebase
        .auth()
        .signInWithCredential(credentials)
        .catch(error => {
          console.log(error);
        });
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={email => {
                this.setState({ email });
              }}
            />
          </Item>

          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={password => {
                this.setState({ password });
              }}
            />
          </Item>

          <Button
            style={styles.button}
            full
            rounded
            success
            onPress={() => {
              this.loginUser(this.state.email, this.state.password);
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Button>

          <Button
            style={styles.button}
            full
            rounded
            primary
            onPress={() => {
              this.signUpUser(this.state.email, this.state.password);
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Button>

          <Button
            style={styles.button}
            full
            rounded
            primary
            onPress={() => this.loginWithFacebook()}
          >
            <Text style={styles.buttonText}>Login with Facebook</Text>
          </Button>
        </Form>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
  },
  button: {
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  }
});
