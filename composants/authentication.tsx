import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Buffer} from 'buffer';

// Schéma de validation avec Yup
const schema = yup.object().shape({
  username: yup.string().required("Nom d'utilisateur obligatoire"),
  password: yup
    .string()
    .min(6, 'Mot de passe trop court')
    .required('Mot de passe obligatoire'),
});

// Interface des données du formulaire
interface LoginForm {
  username: string;
  password: string;
}

// Fonction pour encoder en Base64
const encodeCredentials = (username: string, password: string) => {
  return Buffer.from(`${username}:${password}`).toString('base64');
};

const LoginScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  // Fonction de connexion avec Maximo
  const onSubmit = async (data: LoginForm) => {
    const encodedAuth = encodeCredentials(data.username, data.password);

    try {
      const response = await fetch(
        'http://maxgps.smartech-tn.com:9876/maximo/oslc/os/mxwo?lean=1&oslc.select=wonum,description,assetnum,location,status&oslc.pageSize=10',
        {
          method: 'POST',
          headers: {
            maxauth: encodedAuth,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const sessionCookie = response.headers.get('Set-Cookie'); // Récupérer le token/cookie de session

        Alert.alert('Connexion réussie', `Token: ${sessionCookie}`);

        // Stocker le token pour les futures requêtes (AsyncStorage, Redux, etc.)
      } else {
        Alert.alert('Erreur', 'Identifiants incorrects');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      Alert.alert('Erreur', 'Impossible de se connecter');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {/* Champ Nom d'utilisateur */}
      <Text style={styles.label}>Nom d'utilisateur</Text>
      <Controller
        control={control}
        name="username"
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="Entrez votre nom d'utilisateur"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
      />
      {errors.username && (
        <Text style={styles.error}>{errors.username.message}</Text>
      )}

      {/* Champ Mot de passe */}
      <Text style={styles.label}>Mot de passe</Text>
      <Controller
        control={control}
        name="password"
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="Entrez votre mot de passe"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      {/* Bouton Connexion */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
