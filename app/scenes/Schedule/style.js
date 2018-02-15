import { StyleSheet } from "react-native";
import theme from "../../theme";

export default StyleSheet.create({
  navbar: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 2
  },
  spacer: {
    backgroundColor: "transparent",
    height: theme.navbar.height,
    zIndex: 1
  },
  link: {
    color: theme.color.blue,
    fontSize: theme.fontSize.default,
    fontWeight: "500",
    paddingVertical: theme.fontSize.large,
    marginBottom: 34 * 2,
    textAlign: "center"
  }
});
