import { View, Text } from 'react-native'
import React from 'react'
import Colors from '../../Shared/Colors'

export default function HorizontalLine() {
  return (
    <View>
       <View style={{borderWidth:0.9,
            marginTop:10,
            borderColor:Colors.BLACK}}></View>
    </View>
  )
}