# Getting Started with Music Hunter

# Running the App

## 1. The easy way

1. Simple go to [https://sh-music-hunter.herokuapp.com/](https://sh-music-hunter.herokuapp.com/) and that's it

## 2. The hard way (building from source code)

1. Checkout the source code from [Github](https://github.com/brunog-castro/music-hunter), it's a private repo but if you are reading this tuto, odds are you have the necessary credentials
2. Open a terminal on the root directory of the project and run `npm i` to install all dependencies. The project was developed with Node v16+, so you may face some error messages if you don't have it installed. If that's the case or if you have another version of Node, I would recommend to use [nvm](https://github.com/nvm-sh/nvm) to keep multiple versions of Node on the same machine. Verified versions:
- v16.0.0
- v14.15.0
3. An `npm run start` should start the app in development mode on [http://localhost:3000](http://localhost:3000), if you want to see it running on a real mobile device, it needs to be on the same network and you should use the IP address displayed right below localhost's address
4. Happy hunting!

# Technical Notes

## Reauthorization
I wanted the client-credentials flow to be as seamless as possible, so all the logic happens under the hood and the user isn't even notified if a request failed because of an expired token. The app will take of that and re-run the query after getting the new token.

## Hookstate for State Management
I'm not a big fan of Redux and other heavy frameworks to manage states in React. 
I find them too verbose, most of the time you end up writing more code than you should just to perform simple tasks.
That said, currently I'm enjoying working with this tiny library called Hookstate, the idea is to manage app states by using React hooks patterns. For this project, you can find the defined stores in src/stores

### flashStore
A toast message system. Since it can be triggered from any place in the app, it made sense to have a separated store for it

### sidebarStore
The sidebar is used here to display details from Artists, Albums and Tracks. The store holds the current state of the sidebar (open/closed) and the data to be displayed

## Search Implementation
For me it was the biggest challenge on this project. Usually we use a debounce technique to avoid too many requests to an endpoint, but the requirement of "*Be given continuously updated search suggestions as I type without having to wait until I've pressed `enter`, or paused my typing*" ruined the idea :p so I choose a mixed approach of running local searches while the user is typing and when the debounce delay timeouts fetching the updated results from the API. 
Basically, this is the flow:
1. If there are no local data, make a request right away
2. When the user is typing, perform a local search and debounce requests each 400ms. The local search is pretty simple as follows:
    - For tracks: tries to match the `searchTerm` against available tracks and artists' names
    - For albums: tries to match the `searchTerm` against available albums and artists' names
    - For artists: tries to match the `searchTerm` against available artists' names
3. There's a control flag called `localSearchActive`, everytime it's true we pass local results down to the components otherwise we read the data from BE's data
4. To be more precise (or less unprecise), I'm always fetching 30 items per category but only displaying 5, this way we have some "buffer" to be looking up.

Of course this implementation isn't perfect and some edge cases are expected, for example, typing a band's name too fast, filtering locally, not finding any results and after the debounce delay the expected result magically appears, we can consider this disadvantage as a tradeoff to not throttle Spotify's API.

That's it. Those were the things I would like to highlight but I will be more than happy to further discuss any other details or questions you may have about the implementation.

So long, and sorry for all the glitches. 🐟