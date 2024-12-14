import { Alert, Text, View } from "react-native";
import { useEffect, useState } from "react"

import { api } from '@/src/services/api'
import { Categories, CategoriesProps } from "./components/categories";

export default function Home() {
    const [categories, setCategories] = useState<CategoriesProps>([])
    const [category, setCategory] = useState("")

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

    // Empty dependency list means it will be triggered once
    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <Categories data={categories} onSelect={setCategory} selected={category}></Categories>
        </View>
    )
}