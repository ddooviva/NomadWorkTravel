import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Button, Alert, Modal } from 'react-native';
import { theme } from './color';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function App() {

  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});
  const [editMode, setEditMode] = useState(false);

  const saveWorking = async (working) => {
    await AsyncStorage.setItem("@working", JSON.stringify(working));
  }

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem("@toDos", JSON.stringify(toSave));
  }

  const loadWorking = async () => {
    const b = await AsyncStorage.getItem("@working");
    (b === null) ? setWorking(true) : setWorking(JSON.parse(b));
  }

  const loadToDos = async () => {
    const a = await AsyncStorage.getItem("@toDos")
    if (a) { setToDos(JSON.parse(a)); } { setToDos({}) }
  }

  useEffect(() => {
    loadToDos();
    loadWorking();
  }, [])


  const addToDo = async () => {
    if (text === "") { return }
    else {
      const newToDos = {
        ...toDos,
        [Date.now()]: { text, working, done: false, edit: false }
      }
      setToDos(newToDos);
      await saveToDos(newToDos);
      setText("");
    }
  }
  const serveText = (text) => {
    setText(text);
  }
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      {
        text: 'Cancel', style: 'cancel',
      },
      {
        text: 'OK', onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        }
      },
    ]);

  }

  const editTrue = async (key) => {
    console.log("this key is on editmode");
    const newToDos = {
      ...toDos
    };
    newToDos[key].edit = true;
    console.log(newToDos[key]);
    setEditMode(true);
  }
  const editTextSave = async (event, key) => {
    const value = event.nativeEvent.text
    console.log(value, key);
    const newToDos = {
      ...toDos
    };
    newToDos[key].text = value;
    newToDos[key].edit = false;
    setToDos(newToDos);
    await saveToDos(newToDos);
    console.log("complete editing")
    setEditMode(false);
  }

  const deleteAll = () => {
    Alert.alert("Delete All List", "Are you sure to delete all of your ToDos?", [{
      text: 'Cancel', style: 'cancel',
    }, {
      text: 'Ok', style: "destructive", onPress: () => {
        AsyncStorage.removeItem("@toDos");
        loadToDos();
      }
    }
    ])

  }

  const toggleDone = async (key) => {
    const newToDos = {
      ...toDos
    };
    newToDos[key].done = !newToDos[key].done
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  }
  console.log(text)
  console.log(72, toDos)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text
            onPress={() => { setWorking(true); saveWorking(true) }}
            style={{ color: working ? "white" : theme.grey, ...styles.btnText }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            onPress={() => { setWorking(false); saveWorking(false) }}
            style={{ color: working ? theme.grey : "white", ...styles.btnText }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput style={styles.input} onSubmitEditing={addToDo} onChangeText={serveText}
        placeholder={working ? "Wite your To Do" : "Where do you want to travel?"}
        value={text}>
      </TextInput>




      {(toDos === null) ? <Text></Text> :
        < ScrollView showsVerticalScrollIndicator={false}>
          {Object.keys(toDos).map((key) => (working !== toDos[key].working) ? null :
            < View style={styles.toDoList} key={key} >
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <TouchableOpacity onPress={() => toggleDone(key)}><Fontisto name={(toDos[key].done ? "checkbox-active" : "checkbox-passive")} size={18} color="white" /></TouchableOpacity>
                {!toDos[key].edit ? (
                  <Text style={(!toDos[key].done) ? styles.toDoText : { ...styles.toDoText, textDecorationLine: "line-through" }}>
                    {toDos[key].text}
                  </Text>
                ) : (
                  <TextInput autoFocus style={styles.toDoText} defaultValue={toDos[key].text}
                    onEndEditing={event => editTextSave(event, key)} />
                )}
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={{ marginRight: 15 }} onPress={() => editTrue(key)}>
                  <AntDesign name="edit" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <AntDesign name="delete" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>)}

        </ScrollView >}
      <View style={styles.deleteAll}>
        <TouchableOpacity onPress={deleteAll}>
          <MaterialIcons
            name="lock-reset"
            size={40}
            color={toDos && Object.keys(toDos).length !== 0 ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />

    </View >
  )

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
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  toDoText: {
    marginLeft: 10,
    color: "white",
    fontSize: 16,
    fontWeight: 500,
  }, deleteAll:
  {
    position: "absolute",
    top: "90%",
    left: "10%"
  }
});
