// 
import moment from "moment-timezone";

import { ScheduleTalk } from "../types";
import talksJsonPerDay from "./talks.json";

const BEGIN_DAY_OF_CONFERENCE = moment.tz(
  "2018-04-13 09:00:00",
  "Europe/Berlin"
);

function getTime(day, duration) {
  return {
    start: day.toDate(),
    end: day.add(duration, "minutes").toDate()
  };
}

let breakCount = 0;
function br() {
  return `break-${breakCount++}`;
}

const splitTimeString = timeString => {
  if (!timeString) {
    return { hour: 0, minute: 0 };
  }
  const t = timeString.split(":");
  return {
    hour: t[0],
    minute: t[1]
  };
};

const talks = [];
let currentDay = BEGIN_DAY_OF_CONFERENCE;
talksJsonPerDay.forEach(talksForSingleDay => {
  talksForSingleDay.forEach(talkJson => {
    const { hour, minute } = splitTimeString(talkJson.time);
    talks.push({
      isBreak: talkJson.isBreak,
      room: talkJson.room,
      speakers: talkJson.speakers,
      summary: talkJson.summary,
      title: talkJson.title,
      time: BEGIN_DAY_OF_CONFERENCE.clone().set({
        hour: hour,
        minute: minute,
        second: 0
      })
    });
  });

  currentDay = currentDay.clone().add(1, "day");
});
/*
const data = {
  [br()]: {
    break: true,
    important: true,
    time: getTime(DAY_ONE, 60),
    title: "Registration / Breakfast"
  },
  [br()]: {
    break: true,
    important: true,
    time: getTime(DAY_ONE, 30),
    title: "Hall Doors Open"
  },
  keynote: {
    keynote: true,
    time: getTime(DAY_ONE, 60),
    title: "Conference Keynote",
    summary: "",
    videoId: "7HSd1sk07uU",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/30840890815ed0044146eb2da203276e?s=128",
        github: "tomocchino",
        name: "Tom Occhino",
        twitter: "tomocchino",
        summary:
          "Tom manages the React team at Facebook. Since joining in 2009 he's helped build various frameworks, features, and systems across the company."
      },
      {
        avatar:
          "https://www.gravatar.com/avatar/ceb6764d18462b099b98cc6447363ef6?s=128",
        github: "sebmarkbage",
        name: "Sebastian Markbage",
        twitter: "sebmarkbage",
        summary:
          "Sebastian is an engineer on the React core team, and dabbles in all things JavaScript, at Facebook."
      },
      {
        avatar:
          "https://www.gravatar.com/avatar/f3928721841baa5ee26fbbe906348039?s=128",
        github: "jingc",
        name: "Jing Chen",
        twitter: "jingc",
        summary:
          "Jing is an engineer on the React Native team, and previously worked on Flux and Relay."
      }
    ]
  },
  [br()]: {
    break: true,
    time: getTime(DAY_ONE, 30)
  },
  "lin-clark": {
    summary:
      "React will have a new core algorithm soon with Fiber. This new algorithm improves responsiveness and perceived performance for complex pages. But to make that happen, the architecture had to be reconsidered from the ground up. In this talk, I'll break down the new concepts and explain what makes it seem faster.",
    title: "A Cartoon Intro to Fiber",
    videoId: "ZCuYPiUIONs",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/a1c30f951cdefc554d6e2d078a02468d?s=128",
        github: "linclark",
        name: "Lin Clark",
        twitter: "linclark",
        summary:
          "Lin works with emerging technologies at Mozilla and draws code cartoons."
      }
    ],
    time: getTime(DAY_ONE, 30)
  },
  "guillermo-rauch": {
    summary:
      "I'd like to describe our journey building Next.js and what comes after :)",
    title: "Next.js: Universal React Made Easy and Simple",
    videoId: "evaMpdSiZKk",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/486e20e16ef676a02ac0299d2f92b813?s=128",
        github: "rauchg",
        name: "Guillermo Rauch",
        twitter: "rauchg",
        summary:
          "CEO and Co-Founder of ZEIT (check out zeit.co/now). Creator of socket.io, mongoose, micro, next.js, Hyper and a few other things. Edward Sharpe and the Magnetic Zeroes fan."
      }
    ],
    time: getTime(DAY_ONE, 30)
  },
  "ben-ilegbodu": {
    summary:
      "JavaScript is evolving quickly. The ES6 specification was released back in 2015 and has been implemented by modern browsers. New versions of ECMAScript will now be released on a yearly basis. We can leverage ES6 and functionality slated for future versions right now to write even clearer and more concise React code. Experience with React will help you get the most out of this session, but you don’t have to have a JavaScript black belt to leave feeling confident in using ES.next with React. Learn how to write cleaner code using the spread operator, destructuring, new async functions, and other features being introduced into ECMAScript. Oh, and don’t worry if you don’t understand all of those terms — you soon will after this session!",
    title: "React + ES.next = ♥",
    videoId: "jh_Qzi-yHU0",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/0feb204b70c4be3d22fe27cc3f424d33?s=128",
        github: "benmvp",
        name: "Ben Ilegbodu",
        twitter: "benmvp",
        summary: ""
      }
    ],
    time: getTime(DAY_ONE, 30)
  },
  [br()]: {
    break: true,
    time: getTime(DAY_ONE, 90),
    title: "Lunch"
  },
  "preethi-kasireddy": {
    summary:
      "Redux has become the defacto way to manage state in React— yet, there's a new kid on the block that is seeing promising growth and adoption: Mobx. The goal of the talk is to explore a thorough and balanced view on Mobx vs. Redux for state management. They both have distinct mental models for handling state (i.e. Functional vs. Object-oriented and Reactive, Mutable vs. Immutable, Plain objects vs. Observables, Single-store vs. Multi-store, Normalized state view vs. Nested state view, etc.). And naturally, the opposing mental models each have their benefits and tradeoffs — so how do you pick? While the choice is somewhat subjective, we'll discuss a few objective factors to consider. We'll also look at a few concrete examples for which scenarios it makes sense to choose Redux vs. Mobx vs. Something else vs. Nothing at all (i.e. React setState).",
    title: "MobX vs Redux: Comparing the Opposing Paradigms",
    videoId: "76FRrbY18Bs",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/6286256e2fd3a464806d6a41a23c02c5?s=128",
        github: "peekay",
        name: "Preethi Kasireddy",
        twitter: "iam_preethi",
        summary:
          "Lead Software & UI Engineer at Sapien.ai, designing and building conversational bots. Avid technical blogger."
      }
    ],
    time: getTime(DAY_ONE, 30)
  },
  "jared-forsyth": {
    summary:
      'Tools like Flow and TypeScript promise "types for your JavaScript" - but what does that get you, exactly? What\'s the experience like of adding types to a large JavaScript project? Is the overhead worth it for you and your team? In the end, embracing type systems will give you more confidence in your code, fewer production bugs, and a much friendlier codebase.',
    title: "Type Systems Will Make You a Better JavaScript Developer",
    videoId: "V1po0BT7kac",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/36c528f0d1f8811f27268119b2c63eaa?s=128",
        github: "jaredly",
        name: "Jared Forsyth",
        twitter: "jaredforsyth",
        summary: ""
      }
    ],
    time: getTime(DAY_ONE, 30)
  },
  [br()]: {
    break: true,
    time: getTime(DAY_ONE, 1),
    title: "Lightning Talks",
    lightning: true
  },
  "andres-suarez": {
    summary:
      'In my talk last year, "Nuclide hacks for React Native development" I briefly touched on how Flow can lead to writing better React Native apps. This year, the focus is entirely on using Nuclide\'s rich UI for Flow features to move fast with React.',
    title: "Moving Fast with Nuclide and Flow",
    videoId: "WRyk5ZVklFs",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/a533b2e0c40619f551bf54506e53ca2c?s=128",
        github: "zertosh",
        name: "Andres Suarez",
        twitter: "zertosh",
        summary: "I can convert Red Bull into JavaScript at Facebook"
      }
    ],
    time: getTime(DAY_ONE, 5),
    lightning: true
  },
  "sophia-shoemaker": {
    summary:
      'AWS Lambda is an event-driven, "serverless" service that makes it easier and cheaper than ever to get an application up and running. In this talk I\'ll dive into some of the details of what AWS Lambda is, how it works, how to integrate it with another AWS service, API Gateway and how you can "go serverless" with React applications.',
    title: "AWS Lambda + AWS Gateway + React = AWEsome",
    videoId: "GuItxBkpIAQ",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/862e513be39c4338bf939dede21ce271?s=128",
        github: "mrscobbler",
        name: "Sophia Shoemaker",
        twitter: "wisecobbler",
        summary:
          "Sophia Shoemaker is a web developer and a member of the Fullstack React team"
      }
    ],
    time: getTime(DAY_ONE, 6),
    lightning: true
  },
  "merrick-christensen": {
    summary:
      "In this talk we will explore React’s composable &amp; flexible programming model in the domain of, well… programming. Here we will see how React can be used to codify your teams best practices, teach beginners JavaScript &amp; help proficient programmers refactor more efficiently. You know what they say? “When all you have is hammer… React is good for everything.”",
    title: "React to Code",
    videoId: "HqMMj-5PxW0",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/4b03e52a178cd81f8743173976975c20?s=128",
        github: "iammerrick",
        name: "Merrick Christensen",
        twitter: "iammerrick",
        summary: ""
      }
    ],
    time: getTime(DAY_ONE, 6),
    lightning: true
  },
  "max-stoiber": {
    summary:
      "What if we took the best of JavaScript and the best of CSS, and combined them together to create the ultimate styling solution for React? Glen Maddern (CSS Modules co-creator) and I sat down and starting thinking about this. Let's talk about what we thought about and why we arrived where we did – 💅 styled-components.",
    title: "The Road to Styled Components",
    videoId: "jjN2yURa_uM",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/48619fc17b3ab68472aebd56c0106278?s=128",
        github: "mxstbr",
        name: "Max Stoiber",
        twitter: "mxstbr",
        summary:
          "Max works as an open source developer at Thinkmill. He makes styled-components, react-boilerplate, KeystoneJS and micro-analytics."
      }
    ],
    time: getTime(DAY_ONE, 6),
    lightning: true
  },
  "feather-knee": {
    summary:
      "How does Netflix select which new content to offer from a myriad of choices? The service is famously data-driven, but sometimes there is very little data to inform decisions. Data science meets art. Learn about a prediction tool that was recently redesigned, expanded and re-written in React.",
    title: "Building Applications for a Studio in the Cloud at Netflix",
    videoId: "7VV1HvVjrlU",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/9d78b84e1e017c2881a07f44c72267eb?s=128",
        name: "Feather Knee",
        twitter: "featherart",
        summary: ""
      }
    ],
    time: getTime(DAY_ONE, 6),
    lightning: true
  },
  [br()]: {
    break: true,
    time: getTime(DAY_ONE, 30)
  },
  "leland-richardson": {
    summary:
      'Integrating React Native with a large existing native codebase can prove to be very difficult. Use of React Native generally falls into two categories: "Green Field" and "Brown Field". "Green Field" apps are built from the ground up with 100% React Native, and "Brown Field" apps integrate React Native into an already existing codebase. Integrating React Native into Airbnb\'s main app has been a great learning experience, and I will share the various hurdles we\'ve had to overcome in the process of building over 100 screens in React Native across dozens of engineers, shipping to millions of users.',
    title: 'React Native in the "Brown Field"',
    videoId: "tWitQoPgs8w",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/a1dc04961aa47c7ce072ffa224fabdbb?s=128",
        github: "lelandrichardson",
        name: "Leland Richardson",
        twitter: "intelligibabble",
        summary:
          "Leland is a Software Engineer at Airbnb working on React and React Native. He is interested in finding elegant solutions to difficult problems. Passionate educator and simplifier."
      }
    ],
    time: getTime(DAY_ONE, 30)
  },
  "tal-kol": {
    summary:
      "The async nature of the React Native bridge incurs an inherent performance penalty, preventing JavaScript code from running at high framerates. Modern animation libraries, like Animated, address this by minimizing passes over the bridge. User interactions, where UI continuously reacts to the user's gestures, are a step further. How can we run those at 60 FPS?",
    title:
      "Moving Beyond Animations to User Interactions at 60 FPS in React Native",
    videoId: "mjsv8NJnt5k",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/f3885bee0da8e2573c2394d30621e9d1?s=128",
        github: "talkol",
        name: "Tal Kol",
        twitter: "koltal",
        summary:
          "Head of Mobile Engineering Wix.com. Tal is a full-stack developer, specializing in native development for iOS and Android. His latest passion is React Native."
      }
    ],
    time: getTime(DAY_ONE, 30)
  },
  [br()]: {
    break: true,
    time: getTime(DAY_ONE, 1),
    title: "Lightning Talks",
    lightning: true
  },
  "adam-perry": {
    summary:
      "A presentation of the create-react-native-app (CRNA) tool. CRNA follows in the well-trodden path of create-react-app, providing a cross-platform, boilerplate-free developer experience for new React Native projects. CRNA is the product of a collaboration between Expo, Facebook, and open-source contributors.",
    title: 'Create React Native App: 5 Minutes to "Hello, World!"',
    videoId: "9baaVjGdBqs",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/8e9af27762850ca9fc9984eb8ff21259?s=128",
        github: "dikaiosune",
        name: "Adam Perry",
        twitter: "dika10sune",
        summary:
          "Open source, dogs, and some other things. Writing React Native devtools and services at Expo. Ask him about Rust."
      }
    ],
    time: getTime(DAY_ONE, 5),
    lightning: true
  },
  "samer-buna": {
    summary:
      "GraphQL is the future, and you can use it today in React applications with minimal changes. No fancy frameworks are needed. Start using GraphQL right away to get the power of composition and declarative data requirements and work with more efficient APIs.",
    title: "You Don't Need a Fancy Framework to Use GraphQL with React",
    videoId: "M4JqfZ-WaI0",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/4b6b338a1609ea0a4dfec74208425620?s=128",
        github: "samerbuna",
        name: "Samer Buna",
        twitter: "samerbuna",
        summary:
          "Author of online courses on Pluralsight and Lynda. Coder at jsComplete. Teacher for O'Reilly and Forwardjs. Editor of EdgeCoders."
      }
    ],
    time: getTime(DAY_ONE, 6),
    lightning: true
  },
  "peggy-rayzis": {
    summary:
      "Data is all around us! From health tracking to sports statistics, users expect to see the data they're consuming presented consistently on every platform. In this talk, you'll learn how to use Victory, a library available for React and React Native, to build interactive, composable charts with ease. You'll also see some cool real-world examples on both platforms showcasing the power of Victory to inspire you for your next data viz project.",
    title: "Cross-Platform Data Visualization with React and React Native",
    videoId: "lF-ztmPVWmo",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/b6e83f06e71655a28bef6582c4b804e8?s=128",
        github: "peggyrayzis",
        name: "Peggy Rayzis",
        twitter: "peggyrayzis",
        summary:
          "Peggy is a Software Engineer at Major League Soccer who builds awesome fan experiences in React & React Native. She also loves hacking on nteract and skiing."
      }
    ],
    time: getTime(DAY_ONE, 6),
    lightning: true
  },
  "ken-wheeler": {
    summary:
      "An exploration in past and current alternative uses for React, non-standard rendering targets, and the future of such shenanigans.",
    title: "Using React for Anything but Websites",
    videoId: "-VC7o6wZ_a8",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/4751e2e9fe7b876958d38f86a718ca91?s=128",
        github: "kenwheeler",
        name: "Ken Wheeler",
        twitter: "ken_wheeler",
        summary:
          "Ken is the Director of Open Source at Formidable, and the creator of libraries such as Slick, Spectacle, react-music and webpack dashboard."
      }
    ],
    time: getTime(DAY_ONE, 6),
    lightning: true
  },
  "dustan-kasten": {
    summary:
      "The React components we know and love are a powerful and constrained abstraction for building user interface. The React team has managed to not only rewrite the entire reconciler with Fiber, but also create a simple and constrained API for implementing a React renderer! Let’s take a short exploration into what happens when we expand the definition of user interface so that React can render everywhere.",
    title: "React Everything, Render Everywhere",
    videoId: "4M1xQzAbesY",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/d22307e787361923d233607122640e32?s=128",
        github: "iamdustan",
        name: "Dustan Kasten",
        twitter: "iamdustan",
        summary: ""
      }
    ],
    time: getTime(DAY_ONE, 6),
    lightning: true
  },
  [br()]: {
    break: true,
    important: true,
    time: getTime(DAY_ONE, 120),
    title: "Happy Hour"
  },

  [br()]: {
    break: true,
    important: true,
    time: getTime(DAY_TWO, 30),
    title: "Registration / Breakfast"
  },
  [br()]: {
    break: true,
    important: true,
    time: getTime(DAY_TWO, 30),
    title: "Hall Doors Open"
  },
  "michaela-lehr": {
    summary:
      "My talk will give you an overview of the WebVR ecosystem, beginning with a short introduction of the basic VR concepts, like head tracking sensors, the field of view and stereoscopic images. You will also see the current status of the ReactVR in action with code samples. Which leads to another important point of this talk: the struggles of creating VR applications today. There are a lot of unanswered questions, e.g. UX design challenges, input devices, motion sickness or browser support. This is why the talk ends with my advice on how to create responsible applications, that won't harm your users – neither physically nor psychologically.",
    title:
      "Goodbye Flatland! An introduction to ReactVR and what it means for web developers",
    videoId: "CtVo3z_o9Rw",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/b1898d507a4d4102606c496fdab74c86?s=128",
        github: "Fischaela",
        name: "Michaela Lehr",
        twitter: "FischaelaMeer",
        summary:
          "Michaela Lehr is a creative front-end developer and designer. She specializes in UX and WebVR, and co-founded the studio GeilDanke. In her free time she travels round the world, practices yoga, and watches way too much Buffy."
      }
    ],
    time: getTime(DAY_TWO, 30)
  },
  "robert-zhu": {
    summary:
      "React's declarative model has made it fun and easy to build engaging realtime interactions. But great realtime apps need great realtime APIs. Come learn how GraphQL can push data to your React apps in realtime with GraphQL Subscriptions. We'll take a look at the GraphQL Subscriptions Specification and how it enables an ecosystem of clients and servers.",
    title: "Realtime React Apps with GraphQL",
    videoId: "AYbVMNtO-ro",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/12ee4dac83689004c4a5d0d73eebbccb?s=128",
        github: "robzhu",
        name: "Robert Zhu",
        twitter: "rbzhu",
        summary:
          "I'm a software engineer at Facebook working on GraphQL. I enjoy psychology, economics, history, technology, gaming, and building stuff."
      }
    ],
    time: getTime(DAY_TWO, 30)
  },
  [br()]: {
    break: true,
    time: getTime(DAY_TWO, 30)
  },
  "rogelio-guzman": {
    summary:
      "With Jest, you can capture snapshots of React trees or other serializable values to simplify UI testing and to analyze how state changes over time. In this talk we will do a deep dive into snapshot testing and talk about other uses for them. We are also going to chat about how some of its internal packages can be used to create your own tools that leverage Jest's infrastructure.",
    title: "Jest Snapshots and Beyond",
    videoId: "HAuXJVI_bUs",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/affbc2bbe98b6c586275cfeb12fd80fd?s=128",
        github: "rogeliog",
        name: "Rogelio Guzman",
        twitter: "rogeliog",
        summary:
          "Hola, I love to code, I help out with @fbjest and I'm currently working as a front end developer at Docker"
      }
    ],
    time: getTime(DAY_TWO, 30)
  },
  "neehar-venugopal": {
    summary:
      "The most performant code is code that never runs. Modern web apps are bigger in size that ever before, and the idea of Shipping Less JavaScript™ feels like a pipe dream. Until now. Thanks to modern bundlers, ES6 module magic and the brand new import() proposal, JavaScript finally has an idiomatic way of delivering parts of your web app when it's needed. This talk is meant to show how you can start using import() today to load smaller, faster code with minimal effort.",
    title: "A Beginner's Guide to Code Splitting Your React App",
    videoId: "bb6RCrDaxhw",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/86d9c5bbb33f358f1169bf102d50d25b?s=128",
        github: "neeharv",
        name: "Neehar Venugopal",
        twitter: "neeharv",
        summary: ""
      }
    ],
    time: getTime(DAY_TWO, 30)
  },
  "parashuram-n": {
    summary:
      "React Native brought the web’s enviable development patterns like hot module replacement and Redux action replay to mobile, without needing to sacrifice native UI. In this talk, we will take the idea further to explore some more interesting developer workflows. Starting by looking at the internals of React Native debugging, we will take advantage of Node's built in Time Travel Debugging feature to jump back and forth between React Native call stacks. We will then leverage React Native's unique event model to mirror user gestures across multiple devices and use it to simultaneously test our app across various form factors. Once the app is written, we will set up an automated continuous deployment pipeline to quickly build, test and distribute our app, powered by Code Push and Visual Studio Mobile Center. In each of these cases, we will see why React Native is uniquely positioned to supercharge your mobile application development experience.",
    title: "Web-Like Development and Release Agility for React Native",
    videoId: "iMLpUVZseEg",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/d1901db1add07659076eca4ec2147f4a?s=128",
        github: "axemclion",
        name: "Parashuram N",
        twitter: "nparashuram",
        summary:
          "Parashuram is a front end developer, web performance enthusiast and  an Apache Cordova Committer. At his day job, he is a Program Manager at Microsoft where he builds developer tools like CodePush and the VSCode extension for React and React Native."
      }
    ],
    time: getTime(DAY_TWO, 30)
  },
  [br()]: {
    break: true,
    time: getTime(DAY_TWO, 90),
    title: "Lunch"
  },
  "marie-laure-thuret": {
    summary:
      "React-Storybook provides a complete isolated environment with hot reloading that let you design and develop iteratively your UI React components. On top of that, by building your components this way you will ensure almost for free the creation of a nice living documentation and you will have a perfect entry point when we'll became the time to experiment things or solve issues.",
    title:
      "React-Storybook: Design, Develop, Document and Debug your React UI components",
    videoId: "PF0Vi-iIyoo",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/431dfba5a89e9841daea12dc32a04924?s=128",
        github: "mthuret",
        name: "Marie-Laure Thuret",
        twitter: "mlthuret",
        summary:
          "I'm a front-end developer working on Algolia's Open Source libraries."
      }
    ],
    time: getTime(DAY_TWO, 30)
  },
  "cameron-westland": {
    summary:
      "For fabricating digital products, the designer/developer workflow is broken. In this talk I’ll go into some of the problems with the current workflow and why I think the existing solutions are bad. I’ll also demonstrate a component based visualization tool, a new markup language, and compiler which can generate React components, as possible solutions. My ultimate goal is to allow designers to build and deploy complex UI components from concept to production like they do with many other assets like video, images and icons.",
    title: "Extensible React",
    videoId: "395ou6k6C6k",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/0c42130e61dd791ae86aa8b0931e5853?s=128",
        github: "camwest",
        name: "Cameron Westland",
        twitter: "camwest",
        summary:
          "Cameron has been working at Autodesk on Web UI projects for three years. Prior to that he co-founded Kera Software which was acquired in 2013. He’ll talk your ear off about many topics including UI components, extensibility, and design systems."
      }
    ],
    time: getTime(DAY_TWO, 30)
  },

  [br()]: {
    break: true,
    time: getTime(DAY_TWO, 1),
    title: "Lightning Talks",
    lightning: true
  },
  "troy-connor": {
    summary:
      "Last year I won the diversity scholarship and this year I’m going to talk about how we can grow this community outside of our peers. I’m going to talk about the importance of diversity within the tech culture and how doing that has brought React to be as awesome as it is. Also steps we can do to improve contributing, ideas of how we can collaborate, and how we can continue to develop a environment where React can be easier for people who are intimidated to learn it.",
    title: "Building React Communities Outside of Your Circle",
    videoId: "Y2xXUlkF-UM",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/33398b7cfbfa5877a16ab9a0fb0ee303?s=128",
        github: "troy0820",
        name: "Troy Connor",
        twitter: "troy0820",
        summary:
          "Troy is a software engineer at ETA. In his spare time, he likes to play with robots, read, code, and chase conferences and meetups."
      }
    ],
    time: getTime(DAY_TWO, 5),
    lightning: true
  },
  "james-long": {
    summary:
      "All editors format code slightly differently and don't even help with more complex situations like deeply indented syntax, which forces you to manually break it up across lines. This becomes a point of strife within teams, and we waste so much time trying to enforce a consistent coding style. I will show how a new JavaScript formatter, Prettier, takes a different approach and solves this problem completely, freeing you from the burden of thinking about code structure.",
    title: "A Prettier Printer",
    videoId: "hkfBvpEfWdA",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/7ed988fcb335ac36e3c9f7fc8fdb7c10?s=128",
        github: "jlongster",
        name: "James Long",
        twitter: "jlongster",
        summary: ""
      }
    ],
    time: getTime(DAY_TWO, 6),
    lightning: true
  },
  "nicole-chung": {
    summary:
      "Delivering your React app offline, with a look and feel of a native app, is becoming increasingly feasible. Technical benefits include fast installs (since it's just a web page), push notifications, caching page content, delivering a faster feeling experience, and keeping the user logged even when the network drops a connection. By using JS plugins and libraries such such as offline.js and offline-plugin, and browser technologies such as Service Workers, IndexedDB, and AppCache, you can be sure your users will be able to use your web app even as their internet connection drops off.",
    title: "How to React in the Slow Lane",
    videoId: "pSr6sTRDdi4",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/c70631175fb94a653c5b8e08180e1126?s=128",
        github: "nicolechung",
        name: "Nicole Chung",
        twitter: "redconservatory",
        summary:
          "As a Software Engineer at Toronto-based product studio TWG, Nicole  Chung works with Node.js, React, and Redux to build fast and efficient user interfaces. When she’s not at work, she’s a full-stack JS mentor at HackerYou."
      }
    ],
    time: getTime(DAY_TWO, 6),
    lightning: true
  },
  "aditya-punjani": {
    summary:
      "Web Apps and Native Apps are going through a convergence on mobile. Technologies such as Progressive Web Apps and React Native are blurring the lines between the web and native. At Flipkart, we are building platforms and products at scale, designed around this convergence by utilizing the best of both worlds. In this talk I'll go over the architectural design, decisions, and implementation details with React that power the platforms at Flipkart during this era of convergence.",
    title: "The Great Convergence with React",
    videoId: "vsvyg0T40NU",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/35b89a4817380740e0992beeda327f54?s=128",
        github: "adityapunjani",
        name: "Aditya Punjani",
        twitter: "adityapunjani",
        summary:
          "Aditya Punjani is a Senior Frontend Engineer at Flipkart, focusing on building stellar mobile experiences for customer delight. Aditya likes to push the Web forward and is passionate about JavaScript, network and rendering performance, developer tooling, browser internals, and user experience."
      }
    ],
    time: getTime(DAY_TWO, 6),
    lightning: true
  },
  "michael-jackson": {
    summary:
      "React Router is a full-featured routing layer for React applications that run in the browser, on the server, on React Native, and anywhere else React runs. This talk will highlight the capabilities of the first truly universal JavaScript router, enabling developers to learn a single URL-based API for routing and then apply those same principles for adding new screens, flows, and transitions to any React application, regardless of the platform. Learn once, route anywhere.",
    title: "Learn Once, Route Anywhere",
    videoId: "Mf0Fy8iHp8k",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/9210a60b1492363560375d9cd6c842de?s=128",
        github: "mjackson",
        name: "Michael Jackson",
        twitter: "mjackson",
        summary: ""
      }
    ],
    time: getTime(DAY_TWO, 6),
    lightning: true
  },
  [br()]: {
    break: true,
    time: getTime(DAY_TWO, 30)
  },
  "cheng-lou": {
    summary:
      "What is a piece of code? What is a library, a tool, a platform and a language? Based on my last talk on the spectrum of abstraction, this talk explores the daily concerns and the meta-concerns of writing code, and how our new effort, Reason, relates to them.",
    title: "Taming the Meta-Language",
    videoId: "_0T5OSSzxms",
    speakers: [
      {
        avatar:
          "https://www.gravatar.com/avatar/13bede8f6aa8c5eb590995b32ca04bf2?s=128",
        github: "chenglou",
        name: "Cheng Lou",
        twitter: "_chenglou",
        summary: "Cheng Lou works on Messenger by day, and Reason by night"
      }
    ],
    time: getTime(DAY_TWO, 30)
  },
  [br()]: {
    break: true,
    important: true,
    time: getTime(DAY_TWO, 60),
    title: "Panel / Q&A"
  },
  [br()]: {
    break: true,
    important: true,
    time: getTime(DAY_TWO, 240),
    title: "Closing Party at 104"
  }
};
*/

export function getNextTalkFromIndex(idx) {
  if (idx === null) return null;

  // skip over breaks
  let search = idx + 1;
  let talk = talks[search];
  while (talk && talk.break) talk = talks[++search];

  if (!talk) {
    console.info("This is the last talk.");
    return null;
  }

  return talk;
}

export function getPreviousTalkFromIndex(idx) {
  if (idx === null) return null;

  // skip over breaks
  let search = idx - 1;
  let talk = talks[search];
  while (talk && talk.break) talk = talks[--search];

  if (!talk) {
    console.info("This is the first talk.");
    return null;
  }

  return talk;
}

export default talks;
