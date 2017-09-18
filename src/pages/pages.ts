import { ListMasterPage } from './list-master/list-master';
import { SearchPage } from './search/search';
import { SettingsPage } from './settings/settings';
import { TabsPage } from './tabs/tabs';
import { TutorialPage } from './tutorial/tutorial';
import { UploadPage } from './upload/upload';
import { ContentPage } from "./content/content";
import {ViewimagesPage} from "./viewimages/viewimages"


// The page the user lands on after opening the app and without a session
export const FirstRunPage = TabsPage;

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = TabsPage;

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = UploadPage;
export const Tab2Root = ViewimagesPage;
export const Tab3Root = SettingsPage;
