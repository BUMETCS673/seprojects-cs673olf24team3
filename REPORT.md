Overview:

This project is a Health Tracker built to track several health metrics.  It allows you to set goals, track measurements, and has some cool graphs.

I found this project by exploring student projects from CS673.  I did not ask for explicit permission, but I can if it is required.  It was built with the MERN stack, which I'm confident in.  It is not overly complicated, but not overly simple either.  It does have authorization and authentication, as well as a database.  For a student project, it's very well organized and documented, with tests and a dockerfile already setup.  Taking a quick look, there seems to be weak client-side protection on what a user can insert into forms, a lack of headers on requests/responses, and the users endpoint has no auth protecting it.  Having explored a few other projects quickly, this definitely seems perfect for the class project.  I also really enjoy health apps and graphing libraries, so I'm excited to check out how it all works.

Existing functionalities:

- Users can record their steps taken, water intake, sleep, exercise, and weight
- Users can delete entries
- Users can set goals
- Users can track their progress with graphs
- Users can adjust their profile details

Existing Security Features:

- Authentication and session management exist - an hour long jwt is created on the server and a cookie is saved on the client
- Authorization exists for most endpoints - the jwt is used to check access to some endpoints.  This is checked in each individual endpoint and I'm curious to dig more to see if it was maybe missed in some places
- Data Protection and Encrytion - passwords are encrypted, data does not seem to be
- Compliance - I don't think this exists in this project
- Other security features - I can't find much beyond what comes out of the box for the packages used

Current Implementation and Build Process:
Front-end is a React app
Setup is as simple as `npm install`
To run locally `npm run start`
To build `npm run build`

Back-end is a node server that connects to a mongoDB database
Setup is as simple as `npm install`
To run locally `npm run dev`
To build `npm run start`


Security Tools:
1. Github Dependency Review: In my day-to-day job, I spend a lot of time updating dependencies for minor security versions and (luckily) very rarely having to quickly remove a dangerous package from my projects.  Having dependency reviewers like this would be a great improvement.  We already use dependabot, but I'm looking forward to exploring this and others
2. Snyk Code analysis: A long time ago a got a free Snyk t-shirt, but I had no idea what they did.  I'm excited to learn more about them, so I ran their Software Composition Analysis tool.