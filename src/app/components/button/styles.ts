
import { StyleSheet } from "react-native"

import { colors, fontFamily } from "@/src/styles/theme"

export const s = StyleSheet.create({
    container: {
        height: 56,
        maxHeight: 56,
        gap: 14,
        backgroundColor: colors.green.base,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    title: {
        fontSize: 18,
        fontFamily: fontFamily.semiBold,
        color: colors.gray[100]
    }
})