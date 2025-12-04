import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import { AuthProvider, useAuth } from "./auth/AuthContext";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import Welcome from "./pages/Welcome";
import {
  calendarOutline,
  homeOutline,
  personOutline,
  settingsOutline,
} from "ionicons/icons";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";

setupIonicReact();

const PrivateRoute: React.FC<{
  path: string;
  component: React.FC;
  exact?: boolean;
}> = ({ component: Comp, ...rest }) => {
  const { user, loading } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        loading ? null : user ? <Comp {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const AppInner: React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/welcome" exact component={Welcome} />
          <PrivateRoute path="/home" exact component={Home} />
          <PrivateRoute path="/tasks" exact component={Tasks} />
          <PrivateRoute path="/settings" exact component={Settings} />
          <PrivateRoute path="/Profile" exact component={Profile} />
          <PrivateRoute
            path="/change-password"
            exact
            component={ChangePassword}
          />
          <Route exact path="/">
            <Redirect to="/welcome" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/welcome">
            <IonIcon icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="calendar" href="/tasks">
            <IonIcon icon={calendarOutline} />
            <IonLabel>Tasks</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile">
            <IonIcon icon={personOutline} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={settingsOutline} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  </IonApp>
);

export default App;
