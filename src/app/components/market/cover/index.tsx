import { ImageBackground, View } from "react-native";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { router } from "expo-router";

import { Button } from "../../button";
import { s } from "./styles"
import { colors } from "@/src/styles/theme";

type Props = {
    uri: string
}
export default function Cover({ uri }: Props) {
    return (
        <ImageBackground source={{ uri }} style={s.container}>
            <View style={s.header}>
                <Button style={s.button} onPress={() => router.back()}>
                    <Button.Icon icon={IconArrowLeft}></Button.Icon>
                </Button>
            </View>
        </ImageBackground>
    )
}