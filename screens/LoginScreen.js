import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import AlertPopup from "../components/AlertPopup";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Sila lengkapkan nama, e-mel dan kata laluan.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Masukkan alamat e-mel yang sah.");
      return;
    }

    if (password.trim().length < 6) {
      setErrorMessage("Kata laluan mestilah sekurang-kurangnya 6 aksara.");
      return;
    }

    setErrorMessage("");
    login({ name, email });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.logoMark}>
              <Image
                source={require("../assets/icons/logo-bento.svg")}
                style={styles.localImage}
                contentFit="contain"
                accessibilityLabel="Logo BentoX Amirul"
              />
            </View>
            <Text style={styles.brand}>BENTOX AMIRUL</Text>
            <Text style={styles.title}>Selamat datang</Text>
            <Text style={styles.description}>
              Log masuk untuk melihat menu dan profil anda.
            </Text>

            <Text style={styles.label}>Nama penuh</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Ahmad bin Ali"
              placeholderTextColor="#A39A92"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              accessibilityLabel="Nama penuh"
            />

            <Text style={styles.label}>E-mel</Text>
            <TextInput
              style={styles.input}
              placeholder="nama@email.com"
              placeholderTextColor="#A39A92"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              accessibilityLabel="E-mel"
            />

            <Text style={styles.label}>Kata laluan</Text>
            <TextInput
              style={styles.input}
              placeholder="Sekurang-kurangnya 6 aksara"
              placeholderTextColor="#A39A92"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              accessibilityLabel="Kata laluan"
              onSubmitEditing={handleLogin}
              returnKeyType="done"
            />

            <Pressable
              onPress={handleLogin}
              accessibilityRole="button"
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Log masuk</Text>
            </Pressable>

            <Text style={styles.demoNote}>
              Akaun demo: profil menggunakan nama dan e-mel yang dimasukkan.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AlertPopup
        visible={Boolean(errorMessage)}
        title="Tidak dapat log masuk"
        message={errorMessage}
        variant="error"
        onPrimaryPress={() => setErrorMessage("")}
        onDismiss={() => setErrorMessage("")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBF8F4",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: "#F0EAE4",
    elevation: 3,
  },
  logoMark: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#FFF0EC",
    marginBottom: 18,
  },
  localImage: {
    width: 60,
    height: 60,
  },
  brand: {
    color: "#E05A47",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    color: "#292522",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6,
  },
  description: {
    color: "#817B75",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 24,
  },
  label: {
    color: "#48413B",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },
  input: {
    minHeight: 48,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#EAE2DA",
    backgroundColor: "#FFFEFC",
    paddingHorizontal: 13,
    color: "#292522",
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E05A47",
    borderRadius: 13,
    marginTop: 4,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  demoNote: {
    color: "#948B83",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 16,
  },
});
