import React, { Component } from 'react';

import { View } from 'react-native';
import { object } from 'prop-types';

import { Container, TextTitle, TextSubTitle, Form } from './styles';

export default class InfoBrazil extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('UF').state,
  });
  state = {
    UF: [],
  };
  componentDidMount() {
    const { navigation } = this.props;
    const UF = navigation.getParam('UF');
    this.setState({ UF });
  }

  render() {
    const { UF } = this.state;
    return (
      <Container>
        <TextTitle>Informações</TextTitle>
        <TextSubTitle>Suspeitos: {UF.suspects} </TextSubTitle>
        <TextSubTitle>Casos: {UF.cases}</TextSubTitle>
        <TextSubTitle>Mortes: {UF.deaths}</TextSubTitle>
      </Container>
    );
  }
}
