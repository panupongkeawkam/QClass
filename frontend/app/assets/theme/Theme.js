import { StyleSheet, Dimensions } from "react-native";

const color = {
  primary: "#3bc8ed",
  secondary: "#ffb630",
  correct: "#37de90",
  wrong: "#de3758",
  base1: "#ffffff",
  base2: "#f9f9f9",
  base3: "#D3D3D3",
  base4: "#808080",
  content1: "#111",
  content2: "#333",
  content3: "#444",
  content4: "#555",
  blackTransparent: "#00000088",
};

// const color = {
//   primary: "#3bc8ed",
//   correct: "#5cbc7c",
//   wrong: "red",
//   content1: "#ffffff",
//   content2: "#f9f9f9",
//   content3: "#D3D3D3",
//   content4: "#808080",
//   base1: "#555",
//   base2: "#444",
//   base3: "#333",
//   base4: "#111",
//   blackTransparent: "#00000088",
// };

const theme = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 24,
    backgroundColor: color.base2,
  },
  boxContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 16,
  },
  boxOuter: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: "50%",
    height: 164,
  },
  boxInner: {
    borderRadius: 24,
    padding: 16,
    flex: 1,
  },
  rounded: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  boxHollow: {
    borderStyle: "dashed",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: color.base3,
  },
  textLabel: {
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 8,
    color: color.content4,
    marginBottom: 4,
  },
  textHeader1: {
    fontSize: 40,
    fontWeight: "800",
    color: color.content2,
    marginBottom: 8,
  },
  textHeader2: {
    fontSize: 24,
    fontWeight: "700",
    color: color.content3,
    marginBottom: 8,
  },
  solidShadow: {
    shadowColor: color.content1,
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0.5,
    elevation: 0.5,
  },
  blurShadow: {
    shadowColor: color.content1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 0.1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    backgroundColor: color.primary,
  },
  textBtn: {
    fontSize: 20,
    fontWeight: "800",
    color: color.base1,
  },
  textInput: {
    borderColor: color.base3,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: color.base2,
    width: "100%",
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    fontSize: 20,
    color: color.content2,
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
    paddingHorizontal: 12,
    paddingBottom: 28,
  },
  tabBar: {
    height: 88,
    paddingTop: 16,
    borderRadius: 32,
    backgroundColor: color.base1,
    borderTopWidth: 0,
    shadowColor: color.content1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.075,
    shadowRadius: 10,
    elevation: 0.075,
  },
  bottomTab: {
    height: 88,
    paddingTop: 16,
    borderRadius: 32,
    margin: 12,
    marginBottom: 28,
    backgroundColor: color.base1,
    position: "absolute",
    borderTopWidth: 0,
    shadowColor: color.content1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.075,
    shadowRadius: 10,
    elevation: 0.075,
  },
  chatBox: {
    justifyContent: "flex-start",
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginVertical: 8,
    borderTopLeftRadius: 8,
    alignItems: "flex-start",
    backgroundColor: color.base1,
    maxWidth: "80%",
  },
});

const modalTheme = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.blackTransparent,
  },
  modalView: {
    margin: 20,
    backgroundColor: color.base1,
    borderRadius: 20,
    padding: 25,
    width: "80%",
    shadowColor: color.content1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  iconInput: {
    borderColor: color.base3,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: color.base2,
    width: "100%",
    padding: 16,
    marginVertical: 8,
  },
  iconRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    justifyContent: "space-between",
    justifyContent: "space-between",
    marginVertical: 8,
  },
});

export { theme, modalTheme, color };
