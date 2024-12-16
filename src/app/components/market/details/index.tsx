import { View, Text } from "react-native";
import { IconPhone, IconMapPin, IconTicket } from "@tabler/icons-react-native";

import { s } from './styles'
import { Info } from "../info";

export type DetailsProps = {
    name: string
    description: string
    address: string
    phone: string
    coupons: number
    rules: {
        id: string
        description: string
    }[]
}

type Props = {
    data: DetailsProps
}

export function Details({ data }: Props) {
    return (
        <View style={s.container}>
            <Text style={s.name}>{data.name}</Text>
            <Text style={s.description}>{data.description}</Text>

            <View style={s.group}>
                <Text style={s.title}>Informações</Text>

                <Info icon={IconTicket} description={`${data.coupons} cupons disponíveis`}></Info>
                <Info icon={IconMapPin} description={data.address}></Info>
                <Info icon={IconPhone} description={data.phone}></Info>
            </View>

            <View style={s.group}>
                <Text style={s.title}>Regulamento</Text>
                {
                    data.rules.map((item) => (
                        <Text key={item.id} style={s.rule}>
                            {`\u2022 ${item.description}`}
                        </Text>
                    ))
                }
            </View>
        </View>
    )
}