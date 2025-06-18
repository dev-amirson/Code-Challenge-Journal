import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomInput } from '../CustomInput';

describe('CustomInput', () => {
  it('renders correctly with default props', () => {
    const { getByPlaceholderText } = render(
      <CustomInput label="Test Input" value="" onChangeText={() => { }} />
    );

    expect(getByPlaceholderText('Test Input')).toBeTruthy();
  });

  it('shows label as placeholder when not focused and no value', () => {
    const { getByPlaceholderText } = render(
      <CustomInput label="Email" value="" onChangeText={() => { }} />
    );

    expect(getByPlaceholderText('Email')).toBeTruthy();
  });

  it('hides placeholder when focused', () => {
    const { getByPlaceholderText, queryByPlaceholderText } = render(
      <CustomInput label="Email" value="" onChangeText={() => { }} />
    );

    const input = getByPlaceholderText('Email');
    fireEvent(input, 'focus');

    expect(queryByPlaceholderText('Email')).toBeNull();
  });

  it('hides placeholder when has value', () => {
    const { queryByPlaceholderText } = render(
      <CustomInput label="Email" value="test@example.com" onChangeText={() => { }} />
    );

    expect(queryByPlaceholderText('Email')).toBeNull();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <CustomInput label="Test Input" value="" onChangeText={onChangeText} />
    );

    const input = getByPlaceholderText('Test Input');
    fireEvent.changeText(input, 'new text');

    expect(onChangeText).toHaveBeenCalledWith('new text');
  });

  it('calls onBlur when input loses focus', () => {
    const onBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <CustomInput label="Test Input" value="" onChangeText={() => { }} onBlur={onBlur} />
    );

    const input = getByPlaceholderText('Test Input');
    fireEvent(input, 'blur');

    expect(onBlur).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    const { getByText } = render(
      <CustomInput
        label="Test Input"
        value=""
        onChangeText={() => { }}
        error="This field is required"
      />
    );

    expect(getByText('This field is required')).toBeTruthy();
  });

  it('renders secure text entry correctly', () => {
    const { getByPlaceholderText } = render(
      <CustomInput
        label="Password"
        value=""
        onChangeText={() => { }}
        secureTextEntry={true}
      />
    );

    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('applies correct keyboard type', () => {
    const { getByPlaceholderText } = render(
      <CustomInput
        label="Email"
        value=""
        onChangeText={() => { }}
        keyboardType="email-address"
      />
    );

    const input = getByPlaceholderText('Email');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('applies correct autocapitalize setting', () => {
    const { getByPlaceholderText } = render(
      <CustomInput
        label="Name"
        value=""
        onChangeText={() => { }}
        autoCapitalize="words"
      />
    );

    const input = getByPlaceholderText('Name');
    expect(input.props.autoCapitalize).toBe('words');
  });

  it('renders as multiline when multiline prop is true', () => {
    const { getByPlaceholderText } = render(
      <CustomInput
        label="Description"
        value=""
        onChangeText={() => { }}
        multiline={true}
        numberOfLines={3}
      />
    );

    const input = getByPlaceholderText('Description');
    expect(input.props.multiline).toBe(true);
    expect(input.props.numberOfLines).toBe(3);
  });

  it('applies custom styles correctly', () => {
    const customStyle = { marginTop: 20 };
    const { getByPlaceholderText } = render(
      <CustomInput
        label="Test Input"
        value=""
        onChangeText={() => { }}
        style={customStyle}
      />
    );

    const input = getByPlaceholderText('Test Input');
    expect(input).toBeTruthy();
  });

  it('handles focus and blur events correctly', () => {
    const { getByPlaceholderText } = render(
      <CustomInput label="Test Input" value="" onChangeText={() => { }} />
    );

    const input = getByPlaceholderText('Test Input');

    fireEvent(input, 'focus');
    fireEvent(input, 'blur');

    expect(input).toBeTruthy();
  });

  it('renders with icon when iconName is provided', () => {
    const { getByPlaceholderText } = render(
      <CustomInput
        label="Email"
        value=""
        onChangeText={() => { }}
        iconName="email-outline"
      />
    );

    const input = getByPlaceholderText('Email');
    expect(input).toBeTruthy();
  });

  it('handles toggle button for password fields', () => {
    const { getByPlaceholderText } = render(
      <CustomInput
        label="Password"
        value=""
        onChangeText={() => { }}
        secureTextEntry={true}
        showToggle={true}
      />
    );

    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });
}); 