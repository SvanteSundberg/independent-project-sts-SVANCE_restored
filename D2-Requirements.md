#D2: Requirements
##1 An overview of the system-under-development and #2 A brief overview of the expected users:
The system addresses the need of wanting to do sports and other physical activities but not having other people to do them with. It addresses social needs for people to meet other people and exercise needs. The end users of the system are students in general but students at Uppsala University in particular; this could be expanded to other universities in the future. Many students move away from home for their studies and might not have a big social circle in their new city. In Uppsala, student activities related to sports are rather popular; there are student sports teams and the nations arrange different sport activities. This suggests that there is a need among students to do sports. From personal experience we believe this applies to students with both big and small social circles; for example some friends that want to play soccer but need more people to form proper teams. Another aspect of the system is the physical and psychological benefits experienced from exercise. Many students experience a lot of stress, which can be relieved by physical activity. Because of this the system also addresses well-being.
The goal of the system is to connect students that want to do sports and have fun together. This will be realized through a mobile application. The app will allow students to register as users and create events that will be posted on a timeline, this timeline can be viewed by all other users. React Native will be used together with Expo for the front-end and Firebase will be used for the back-end.

##3 A list of features (functional requirements) that the system must, should, and could exhibit.
When brainstorming ideas for the app, the team quickly realized that the time frame of the project might not be enough to implement every single feature that we originally wanted. It was also seen as more desirable that the app would have fewer functionalities that would work in a smooth and intuitive way rather than many functionalities that do not work well. Therefore the ideas were divided and prioritized into different groups. The base functionalities (the “must” functional requirements) were decided as the following:
The ability to create user accounts that store information about the user. The information that must be stored is: the full name, email address and information that is optional to the user is age, profile picture, gender, short description of themselves.
A profile page for users. In the profile page the users have the ability to change information about themselves.
A timeline or list of activities with information about them such as time, place, number of people (available spots) and a short description.
Users create activities. When creating events/activities the user fills out a form stating the date, time, location, a title that is shown in the timeline and a description of the event.
A way to limit the amount of participants for an event. When creating an event the user fills out how many people they want to join their event. The other users have the ability to fill in a checkbox in the timeline of the app. The timeline updates the number of available slots in real time and when the checkbox is clicked by someone the number of slots decreases by one.
Filtering by date of activities shown in the timeline.

The second tier or the “should” requirements are:

The ability to choose what activities (type of events) the user is interested in when creating the profile.
A map showing where the activities of a certain day take place. The map would show the different activities with a symbol representing the activity in that location.
The ability to filter what is shown on the map based on the picked interests of the user.
The profile picture of the user who created the event is shown in the respective event in the timeline.

The “could” functional requirements:

User notifications for activities matching their interests.
A safe way to know who the other users of the app are. Some sort of verification system.
Directions to the event using google API.
The ability to manually drop a pin on a map when the event is created. This would be great since all events would probably don't have an exact address (for example soccer in the middle of a field somewhere).
##4 A list of non-functional requirements of the system, such as those related to security, privacy, performance, quality of service, tools and technologies for development, deployment, and production, and so forth.
We want the system to be smooth and look professional. We want to create nice looking components that have a good and familiar look and feel and make the user feel sure about what to do next. The flow of the app should be logical and simple, we want to reduce the number of buttons and interactions in places when they are not needed. The application should look as similar as possible on both iOS and Android phones.
In order to achieve a logical flow we made a mockup prototype in Figma. Figma is a design tool that allows several collaborators to work simultaneously. This allowed us to work together on different frames of the mock-up at an early stage which helped with the realization of the initial idea.
The main reason behind choosing to work with React Native is that it is platform independent. In other words the developers do not need to write separate code for iOS and Android phones. React Native is also well integrated with Expo.
Expo is a platform and a framework that makes it easy to build and deploy applications that are compatible with iOS, android and web apps. Because Expo is universal and works cross-platform the application could be developed using only one codebase written in JavaScript and TypeScript. Since our team was using phones and computers with both iOS and Android operating systems and we wanted to create an app that was useful to everyone in the team, Expo was the perfect fit.
Expo also provides tools for visualizing the application in real time. When developing it is possible to scan a QR code from the terminal and view the application on a phone – iphone and Android phone – or in a web browser. The application that runs on phones is called Expo Client. This tool is helpful during the development of the front-end, continuous visualization on an actual phone makes it possible to get a fair experience on the look and feel of the finished application.
Our choice of Firebase for back-end was partly based on the different tools for achieving safe data management and secure user authentication that it offers. When it comes to handling personal data and security issues, we feel that it is beneficial to implement already developed methods to ensure that it is handled safely.
User authentication is a crucial part of our application since it builds on users interacting with each other, therefore it is important that the users really are who they claim to be. The Firebase Authentication provides a 2-step verification method for signing up, which significantly increases the security. The user is signing up with an email and a password that has to attain certain requirements such as containing special characters and numbers. Then an email is sent to the given email-address where the user confirms “their identity”.
Firebase also provides different methods necessary for usability, such as sending password reset emails if a user has forgotten their password.

##5 An overview of how you would promote the system
The app is intended to be free considering that students in general don’t have a lot of money to spend. However, the app could make some money through ads. Ads could be implemented at the top or bottom of the timeline or show up after creating an event. The important aspect is that the ads are not supposed to affect the user experience in a negative way. Since the app's content is created by its users, it is important to build up a big user base. To build a user base the idea is to engage with the target group by visiting different campuses around Uppsala and market the app while handing out coffee. Student sections and nations could also be contacted for marketing via their channels.