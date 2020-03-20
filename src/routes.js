import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from '~/pages/Main';
import InfoBrazil from './pages/InfoBrazil';
import InfoCountries from './pages/InfoCountries';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      InfoBrazil,
      InfoCountries,
    },
    {
      defaultNavigationOptions: {
        headerBackTitle: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#4169E1',
        },
        headerTintColor: '#fff',
      },
    },
  ),
);

export default Routes;
