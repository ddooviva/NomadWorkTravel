import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Button, Alert } from 'react-native';
import { theme } from './color';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
export default function App() {

  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});


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
    setToDos(JSON.parse(a));
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
        [Date.now()]: { text, working, done: false }
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

  const editToDo = () => {
    console.log("editmode");
  }
  const deleteAll = () => {
    AsyncStorage.removeItem("@toDos");
    loadToDos();
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
      <TouchableOpacity
        onPress={deleteAll}><Text style={{ fontSize: 30, color: "white" }}>전체지우기</Text></TouchableOpacity>

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
                <Text style={(!toDos[key].done) ? styles.toDoText : { ...styles.toDoText, textDecorationLine: "line-through" }}>{toDos[key].text}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={{ marginRight: 15 }} onPress={() => editToDo(key)}>
                  <AntDesign name="edit" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <AntDesign name="delete" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>)}
        </ScrollView >}
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
  }
});
