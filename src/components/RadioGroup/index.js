import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RadioGroup = ({ options, selectedValue, onValueChange }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.option}
          onPress={() => onValueChange(option.value)}>
          <View style={styles.radio}>
            {selectedValue === option.value && <View style={styles.selected} />}
          </View>
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A855F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#A855F7',
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
});

export default RadioGroup; 