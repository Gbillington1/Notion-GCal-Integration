require("dotenv").config()
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_INTEGRATION_TOKEN,
});

async function getActiveDeadlines() {
    try {
        // get all deadlines from task db where `Status` is "To Do" OR "In Progress" AND `Database` is "Deadlines"
        const response = await notion.databases.query({
            database_id: process.env.NOTION_TASK_DB_ID,
            filter: {
                and: [
                    {
                        or: [
                            {
                                property: "Status",
                                select: {
                                    equals: "To Do"
                                }
                            },
                            {
                                property: "Status",
                                select: {
                                    equals: "In Progress"
                                }
                            }
                        ]
                    },
                    {
                        property: "Database",
                        select: {
                            equals: "Deadlines"
                        }
                    },
                ]
            }
        })
        return response;
    } catch (err) {
        console.log(err)
    }
}

async function getProjectName(id) {
    try {
        const response = await notion.pages.retrieve({ page_id: id });
        return response.properties.Name.title[0].text.content;
    } catch (err) {
        console.log(err)
    }
}

// print all deadlines that are "To Do" or "In Progress" to console
; (async () => {
    const deadlines = await getActiveDeadlines();

    let deadlinesNoTime = await Promise.all(deadlines.results.filter(deadline => {
        return !deadline.properties.Date.date.start.includes('T')
    }).map(async deadline => {
            const projectTitle = await getProjectName(deadline.properties.Project.relation[0].id);

            return {
                id: deadline.id,
                title: deadline.properties.Name.title[0].text.content,
                created_time: deadline.created_time,
                last_edited_time: deadline.last_edited_time,
                project_id: deadline.properties.Project.relation[0].id,
                project_title: projectTitle,
            }
    }))

    console.log(deadlinesNoTime)

    // TODO: ensure that project_title matches event title in Google Calendar
    // TODO: use deadlinesNoTime data to query google clanedar for class periods on that day. Return time that class starts
})();

