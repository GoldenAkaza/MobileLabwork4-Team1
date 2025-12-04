import {
    IonButton, IonButtons, 
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, IonThumbnail,
    IonTitle,
    IonToolbar,
    IonInput,
    IonSelect,
    IonSelectOption,
} from '@ionic/react';
import { chevronBackOutline, cameraReverseOutline, bookOutline, timeOutline } from "ionicons/icons";
import React, { useState, useRef } from 'react'; 
import { useTasks } from './TaskContext'; 
import "./Profile.css"

function Profile() {
    // Dynamic Context Data (Needed for the "Done" counter)
    const { tasksDone } = useTasks();

    // Local State
    const initialImageUrl = "https://ionicframework.com/docs/img/demos/thumbnail.svg";
    const [profileImageUrl, setProfileImageUrl] = useState(initialImageUrl); 
    const [studyGoal, setStudyGoal] = useState<number>(10); 
    const initialCategories = ['Software Testing', 'RPA', 'React', 'DevOps'];
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['Software Testing', 'RPA']);

    // Image Upload Logic Setup
    const fileInputRef = useRef<HTMLInputElement>(null);
    const triggerFileInput = () => { fileInputRef.current?.click(); };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfileImageUrl(URL.createObjectURL(file));
        }
    };

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

            {/* 🛑 Centering Container */}
            <IonContent className="welcome-container">
                <div className="welcome-content">
                    
                    <IonList>
                        
                        {/* === 1. User Info Section === */}
                        <IonItem lines="none" className="profile-main-item">
                            <IonThumbnail className="profile" slot="start">
                                <img alt="profile" src={profileImageUrl} />
                            </IonThumbnail>
                            <IonLabel>
                                <p className="username-label">User Name</p> 
                                <div className="change-pic-container" onClick={triggerFileInput}>
                                    <IonIcon className="camera" icon={cameraReverseOutline} />
                                    <span>Change profile picture</span>
                                </div>
                            </IonLabel>
                        </IonItem>

                        {/* HIDDEN INPUT FIELD */}
                        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />

                        {/* === 2. Study Preferences Section === */}
                        <h2 className="section-title">Study Preferences</h2>

                        {/* Study Goal Input */}
                        <IonItem>
                            <IonIcon icon={timeOutline} slot="start" />
                            <IonLabel position="stacked">Study Goal</IonLabel>
                            <IonInput
                                type="number"
                                value={studyGoal}
                                onIonChange={(e) => {
                                    const value = parseInt(e.detail.value!, 10);
                                    setStudyGoal(isNaN(value) ? 0 : value);
                                }}
                                min="0"
                            />
                            <IonLabel slot="end" className="tasks-unit-label">Tasks</IonLabel>
                        </IonItem>

                        {/* Study Categories Select */}
                        <IonItem lines="none">
                            <IonIcon icon={bookOutline} slot="start" />
                            <IonLabel>Study Categories</IonLabel>
                            <IonSelect
                                multiple={true}
                                value={selectedCategories}
                                placeholder="Select categories"
                                onIonChange={(e) => setSelectedCategories(e.detail.value!)}
                            >
                                {initialCategories.map((cat) => (
                                    <IonSelectOption key={cat} value={cat}>
                                        {cat}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                        
                        {/* === 3. Current Progress Section (The Two Boxes) === */}
                        <h2 className="section-title">Current Progress</h2> 
                        <IonGrid className="ion-no-padding">
                            <IonRow className="ion-padding-horizontal">
                                {/* Column 1: Tasks Done (Dynamic Counter) */}
                                <IonCol size="6" style={{ paddingRight: '8px' }}>
                                    <div className="inspiration-card mono-font">
                                        <span className="badge">Done</span> 
                                        <p className="insp-quote">{tasksDone}</p> 
                                        <div className="insp-footer">Tasks Completed</div>
                                    </div>
                                </IonCol>
                                
                                {/* Column 2: Goal */}
                                <IonCol size="6" style={{ paddingLeft: '8px' }}>
                                    <div className="inspiration-card mono-font">
                                        <span className="badge">Goal</span>
                                        <p className="insp-quote">{studyGoal}</p> 
                                        <div className="insp-footer">Daily Target</div>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonGrid>

                    </IonList>
                    
                </div>
            </IonContent>
        </IonPage>
    );
}

export default Profile;
