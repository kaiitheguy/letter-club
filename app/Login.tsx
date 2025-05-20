import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../utils/supabase'; // 确保你有这个导入

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log('Login attempt with:', email);
    
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: '请输入邮箱和密码',
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Calling Supabase auth...');
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('Auth result:', result);

      if (result.error) throw result.error;
      
      console.log('Login successful, navigating...');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: '登录失败',
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: '请输入邮箱地址',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'yourapp://login-callback',
        },
      });

      if (error) throw error;
      
      Toast.show({
        type: 'success',
        text1: '登录链接已发送',
        text2: '请查看您的邮箱',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '发送失败',
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>欢迎回来</Text>
          <Text style={styles.subtitle}>请登录您的账号</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="邮箱地址"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            
            <TextInput
              style={styles.input}
              placeholder="密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity 
              style={styles.button}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>登录</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton}
              onPress={handleMagicLink}
              disabled={isLoading}
            >
              <Text style={styles.linkButtonText}>使用邮箱链接登录</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4e9', // 米白色背景
  },
  keyboardAvoid: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  form: {
    width: '100%',
    maxWidth: 320,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0ddd5',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6c7a89',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 8,
  },
  linkButtonText: {
    color: '#6c7a89',
    fontSize: 14,
  },
});
