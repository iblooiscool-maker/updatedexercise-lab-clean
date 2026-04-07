import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const exercisesData = [
  {
    id: '1',
    name: 'Pushups',
    type: 'repetition',
    suggested: 'Planks',
  },
  {
    id: '2',
    name: 'Running',
    type: 'duration',
    suggested: 'Swimming',
  },
  {
    id: '3',
    name: 'Planks',
    type: 'duration',
    suggested: 'Pushups',
  },
  {
    id: '4',
    name: 'Swimming',
    type: 'duration',
    suggested: 'Running',
  },
];

function Home({ navigation, route }) {
  const exercises = route.params?.exercises || exercisesData;

  const renderItem = ({ item }) => (
    <Button
      title={item.name}
      containerStyle={styles.buttonContainer}
      onPress={() => {
        if (item.type === 'repetition') {
          navigation.push('RepetitionExercise', {
            exercise: item,
            exercises: exercises,
          });
        } else {
          navigation.push('DurationExercise', {
            exercise: item,
            exercises: exercises,
          });
        }
      }}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercise Tracker</Text>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

function RepetitionExercise({ navigation, route }) {
  const { exercise, exercises } = route.params;
  const [count, setCount] = useState(0);

  const suggestedExercise = exercises.find(
    (item) => item.name === exercise.suggested
  );

  const goToSuggestedExercise = () => {
    if (!suggestedExercise) return;

    if (suggestedExercise.type === 'repetition') {
      navigation.push('RepetitionExercise', {
        exercise: suggestedExercise,
        exercises: exercises,
      });
    } else {
      navigation.push('DurationExercise', {
        exercise: suggestedExercise,
        exercises: exercises,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exercise.name}</Text>
      <Text style={styles.counterText}>Count: {count}</Text>

      <Button
        title="Increase Count"
        containerStyle={styles.buttonContainer}
        onPress={() => setCount(count + 1)}
      />

      <Button
        title="Reset"
        containerStyle={styles.buttonContainer}
        onPress={() => setCount(0)}
      />

      <Button
        title={`Suggested: ${exercise.suggested}`}
        containerStyle={styles.buttonContainer}
        onPress={goToSuggestedExercise}
      />

      <Button
        title="Home"
        containerStyle={styles.buttonContainer}
        onPress={() => navigation.navigate('Home', { exercises: exercises })}
      />
    </View>
  );
}

function DurationExercise({ navigation, route }) {
  const { exercise, exercises } = route.params;
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const suggestedExercise = exercises.find(
    (item) => item.name === exercise.suggested
  );

  const goToSuggestedExercise = () => {
    if (!suggestedExercise) return;

    if (suggestedExercise.type === 'repetition') {
      navigation.push('RepetitionExercise', {
        exercise: suggestedExercise,
        exercises: exercises,
      });
    } else {
      navigation.push('DurationExercise', {
        exercise: suggestedExercise,
        exercises: exercises,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exercise.name}</Text>
      <Text style={styles.counterText}>Time: {seconds} seconds</Text>

      <Button
        title={isRunning ? 'Pause Timer' : 'Start Timer'}
        containerStyle={styles.buttonContainer}
        onPress={() => setIsRunning(!isRunning)}
      />

      <Button
        title="Reset"
        containerStyle={styles.buttonContainer}
        onPress={() => {
          setIsRunning(false);
          setSeconds(0);
        }}
      />

      <Button
        title={`Suggested: ${exercise.suggested}`}
        containerStyle={styles.buttonContainer}
        onPress={goToSuggestedExercise}
      />

      <Button
        title="Home"
        containerStyle={styles.buttonContainer}
        onPress={() => navigation.navigate('Home', { exercises: exercises })}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          initialParams={{ exercises: exercisesData }}
        />
        <Stack.Screen
          name="RepetitionExercise"
          component={RepetitionExercise}
        />
        <Stack.Screen
          name="DurationExercise"
          component={DurationExercise}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  counterText: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 8,
  },
});