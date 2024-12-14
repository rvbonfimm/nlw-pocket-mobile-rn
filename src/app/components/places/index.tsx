import { useRef } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import Bottomsheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"

import { Place, PlaceProps } from "../place";
import { s } from "./styles";


type Props = {
    data: PlaceProps[]
}
export function Places({ data }: Props) {
    const dimensions = useWindowDimensions()
    const bottomSheetRef = useRef<Bottomsheet>(null)

    const snapPoints = { min: 278, max: dimensions.height - 128 }

    return (
        <Bottomsheet
            ref={bottomSheetRef}
            snapPoints={[snapPoints.min, snapPoints.max]}
            handleIndicatorStyle={s.indicator}
            backgroundStyle={s.container}
            enableOverDrag={false}
        >
            <BottomSheetFlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Place data={item}></Place>}
                contentContainerStyle={s.content}
                ListHeaderComponent={() => (
                    <Text style={s.title}>Explore locais perto de você</Text>
                )}
                showsVerticalScrollIndicator={false}
            >
            </BottomSheetFlatList>
        </Bottomsheet>
    )
}