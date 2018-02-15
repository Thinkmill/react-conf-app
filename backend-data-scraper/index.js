const scrapeIt = require("scrape-it");
const fs = require("fs");
const program = scrapeIt(
  "https://www.neos.io/events/neos-conference-hamburg-2018/program.html",
  {
    days: {
      listItem: "table",
      data: {
        topics: {
          listItem: "tr",
          data: {
            time: "th:nth-child(1)",
            topicRoom1: "td:nth-child(2)",
            speakerRoom1: "td:nth-child(3)",
            topicRoom2: "td:nth-child(4)",
            speakerRoom2: "td:nth-child(5)"
          }
        }
      }
    }
  }
).then(({ data, response }) => data);

const speakersWithTalkDetails = scrapeIt(
  "https://www.neos.io/events/neos-conference-hamburg-2018/speakers.html",
  {
    speakers: {
      listItem: ".team-listing__member",
      data: {
        link: {
          selector: "",
          closest: "a",
          attr: "href"
        }
      }
    }
  }
).then(({ data, response }) => {
  const promises = data.speakers.map(speaker =>
    scrapeIt("https://www.neos.io" + speaker.link, {
      name: ".speaker h1",
      avatar: {
        selector: ".speaker img",
        attr: "src"
      },
      facts: {
        listItem: ".speaker .facts",
        data: {
          fact: ""
        }
      },
      talks: {
        listItem: ".speaker .neos-contentcollection h2",
        data: {
          title: "",
          description: {
            closest: "",
            how: h2Node => {
              return h2Node
                .closest(".neos-nodetypes-headline")
                .next()
                .filter(".neos-nodetypes-text")
                .text();
            }
          }
        }
      }
    }).then(({ data, response }) => data)
  );

  return Promise.all(promises);
});

const isBreakOrLunch = title =>
  title.indexOf("Break") !== -1 || title === "Lunch";

const findTalkDetailsForTitle = (title, speakersWithTalkDetails) => {
  for (let i in speakersWithTalkDetails) {
    for (let t in speakersWithTalkDetails[i].talks) {
      if (speakersWithTalkDetails[i].talks[t].title.indexOf(title) !== -1) {
        return speakersWithTalkDetails[i].talks[t].description;
      }
    }
  }

  if (isBreakOrLunch(title)) {
    return "";
  }
  console.warn("Did not find talk details for " + title);
  return "";
};

const transformTopic = (
  topicFromCrawler,
  topicTitle,
  roomName,
  speakersWithTalkDetails
) => ({
  summary: findTalkDetailsForTitle(topicTitle, speakersWithTalkDetails),
  title: topicTitle,
  //videoId: 'tWitQoPgs8w',
  speakers: [],
  time: topicFromCrawler.time,
  room: roomName,
  isBreak: isBreakOrLunch(topicTitle)
});

Promise.all([program, speakersWithTalkDetails])
  .then(([program, speakersWithTalkDetails]) => {
    //console.log(speakersWithTalkDetails);
    return program.days.map(day => {
      let transformedTopics = [];
      day.topics
        // remove header rows
        .filter(
          topicFromCrawler =>
            topicFromCrawler.time && topicFromCrawler.time !== "Time"
        )
        .forEach(topicFromCrawler => {
          if (topicFromCrawler.topicRoom1) {
            transformedTopics.push(
              transformTopic(
                topicFromCrawler,
                topicFromCrawler.topicRoom1,
                "Room 1",
                speakersWithTalkDetails
              )
            );
          }
          if (topicFromCrawler.topicRoom2) {
            transformedTopics.push(
              transformTopic(
                topicFromCrawler,
                topicFromCrawler.topicRoom2,
                "Room 2",
                speakersWithTalkDetails
              )
            );
          }
        });
      return transformedTopics;
    });
  })
  .then(transformedTopics => {
    fs.writeFileSync(
      __dirname + "/../app/data/talks.json",
      JSON.stringify(transformedTopics)
    );
  });
