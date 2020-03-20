import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from '~/pages/Main';
import InfoBrazil from './pages/InfoBrazil';
import InfoWorld from './pages/infoWorld';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      InfoBrazil,
      InfoWorld,
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
