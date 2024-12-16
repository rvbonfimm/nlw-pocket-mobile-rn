import { Alert, View, Text } from "react-native";
import { useEffect, useState } from "react"
import * as Location from "expo-location"
import MapView, { Marker, Callout } from "react-native-maps"

import { api } from '@/src/services/api'
import { Categories, CategoriesProps } from "./components/categories";
import { PlaceProps } from "./components/place";
import { Places } from "./components/places";
import { fontFamily } from "../styles/font-family";
import { colors } from "../styles/theme";
import { router } from "expo-router";

type MarketsProps = PlaceProps & {
    latitude: number
    longitude: number
}
const currentLocation = {
    latitude: -23.561187293883442,
    longitude: -46.656451388116494
}
export default function Home() {
    const [categories, setCategories] = useState<CategoriesProps>([])
    const [category, setCategory] = useState("")
    const [markets, setMarkets] = useState<MarketsProps[]>([])

    async function fetchCategories() {
        try {
            const { data } = await api.get("/categories")
            setCategories(data)
            setCategory(data[0].id)
        } catch (error) {
            console.error(error)
            Alert.alert("Categories", "Não foi possível carregar as categorias")
        }
    }

    async function fetchMarkets() {
        try {
            if (!category) {
                return
            }
            const { data } = await api.get("/markets/category/" + category)
            setMarkets(data)
        } catch (error) {
            Alert.alert("Locais", "Não foi possível carregar os locais")
        }
    }

    async function getCurrentLocation() {
        try {
            let { granted } = await Location.requestForegroundPermissionsAsync()
            if (granted) {
                let location = await Location.getCurrentPositionAsync({});
            }
        } catch (error) {
            console.error(error)
            Alert.alert("Location", "Erro ao buscar a localização do usuário")
        }
    }

    // Empty dependency list means it will be triggered once
    useEffect(() => {
        fetchCategories()
    }, [])

    // Markets depends on category to be selected previously
    useEffect(() => {
        fetchMarkets()
    }, [category])

    return (
        <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
            <Categories data={categories} onSelect={setCategory} selected={category}></Categories>

            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}>

                <Marker
                    identifier="current"
                    coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }}
                    image={require("@/src/assets/location.png")}
                />

                {
                    markets.map((item) => (
                        <Marker
                            key={item.id}
                            identifier={item.id}
                            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                            image={require("@/src/assets/pin.png")}
                        >
                            <Callout onPress={() => router.navigate(`/market/${item.id}`)}>
                                <View>
                                    <Text style={{ fontSize: 14, fontFamily: fontFamily.medium, color: colors.gray[600] }}>{item.name}</Text>
                                    <Text style={{ fontSize: 12, fontFamily: fontFamily.regular, color: colors.gray[600] }}>{item.address}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))
                }
            </MapView>
            <Places data={markets}></Places>
        </View>
    )
}