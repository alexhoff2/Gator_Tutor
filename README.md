# csc648 Repository

# 📚 Table of Contents
1. 📖 [About](#about)
3. 👥 [Team Workflow](#team-workflow)
4. 📚 [Documentation](#documentation)
5. 📜 [License](#license)
6. 🤝 [Contributions](#contributions)


## 📖 About

**Team Name:** Team 6 - CSC 648/848 Software Engineering, Fall 2024  
**Project:** SFSU Tutoring Service Web Application  
**Class CEO:** Prof. Dragutin Petkovic  
**Class CTO:** Anthony John Souza

#### Team Members:
- **Alex Hoff (Team Lead):** Leading the team and organizing project milestones.
- **Austin Ng (Backend Lead):** Responsible for server-side logic and database management.
- **Jack Richards (GitHub Master):** Overlooking structures and code inside of the Project.
- **Dylan Faulder (Software Engineer):** Organizing and maintaining GitHub repository, overseeing version control.
- **Dalan Choy (Front End Lead):** Desinging and overlooking the front end.

#### Project Overview:
We are working on a web-based application that facilitates tutoring services at SFSU, designed exclusively for students, faculty, and staff. Our mission is to create a simple, secure, and user-friendly platform that helps students find and connect with tutors on campus.

## 👥 Team Workflow

### Git Branching Strategy

- **🌳 Main Branch**: Always stable and production-ready. No direct pushes here.
- **⚙️ Development Branch**: For active development. Features branch off here.
- **✨ Feature Branch**: For individual features or fixes. Merged into `development` after review.
- **🚀 Release Branch**: Created when the code is stable and ready for production.
- **🔥 Hotfix Branch**: For urgent fixes. Merged into both `main` and `development`.

### Workflow Example

1. **Create a Feature Branch**:
    ```bash
    git checkout -b feature/new-login-system
    ```
2. **Work on Feature**:
    Develop your feature locally.
3. **Submit a Pull Request**:
    After your feature is complete, push it and submit a PR for code review.
    ```bash
    git push origin feature/new-login-system
    ```
4. **Code Review**:
    Team members review the feature. Once approved, it is merged into `development`.
5. **Merge to Development**:
    ```bash
    git checkout development
    git merge feature/new-login-system
    ```
6. **Test on Development**:
    Test all features on the `development` branch.
7. **Create Release Branch**:
    ```bash
    git checkout -b release/v1.0.0
    ```
8. **Merge to Main**:
    Once testing is complete, merge into `main`:
    ```bash
    git checkout main
    git merge release/v1.0.0
    ```


## 📚 Documentation

_(Documentation section is currently empty)_


## 📜 License

_(License section is currently empty)_


## 🤝 Contributions

| Student Name | Student Email | GitHub Username |
|    :---:     |     :---:     |     :---:       |
| Dalan Choy      | dchoy3@mail.sfsu.edu              |  whyyux               |
| Jack Richards      |        jrichards7@sfsu.edu       |        Arodoid         |
| Austin Ng    | ang@sfsu.edu  |    ang643       |
| Alexander Hoff     |   ahoff2@sfsu.mail.edu            |      alexhoff2           |
| Dylan Faulder     |   dfaulder@mail.sfsu.edu            |   YinoCS              |
