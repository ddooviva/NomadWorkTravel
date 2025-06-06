import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { theme } from './color';
import { useState } from 'react';

export default function App() {

  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const addToDo = () => {
    if (text === "") {
      return;
    }
    setText("")
/*     const newToDos = Object.assign({}, toDos, { [Date.now()]: { text, work: working } });
 */ const newToDos = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDos);
  }

  console.log(toDos);



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => work()}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => travel()}>
          <Text style={{ ...styles.btnText, color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity>

      </View>
      <StatusBar style="auto" />
      <TextInput
        onSubmitEditing={addToDo}
        value={text}
        autoCorrect={false}
        onChangeText={onChangeText}
        returnKeyType='done'
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input} />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? <View style={styles.toDoList}>
            <Text style={styles.toDoText}>{toDos[key].text}
            </Text>
          </View> : null
        )}
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 60,
  },
  btnText: {
    fontSize: 44,
    fontWeight: 600,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  }, toDoList: {
    backgroundColor: theme.grey,
  },
  toDoList: {
    backgroundColor: theme.grey,
    padding: 20,
    marginVertical: 10,
    borderRadius: 15
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: 500,
  }
});
