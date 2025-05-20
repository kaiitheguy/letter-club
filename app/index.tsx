// app/index.tsx
import { Redirect } from 'expo-router';
import 'react-native-url-polyfill/auto';
import '../polyfills';

export default function Index() {
  return <Redirect href="/(tabs)" />;
}
