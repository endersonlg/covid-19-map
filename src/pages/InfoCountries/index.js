import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Container, TextTitle, TextSubTitle, Form } from './styles';

export default class InfoCountries extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('country').displayName,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    country: [],
  };

  componentDidMount() {
    const { navigation } = this.props;
    const country = navigation.getParam('country');
    this.setState({ country });
  }

  render() {
    const { country } = this.state;
    return (
      <Container>
        <TextTitle>Informações</TextTitle>
        <TextSubTitle>Casos: {country.totalConfirmed}</TextSubTitle>
        <TextSubTitle>Recuperados: {country.totalRecovered} </TextSubTitle>
        <TextSubTitle>Mortes: {country.totalDeaths}</TextSubTitle>
      </Container>
    );
  }
}
