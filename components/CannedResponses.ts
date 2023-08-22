type CannedResponse = {
  trigger: string;
  text: string;
};

const cannedResponses: CannedResponse[] = [
  {
    trigger: "resume",
    text: "If you're interested in Sam Cedarbaum's resume, you can refer to this link: https://standardresume.co/r/053t9kOzs0YFW-7MdganD. The link provides a detailed breakdown of his education and work experience.",
  },
  {
    trigger: "contact",
    text: "You can reach Sam Cedarbaum at his email: scedarbaum@gmail.com. He also has a GitHub account located at https://github.com/cedarbaum. If you're a runner, you can also follow him on Strava: https://www.strava.com/athletes/37072854.",
  },
  {
    trigger: "projects",
    text: `Sam is currently working on several projects. These Include:

🚇 https://closingdoors.nyc - a minimalist NYC subway, bus, and PATH schedule viewer
🏠 https://www.housecheck.nyc/ - search housing data in NYC
🏃 https://www.runstreak.app - a web app for tracking run streaks on Strava
☁️ https://www.postmodern.cloud - a postmodern take on weather forecasts
🥤 https://www.dietcoke.reviews - reviews of diet coke around NYC

You can visit these links to learn more about the individual projects.`,
  },
];

export default function getCannedResponse(text?: string) {
  const simplifiedText = text
    ?.toLowerCase()
    ?.trim()
    ?.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  const response = cannedResponses.find(
    (response) => response.trigger === simplifiedText
  );
  return response ? response.text : null;
}
