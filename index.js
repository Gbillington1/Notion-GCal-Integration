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
    } catch(err) {
        console.log(err)
    }
}

// print all deadlines that are "To Do" or "In Progress" to console
;(async () => {
    const deadlines = await getActiveDeadlines();

    let deadlinesNoTime = deadlines.results.map(deadline => {
        if (!deadline.properties.Date.date.start.includes('T')) {
            return deadline
        }
    })

    console.log(deadlinesNoTime)
})();

