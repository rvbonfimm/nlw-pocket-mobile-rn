import { Alert, View } from "react-native";
import { useEffect, useState } from "react"

import { api } from '@/src/services/api'
import { Categories, CategoriesProps } from "./components/categories";
import { PlaceProps } from "./components/place";
import { Places } from "./components/places";

type MarketsProps = PlaceProps
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

            <Places data={markets}></Places>
        </View>
    )
}