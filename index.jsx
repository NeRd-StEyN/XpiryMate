import 'react-native-reanimated'; // 🔴 This must be at the very top

import { AppRegistry, Platform } from 'react-native';
import { App } from './Losin';
import { name as appName } from './app.json';
import React from 'react';
import { Route } from './Route';

AppRegistry.registerComponent(appName, () => Route);
