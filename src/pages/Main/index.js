import React, { Component } from 'react';
import { Circle } from 'react-native-maps';
import { apiBrazil, apiWorld } from '../../services/api';
import LatLonUfs from '../../util/json/coordenadasUF';
import { getDistance } from 'geolib';
import { darken, lighten, opacify, transparentize } from 'polished';

import { Container, MapViewStyled } from './styles';

export default class Main extends Component {
  static navigationOptions = {
    title: 'COVID-19 BRASIL',
  };

  state = {
    date: '',
    time: '',
    brazilUF: [],
    mediaBrazil: 0,
    world: [],
    mediaWorld: 0,
  };

  async componentDidMount() {
    const responseBrazil = await apiBrazil.get();
    const { values } = responseBrazil.data;
    const brazilUF = values.map(UF => ({
      ...UF,
      LatLng: {
        latitude:
          LatLonUfs[
          UF.state.substring(UF.state.length - 3, UF.state.length - 1)
          ][0],
        longitude:
          LatLonUfs[
          UF.state.substring(UF.state.length - 3, UF.state.length - 1)
          ][1],
      },
    }));
    this.setState({ brazilUF });

    var mediaBrazil = 0;
    brazilUF.map(UF => {
      mediaBrazil += UF.suspects;
    });
    mediaBrazil /= brazilUF.length;
    this.setState({ mediaBrazil });

    const responseWorld = await apiWorld.get();
    const { areas } = responseWorld.data;
    this.setState({ world: areas });

    var mediaWorld = 0;
    areas.map(country => {
      mediaWorld += country.totalDeaths;
    });
  }

  handleNavigate = event => {
    const { navigation } = this.props;

    const { brazilUF, world } = this.state;

    const coordinate = event.nativeEvent.coordinate;
    brazilUF.map(UF => {
      const distance = getDistance(
        { latitude: coordinate.latitude, longitude: coordinate.longitude },
        { latitude: UF.LatLng.latitude, longitude: UF.LatLng.longitude },
      );
      if (distance <= UF.suspects * 20 + 100000) {
        navigation.navigate('InfoBrazil', { UF });
      }
    });

    world.map(country => {
      const distance = getDistance(
        { latitude: coordinate.latitude, longitude: coordinate.longitude },
        { latitude: country.lat, longitude: country.long },
      );
      if (distance <= country.totalDeaths * 70 + 100000) {
        navigation.navigate('InfoWorld', { country });
      }
    });
  };

  render() {
    const { brazilUF, mediaBrazil, world, mediaWorld } = this.state;
    const LatLng = {
      latitude: -22.2271,
      longitude: -45.9394,
    };
    return (
      <Container>
        <MapViewStyled onPress={event => this.handleNavigate(event)}>
          {brazilUF.map(UF => (
            <Circle
              key={UF.uid}
              center={UF.LatLng}
              radius={UF.suspects * 20 + 100000}
              fillColor={transparentize(0.4, '#FF0000')}
            />
          ))}
          {world.map(country => (
            <Circle
              key={country.id}
              center={{ latitude: country.lat, longitude: country.long }}
              radius={country.totalDeaths * 70 + 100000}
              fillColor={transparentize(0.4, '#0000FF')}
            />
          ))}
        </MapViewStyled>
      </Container>
    );
  }
}
