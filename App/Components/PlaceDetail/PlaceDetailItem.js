// import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from '../../Shared/Colors';
import GoogleMapView from '../Home/GoogleMapView';
import Share from '../../Services/Share';

export default function PlaceDetailItem({ place, onDirectionClick }) {
  return (
    <View>
      <Text style={{ fontSize: 26, fontFamily: 'raleway-bold' }}>
        {place.name}
      </Text>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 5,
          marginBottom: 10,
        }}
      >
        <AntDesign name="star" size={20} color={Colors.YELLOW} />
        <Text>{place.rating}</Text>
      </View>
      {place?.photos ? (
        <Image
          source={{
            uri:
              'https://maps.googleapis.com/maps/api/place/photo' +
              '?maxwidth=400' +
              '&photo_reference=' +
              place?.photos[0]?.photo_reference +
              '&key=AIzaSyCYpQVzzCbBwlvAht3Mh6UlIrD_lwGsu5U',
          }}
          style={{
            width: '100%',
            height: 160,
            borderRadius: 15,
            marginTop: 10,
          }}
        />
      ) : null}

      <Text style={{ fontSize: 16, marginTop: 10, color: Colors.DARK_GRAY }}>
        {place.vicinity ? place.vicinity : place.formatted_address}
      </Text>
      {place?.opening_hours ? (
        <Text style={{ fontFamily: 'raleway' }}>
          {place?.opening_hours?.open_now ? '(Open)' : '(Closed)'}
        </Text>
      ) : null}

      {/* Add Price */}
      {place.price_level != null ? (
        <Text style={{ fontFamily: 'raleway', marginTop: 10 }}>
          Price Level: {place.price_level}
        </Text>
      ) : null}

      {/* Add Reviews */}
      {place?.reviews && place?.reviews.length > 0 ? (
        <View>
          <Text style={{ fontFamily: 'raleway', marginTop: 10 }}>
            Reviews:
          </Text>
          {place.reviews.map((review, index) => (
            <View key={index}>
              <Text style={{ fontFamily: 'raleway', fontSize: 14 }}>
                Rating: {review.rating}
              </Text>
              <Text style={{ fontFamily: 'raleway', fontSize: 14 }}>
                Comment: {review.review}
              </Text>
              <Text style={{ fontFamily: 'raleway', fontSize: 14 }}>
                Comment: {review.price_level}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          display: 'flex',
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => onDirectionClick()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: Colors.GRAY,
            width: 110,
            padding: 3,
            borderRadius: 40,
            justifyContent: 'center',
          }}
        >
          <Ionicons name="navigate-circle-outline" size={24} color="black" />
          <Text style={{ fontFamily: 'raleway', fontSize: 16 }}>Direction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Share.SharePlace(place)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: Colors.GRAY,
            width: 90,
            padding: 3,
            borderRadius: 40,
            justifyContent: 'center',
          }}
        >
          <Ionicons name="md-share-outline" size={24} color="black" />
          <Text style={{ fontFamily: 'raleway', fontSize: 16 }}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
