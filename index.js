import dotenv from 'dotenv';
import { Notion } from "./libs/Notion.js";
import { GoogleCalendar } from "./libs/GoogleCalendar.js";

// init .env vars
dotenv.config()

; (async () => {

    const Client = new Notion(process.env.NOTION_INTEGRATION_TOKEN);
    let deadlines = await Client.getFilteredDeadlines()
    console.log(deadlines)

    // TODO: ensure that project_title matches event title in Google Calendar
    // TODO: use deadlinesNoTime data to query google clanedar for class periods on that day. Return time that class starts
    // TODO: proper error handling & logging
})();

