import {
    IonButton, IonButtons, IonCard, IonCardContent,
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
// 💡 REQUIRED IMPORT
import { useTasks } from './TaskContext'; 
import "./Profile.css"

function Profile() {
    // 1. GET DYNAMIC TASKS DONE COUNT from the global context
    const { tasksDone } = useTasks();

    const initialImageUrl = "https://ionicframework.com/docs/img/demos/thumbnail.svg";
    
    // 2. Local State for user inputs and display
    const [profileImageUrl, setProfileImageUrl] = useState(initialImageUrl); 
    const [studyGoal, setStudyGoal] = useState<number>(10); // Linked to the Goal Box

    const initialCategories = ['Software Testing', 'RPA', 'React', 'DevOps'];
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['Software Testing', 'RPA']);

    // 3. Image Upload Logic Setup
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const newImageUrl = URL.createObjectURL(file);
            setProfileImageUrl(newImageUrl);
            console.log(`File selected: ${file.name}. Ready for upload.`);
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

            <IonContent className="welcome-container">
                <IonCard className="welcome-content">
                    <IonCardContent>
                        <div className="profile-container">
                            <IonList>
                                
                                {/* Profile Image Section */}
                                <IonItem lines="none" className="profile-main-item">
                                    <IonThumbnail className="profile" slot="start">
                                        <img 
                                            alt="profile" 
                                            src={profileImageUrl}
                                        />
                                    </IonThumbnail>
                                    <IonLabel>
                                        <h2>User Name</h2>
                                        <div className="change-pic-container" onClick={triggerFileInput}>
                                            <IonIcon className="camera" icon={cameraReverseOutline} />
                                            <span>Change profile picture</span>
                                        </div>
                                    </IonLabel>
                                </IonItem>
                                
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                
                                {/* Study Preferences Section */}
                                <h2 className="section-title">Study Preferences</h2>
                                <IonList lines="none" className="goals">
                                    <IonItem>
                                        <IonIcon icon={timeOutline} slot="start" />
                                        <IonLabel position="stacked">Study Goal</IonLabel>
                                        <IonInput
                                            type="number"
                                            value={studyGoal}
                                            placeholder="Enter number of tasks"
                                            onIonChange={(e) => {
                                                const value = parseInt(e.detail.value!, 10);
                                                setStudyGoal(isNaN(value) ? 0 : value);
                                            }}
                                            min="0"
                                        />
                                        <IonLabel slot="end" className="tasks-unit-label">Tasks</IonLabel>
                                    </IonItem>

                                    <IonItem>
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
                                </IonList>
                                
                                {/* Current Progress Boxes */}
                                <h2 className="section-title">Current Progress</h2> 
                                <IonGrid className="ion-no-padding">
                                    <IonRow>
                                        {/* Column 1: Tasks Done (The Calculator) */}
                                        <IonCol size="6" style={{ paddingRight: '8px' }}>
                                            <div className="inspiration-card mono-font">
                                                <span className="badge">Done</span> 
                                                {/* ✅ FIX: This now uses the dynamic count */}
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
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}

export default Profile;
