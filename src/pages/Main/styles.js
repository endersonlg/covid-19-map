import styled from 'styled-components/native';
import MapView from 'react-native-maps';

export const Container = styled.View`
  flex: 1;
`;

export const MapViewStyled = styled(MapView)`
  width: 100%;
  height: 100%;
`;
export const LegendForm = styled.View`
  width: 180px;
  height: auto;
  background: #fff;
  position: absolute;
  align-self: flex-end;
  border: 1px;
  border-radius: 4px;
  padding: 10px;
`;
export const Info = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
export const LegendTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  align-self: center;
  margin-bottom: 10px;
`;
export const LegendText = styled.Text`
  font-size: 12px;
  width: auto;
`;
export const LegendColor = styled.View`
  width: 12px;
  height: 12px;
  border: 1px;
  border-radius: 6px;
`;
