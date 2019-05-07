const scrapeIt = require('scrape-it');
const fs = require('fs');
const program = scrapeIt('https://www.neoscon.io/schedule.html', {
  days: {
    listItem: 'div.talks',
    data: {
      topics: {
        listItem: 'div.talk',
        data: {
          time: '.talk__time',
          topic: 'h4.talk__title',
          description: '.talk__description',
          stage: '.talk__roomSmallDevice',
          speakers: {
            listItem: '.talk__speaker-images img',
            data: {
              avatar: {
                attr: 'src'
              },
              name: {
                attr: 'title'
              }
            }
          }
        }
      }
    }
  }
}).then(({ data, response }) => {
  return data;
});

const speakersWithTalkDetails = scrapeIt(
  'https://www.neoscon.io/speakers.html',
  {
    speakers: {
      listItem: '.speaker__speakerList__item',
      data: {
        link: {
          selector: 'a',
          attr: 'href'
        }
      }
    }
  }
).then(({ data, response }) => {
  const promises = data.speakers.map(speaker =>
    scrapeIt(speaker.link, {
      name: '.speaker h1',
      avatar: {
        selector: '.speaker__imageWrapper img',
        attr: 'src'
      },
      facts: {
        listItem: '.speaker .speaker__infos',
        data: {
          company: {
            convert: input => {
              const content = input.replace(/\t/g, '').replace(/\n/g, '');
              const regex = /(?<=<i class="fa fa-briefcase"><\/i>)(.*?)(?=<\/li>)/gm;
              const match = content.match(regex);
              return Array.isArray(match) ? match.pop() : '';
            },
            how: 'html'
          },
          role: {
            convert: input => {
              const content = input.replace(/\t/g, '').replace(/\n/g, '');
              const regex = /(?<=<i class="fa fa-group"><\/i>)(.*?)(?=<\/li>)/gm;
              const match = content.match(regex);
              return Array.isArray(match) ? match.pop() : '';
            },
            how: 'html'
          },
          twitter: {
            selector: '.fa-twitter + a',
            trim: true
          },
          github: {
            selector: '.fa-github + a',
            trim: true
          }
        }
      },
      summary: {
        selector: '.speaker__description p:not(.speaker__infos)'
      },
      talks: {
        listItem: '.speaker .imageTeaser',
        data: {
          link: {
            attr: 'href'
          },
          title: {
            selector: '.imageTeaser__contents__heading',
            trim: true
          }
        }
      }
    }).then(({ data, response }) => data)
  );

  return Promise.all(promises);
});

const isBreakOrLunch = title =>
  title.indexOf('Break') !== -1 || title === 'Lunch';

const isCaseStudy = title => title.includes('Case Studies');

const transformTalkDetails = (title, description) => {
  if (isBreakOrLunch(title) || isCaseStudy(title)) {
    return '';
  }

  if (description) {
    return description
      .replace(/\(together with (?!the Neos)[^)]+\)/, '')
      .trim();
  }

  console.warn('Did not find talk details for ' + title);
  return '';
};

const findSpeakersForTitle = (title, speakersWithTalkDetails) => {
  isCaseStudySession = isCaseStudy(title);
  const speakers = [];
  const foundSpeakerNames = [];
  for (let i in speakersWithTalkDetails) {
    for (let t in speakersWithTalkDetails[i].talks) {
      if (speakersWithTalkDetails[i].talks[t].title.indexOf(title) !== -1) {
        if (foundSpeakerNames.indexOf(speakersWithTalkDetails[i].name) === -1) {
          foundSpeakerNames.push(speakersWithTalkDetails[i].name);
          speakers.push(speakersWithTalkDetails[i]);
        }
      }
    }
  }

  if (speakers.length) {
    return speakers;
  }

  if (isBreakOrLunch(title)) {
    return [];
  }
  console.warn('Did not find speakers for ' + title);
  return [];
};

const transformTopic = (
  topicFromCrawler,
  topicTitle,
  topicDescription,
  roomName,
  speakersWithTalkDetails
) => {
  const isCaseStudySession = isCaseStudy(topicTitle);
  let summary = transformTalkDetails(topicTitle, topicDescription);
  if (isCaseStudySession) {
    summary = topicDescription;
  }

  const transformedSession = {
    summary: summary,
    title: topicTitle,
    //videoId: 'tWitQoPgs8w',
    speakers: findSpeakersForTitle(topicTitle, speakersWithTalkDetails).map(
      speaker => {
        return {
          name: speaker.name,
          avatar: speaker.avatar,
          twitter: speaker.facts[0].twitter,
          company: speaker.facts[0].company,
          summary: speaker.summary
        };
      }
    ),
    time: topicFromCrawler.time,
    durationInMinutes: 45,
    room: roomName,
    isBreak: isBreakOrLunch(topicTitle),
    isCaseStudy: isCaseStudySession
  };

  return transformedSession;
};

Promise.all([program, speakersWithTalkDetails])
  .then(([program, speakersWithTalkDetails]) => {
    return program.days.map(day => {
      let transformedTopics = [];
      day.topics
        // remove header rows
        .filter(
          topicFromCrawler =>
            topicFromCrawler.time && topicFromCrawler.time !== 'Time'
        )
        .forEach(topicFromCrawler => {
          if (
            topicFromCrawler.stage === 'Center Stage' ||
            topicFromCrawler.stage === 'Studio Stage'
          ) {
            // remove stage from topic caused by the markup
            const topic = topicFromCrawler.topic.replace(
              topicFromCrawler.stage,
              ''
            );
            transformedTopics.push(
              transformTopic(
                topicFromCrawler,
                topic,
                topicFromCrawler.description,
                topicFromCrawler.stage,
                speakersWithTalkDetails
              )
            );
          }

          // registrations and openings have no stage
          if (topicFromCrawler.stage === '') {
            transformedTopics.push(
              transformTopic(
                topicFromCrawler,
                topicFromCrawler.topic,
                topicFromCrawler.description,
                topicFromCrawler.stage,
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
      __dirname + '/../app/data/talks.json',
      JSON.stringify(transformedTopics)
    );
  });
