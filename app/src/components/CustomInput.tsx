import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, IconButton, Icon, Text } from 'react-native-paper';

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'number-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search'
    | 'visible-password';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  iconName?: string;
  showToggle?: boolean;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
}

export const CustomInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  iconName,
  showToggle = false,
  style,
  multiline = false,
  numberOfLines,
}: CustomInputProps) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  const hasError = !!error;

  return (
    <View
      style={[
        styles.inputContainer,
        focused && styles.inputContainerFocused,
        style,
      ]}
    >
      <View
        style={[
          styles.inputContent,
          focused && styles.inputContentFocused,
          hasError && styles.inputContentError,
          multiline && {
            alignItems: 'flex-start',
            paddingVertical: 6,
            minHeight: numberOfLines ? numberOfLines * 20 + 16 : 'auto',
          },
        ]}
      >
        {iconName && (
          <View style={styles.iconContainer}>
            <Icon
              source={iconName}
              size={22}
              color={hasError ? '#ef4444' : focused ? '#667eea' : '#9ca3af'}
            />
          </View>
        )}
        <TextInput
          placeholder={!focused && !value ? label : ''}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholderTextColor='#6b7280'
          underlineColor='transparent'
          activeUnderlineColor='transparent'
          mode='flat'
          dense={true}
          style={[
            styles.customInput,
            focused && styles.customInputFocused,
            !multiline && styles.singleLineInput,
          ]}
          theme={{
            colors: {
              primary: hasError ? '#ef4444' : '#667eea',
              text: '#ffffff',
              placeholder: '#6b7280',
              onSurfaceVariant: '#6b7280',
              outline: 'transparent',
              onSurface: '#ffffff',
              background: 'transparent',
              surfaceVariant: 'transparent',
              onSurfaceDisabled: 'transparent',
            },
          }}
          contentStyle={[
            styles.inputText,
            !value && !multiline && styles.inputTextCentered,
          ]}
        />
        {showToggle && (
          <IconButton
            icon={showPassword ? 'eye-off' : 'eye'}
            size={20}
            iconColor={hasError ? '#ef4444' : focused ? '#667eea' : '#9ca3af'}
            style={styles.toggleIcon}
            onPress={() => setShowPassword(!showPassword)}
          />
        )}
      </View>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputContainerFocused: {
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    transform: [{ scale: 1.02 }],
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  inputContentFocused: {
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderColor: '#667eea',
    borderWidth: 2,
  },
  inputContentError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  iconContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    paddingVertical: 0,
    marginVertical: 0,
  },
  customInputFocused: {
    backgroundColor: 'transparent',
  },
  inputText: {
    color: '#ffffff',
    fontSize: 16,
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  inputTextCentered: {
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  toggleIcon: {
    margin: 0,
  },
  singleLineInput: {
    height: 48,
    justifyContent: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});
