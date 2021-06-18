# Simple Bug Tracker - Front End

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-th-project">About The Project</a>
      <ul>
        <li><a href="#back-end">Back end</a></li>
      </ul>
    </li>
    <li>
      <a href="#built-with">Built with</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#how-it-works">How it works</a></li>
    <li><a href="#what-i-have-learned">What I have learned</a></li>
    <li><a href="#what-i-have-messed-up">What I have messed up</a></li>
  </ol>
</details>


## About the project
This is the front end portion of the Bug Track project I have written right after learning ReactJS. To challenge myself, I created this as a more complex version of "To-Do" list. The project is incomplete since I have a freelance project to follow up, in which, you may see some unused/empty codes. In addition, this project is an entry level excercise and it is never meant for optimization.

### Back end
The back end is a separate project which can be accessed here: https://github.com/HypernovaTX/SimpleBugTracker.js-Backend-


## Built with (front end):
* [React](https://reactjs.org/)
* [Axios](https://www.npmjs.com/package/axios)
* [Typescript](https://www.typescriptlang.org/)

### Installation
1. Clone the repo
    ```sh
    git clone https://github.com/HypernovaTX/SimpleBugTracker.js-Frontend-.git
    ```
2. Navigate to the project root directory:
    ```sh
    cd ./nova-bug-tracker-js
    ```
3. Install NPM packages
    ```sh
    npm install
    ```
4. To start testing
    ```sh
    npm start
    ```

## How it works:
1. The `root` (index.tsx) splits into 2 components: `Sidebar` (unused) and `TicketList` (components/list.tsx - it lists all of the tickets)
2. When `TicketList` component is mounted, it calls `getData()`
3. getData() sends a POST request to the backend (with sorting options: `sortDirection`, `sortItem`). The response data is saved to React state as a string.
4. The component has several methods to return the data and sorting menu into the list of tickets
5. There are several other components that were called in `TicketList` which are like pop-up dialogues.

## What I have learned:
- Understanding React components, Axios requests, more UI
- Understanding requests/response in React and Express
- Improvements on code organization and readability
- Improvements on logics/problem solving
 
## What I have messed up:
This is a list of the known issues I noticed as of June 2021 when I come back to review my codes:
- React components organization need improvement. There are a lot of logics that can be separated into different methods/components
- Overusing `any` type which defeats the purpose of Typescript
- Lack of proper design pattern/structure.

