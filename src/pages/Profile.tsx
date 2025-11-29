import React from "react";
import {
    IonButton, IonButtons, IonCard, IonCardContent,
    IonCol,
    IonContent,
    IonFooter,
    IonGrid,
    IonHeader,
    IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, IonTabBar, IonTabButton, IonThumbnail,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { chevronBackOutline, cameraReverseOutline, bookOutline, calendarOutline, homeOutline, personOutline, settingsOutline, timeOutline } from "ionicons/icons";
import "./Profile.css"

function Profile() {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton fill="clear">
                            <IonIcon icon={chevronBackOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>User Profile</IonTitle>
                </IonToolbar>
            </IonHeader>


            <IonContent className="welcome-container">
                <IonCard className="welcome-content">
                    <IonCardContent>
                        <div className="profile-container">
                            <IonList>
                                <IonItem lines="none" className="profile-main-item">
                                    <IonThumbnail className="profile" slot="start">
                                        <img alt="profile" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                                    </IonThumbnail>
                                    <IonLabel>
                                        <h2>User Name</h2>

                                        <div className="change-pic-container">
                                            <IonIcon className="camera" icon={cameraReverseOutline} />
                                            <span>Change profile picture</span>
                                        </div>
                                    </IonLabel>
                                </IonItem>





                                <h2 className="section-title">Study Preferences</h2>
                                <IonList lines="none" className="goals">
                                    <IonItem>
                                        <IonIcon icon={timeOutline} slot="start" />
                                        <IonLabel>Study Goal</IonLabel>
                                        <IonLabel slot="end" className="item-value">12 Days</IonLabel>
                                    </IonItem>
                                    <IonItem>
                                        <IonIcon icon={bookOutline} slot="start" />
                                        <IonLabel>Study Categories</IonLabel>
                                        <IonLabel slot="end" className="item-value">Software Testing, RPA</IonLabel>
                                    </IonItem>
                                </IonList>
                                <h2 className="section-title">Current Streak</h2>
                                <IonGrid className="ion-no-padding">
                                    <IonRow>
                                        <IonCol size="6" style={{ paddingRight: '8px' }}>
                                            <div className="inspiration-card mono-font">
                                                <span className="badge">Streak</span>
                                                <p className="insp-quote">6</p>
                                                <div className="insp-footer">Don't break the chain!</div>
                                            </div>
                                        </IonCol>
                                        <IonCol size="6" style={{ paddingLeft: '8px' }}>
                                            <div className="inspiration-card mono-font">
                                                <span className="badge">Goal</span>
                                                <p className="insp-quote">12</p>
                                                <div className="insp-footer">Almost there!</div>
                                            </div>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>


                            </IonList>
                        </div>
                    </IonCardContent>
                </IonCard>
            </IonContent>


            <IonFooter>
                <IonTabBar slot="bottom">
                    <IonTabButton tab="home" href="/home">
                        <IonIcon icon={homeOutline} />
                        <IonLabel>Home</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="calendar" href="/calendar">
                        <IonIcon icon={calendarOutline} />
                        <IonLabel>Calendar</IonLabel>
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
            </IonFooter>
        </IonPage>
    );
}

export default Profile;