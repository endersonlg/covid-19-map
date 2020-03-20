import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Circle } from 'react-native-maps';
import { apiBrazil, apiCountries } from '../../services/api';
import LatLonUfs from '../../util/json/coordenadasUF';
import { getDistance } from 'geolib';
import { transparentize } from 'polished';
import {
  Container,
  MapViewStyled,
  LegendForm,
  LegendText,
  LegendTitle,
  LegendColor,
  Info,
} from './styles';

export default class Main extends Component {
  static navigationOptions = {
    title: 'COVID-19 MAP',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    date: '',
    time: '',
    brazilUF: [],
    countries: [],
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

    const responsecountries = await apiCountries.get();
    const { areas } = responsecountries.data;
    this.setState({ countries: areas });
  }

  handleNavigate = event => {
    const { navigation } = this.props;

    const { brazilUF, countries } = this.state;

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

    countries.map(country => {
      const distance = getDistance(
        { latitude: coordinate.latitude, longitude: coordinate.longitude },
        { latitude: country.lat, longitude: country.long },
      );
      if (distance <= country.totalDeaths * 70 + 100000) {
        navigation.navigate('InfoCountries', { country });
      }
    });
  };

  render() {
    const { brazilUF, countries } = this.state;
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
          {countries.map(country => (
            <Circle
              key={country.id}
              center={{ latitude: country.lat, longitude: country.long }}
              radius={country.totalDeaths * 70 + 100000}
              fillColor={transparentize(0.4, '#0000FF')}
            />
          ))}
        </MapViewStyled>
        <LegendForm>
          <LegendTitle>Legenda</LegendTitle>
          <Info>
            <LegendColor style={{ backgroundColor: '#0000FF' }} />
            <LegendText>País</LegendText>
          </Info>
          <Info>
            <LegendColor style={{ backgroundColor: '#FF0000' }} />
            <LegendText>Estado</LegendText>
          </Info>
        </LegendForm>
      </Container>
    );
  }
}
