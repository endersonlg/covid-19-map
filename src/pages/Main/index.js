import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
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
    brazilUF: [],
    countries: [],
    totalConfirmed: 0,
    totalDeaths: 0,
    totalRecovered: 0,
    lastUpdated: 0,
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
    const {
      areas,
      totalConfirmed,
      totalDeaths,
      totalRecovered,
      lastUpdated,
    } = responsecountries.data;

    var date = new Date(lastUpdated);

    const formattedDate = format(date, "dd  MMMM yyyy', às' H:mm'h'", {
      locale: pt,
    });

    this.setState({
      countries: areas,
      totalConfirmed,
      totalDeaths,
      totalRecovered,
      lastUpdated: formattedDate,
    });
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
      if (distance <= UF.cases * 10 + 100000) {
        navigation.navigate('InfoBrazil', { UF });
      }
    });

    countries.map(country => {
      const distance = getDistance(
        { latitude: coordinate.latitude, longitude: coordinate.longitude },
        { latitude: country.lat, longitude: country.long },
      );
      if (distance <= country.totalConfirmed * 10 + 100000) {
        navigation.navigate('InfoCountries', { country });
      }
    });
  };

  render() {
    const {
      brazilUF,
      countries,
      totalConfirmed,
      totalRecovered,
      totalDeaths,
      lastUpdated,
    } = this.state;

    return (
      <Container>
        <MapViewStyled onPress={event => this.handleNavigate(event)}>
          {brazilUF.map(UF => (
            <Circle
              key={UF.uid}
              center={UF.LatLng}
              radius={UF.cases !== 0 ? UF.cases * 10 + 100000 : 0}
              fillColor={transparentize(0.4, '#FF0000')}
            />
          ))}
          {countries.map(country => (
            <Circle
              key={country.id}
              center={{ latitude: country.lat, longitude: country.long }}
              radius={
                country.totalConfirmed !== 0
                  ? country.totalConfirmed * 10 + 100000
                  : 0
              }
              fillColor={transparentize(0.4, '#0000FF')}
            />
          ))}
        </MapViewStyled>
        <LegendForm>
          <LegendTitle>Legenda</LegendTitle>
          <Info>
            <LegendColor style={{ backgroundColor: '#0000FF' }} />
            <LegendText>Confirmados no País</LegendText>
          </Info>
          <Info>
            <LegendColor style={{ backgroundColor: '#FF0000' }} />
            <LegendText>Confirmados no Estado</LegendText>
          </Info>
          <Info>
            <LegendText>Total Confirmado:</LegendText>
            <LegendText>{totalConfirmed}</LegendText>
          </Info>
          <Info>
            <LegendText>Total Recuperados:</LegendText>
            <LegendText>{totalRecovered}</LegendText>
          </Info>
          <Info>
            <LegendText>Total Mortos:</LegendText>
            <LegendText>{totalDeaths}</LegendText>
          </Info>
          <Info>
            <LegendText>{lastUpdated}</LegendText>
          </Info>
        </LegendForm>
      </Container>
    );
  }
}
