import { colors } from "@/src/styles/theme";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
    container: {
        width: "100%",
        height: 232,
        marginBottom: -32,
        backgroundColor: colors.gray[200]
    },
    header: {
        padding: 24,
        paddingTop: 56
    },
    button: {
        width: 40,
        height: 40,
        backgroundColor: colors.green.base,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8
    }
})