import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  FlatList,
  Image,
} from "react-native";
import { collect, getTrashTypes } from "../features/trashCollection";
import InputSpinner from "react-native-input-spinner";

export default function TrashRegistrationSelection({
  onCancelled,
  onTrashCollected,
}) {
  const defaultTrash = getTrashTypes().reduce((trashValObj, type) => {
    trashValObj[type.id] = 0;
    return trashValObj;
  }, {});

  const [currentTrash, setCurrentTrash] = useState(defaultTrash);

  function updateAmount(type, amount) {
    setCurrentTrash((prevTrash) => ({
      ...prevTrash,
      [type]: amount,
    }));
  }

  async function onCollectPopup() {
    for (const type in currentTrash) {
      const amount = currentTrash[type];
      if (amount > 0) {
        await collect(type, amount);
      }
    }
    if (onTrashCollected) {
      await onTrashCollected();
    }
  }

  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalBox}>
        <View style={styles.listContainer}>
          <FlatList
            data={getTrashTypes()}
            keyExtractor={(a) => a.id}
            renderItem={({ item }) => (
              <TrashRow
                id={item.id}
                title={item.name}
                image={item.image}
                amount={item.amount}
                onTrashAmountChanged={(num) => updateAmount(item.id, num)}
              />
            )}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.cancelBtn}
            onPress={() => {
              if (onCancelled) {
                onCancelled();
              }
            }}
            testID={"cancel-btn"}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.collectBtn}
            onPress={onCollectPopup}
            testID={"collect-btn"}
          >
            <Text style={styles.collectBtnText}>Collect</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
}

//Creates a list where every trash types shows a row in the collect type modal view.
const TrashRow = ({ title, image, amount, onTrashAmountChanged }) => (
  <View style={styles.trashRow}>
    <Image source={image} style={styles.trashRowIcon} />
    <Text style={styles.trashRowTitle}>{title}</Text>
    <InputSpinner
      max={100}
      min={0}
      step={1}
      value={amount}
      onChange={onTrashAmountChanged}
      style={styles.trashCountInput}
    />
  </View>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: "90%",
    height: "70%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
    borderRadius: 20,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Android shadow
    elevation: 5,
  },
  listContainer: {
    flex: 1,
  },
  trashRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginVertical: 5,
  },
  trashRowIcon: {
    flexBasis: 50,
    aspectRatio: 1,
    resizeMode: "contain",
  },
  trashRowTitle: {
    flexBasis: 50,
    flexGrow: 4,
    marginHorizontal: 10,
  },
  trashCountInput: {
    flexBasis: 120,
    flexGrow: 1,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  cancelBtn: {
    flex: 1,
    marginRight: 15,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 20,
    elevation: 2,
  },
  cancelBtnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  collectBtn: {
    flex: 1,
    marginLeft: 15,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 20,
    elevation: 2,
  },
  collectBtnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
