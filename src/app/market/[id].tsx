import { useEffect, useState } from "react";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { Alert, Modal, View, StatusBar, ScrollView } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera"

import Loading from "../components/loading";
import { api } from "@/src/services/api";
import Cover from "../components/market/cover";
import { Details, DetailsProps } from "../components/market/details/index"
import { Coupon } from "../components/market/coupon";
import { Button } from "../components/button";

type Data = DetailsProps & {
    cover: string
}
export default function Market() {
    const params = useLocalSearchParams<{ id: string }>()
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<Data>()
    const [coupon, setCoupon] = useState<string | null>(null)
    const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false)
    const [isCouponFetching, setIsCouponFetching] = useState(false)

    const [, requestPermission] = useCameraPermissions()
    const qrLock = { current: false }

    async function fetchMarket() {
        try {
            const { data } = await api.get(`/markets/${params.id}`)
            setIsLoading(false)
            setData(data)
        } catch (error) {
            console.error(error)
            Alert.alert("Market", "Não foi possível pegar os dados", [
                {
                    text: "OK",
                    onPress: () => router.back()
                }
            ])
        }
    }

    async function handleOpenCamera() {
        try {
            const { granted } = await requestPermission()
            if (!granted) {
                return Alert.alert("Câmera", "Você precisa habilitar a câmera para escanear os cupons.")
            }
            setIsVisibleCameraModal(true)
            qrLock.current = false
        } catch (error) {
            console.error(error)
            Alert.alert("Câmera", "Problemas ao abrir a câmera")
        }
    }

    async function getCoupon(id: string) {
        try {
            setIsCouponFetching(true)

            const { data } = await api.patch(`/coupons/${id}`)

            Alert.alert("Cupom", data.coupon)
            setCoupon(data.coupon)
        } catch (error) {
            console.error(error)
            Alert.alert("Cupom", "Problemas ao carregar o cupom")
        } finally {
            setIsCouponFetching(false)
        }
    }

    function handleUseCoupon(id: string) {
        setIsVisibleCameraModal(false)
        Alert.alert(
            "Cupom",
            "Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar este cupom?",
            [
                { style: "cancel", text: "Não" },
                { text: "Sim", onPress: () => getCoupon(id) }
            ]
        )
    }

    useEffect(() => {
        fetchMarket()
    }, [params.id, coupon])

    if (isLoading) {
        return <Loading />
    }

    if (!data) {
        return <Redirect href="/home"></Redirect>
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <Cover uri={data.cover}></Cover>
                <Details data={data}></Details>
                {coupon && <Coupon code={coupon} />}
            </ScrollView>

            <View style={{ padding: 32 }}>
                <Button onPress={() => handleOpenCamera()}>
                    <Button.Title>Ler QR Code</Button.Title>
                </Button>
            </View>

            <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
                <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    onBarcodeScanned={({ data: couponData }) => {
                        if (data && !qrLock.current) {
                            qrLock.current = true
                            setTimeout(() => handleUseCoupon(couponData), 500)
                        }
                    }}
                />

                <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
                    {/* <Text>Modal test</Text> */}
                    <Button onPress={() => setIsVisibleCameraModal(false)} isLoading={isCouponFetching}>
                        <Button.Title>Voltar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}