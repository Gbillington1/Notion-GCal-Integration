import { Client } from "@notionhq/client";

export class Notion {
    constructor(NOTION_TOKEN) {
        this.notion = new Client({
            auth: NOTION_TOKEN,
        })
    }

    // filter deadlines to only include those that have a date, and clean the data to return only the fields we want
    async getFilteredDeadlines() {

        const deadlines = await this.getActiveDeadlines();

        let deadlinesNoTime = await Promise.all(deadlines.results.filter(deadline => {
            return !deadline.properties.Date.date.start.includes('T')
        }).map(async deadline => {
            const projectTitle = await this.getProjectName(deadline.properties.Project.relation[0].id);

            return {
                id: deadline.id,
                title: deadline.properties.Name.title[0].text.content,
                created_time: deadline.created_time,
                last_edited_time: deadline.last_edited_time,
                project_id: deadline.properties.Project.relation[0].id,
                project_title: projectTitle,
            }
        }))

        return deadlinesNoTime
    }

    // get all deadlines from task db where `Status` is "To Do" OR "In Progress" AND `Database` is "Deadlines"
    // helper function for getFilteredDeadlines()
    async getActiveDeadlines() {
        try {
            const response = await this.notion.databases.query({
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

    // get name of project from task db where id is the uuid of the project page
    // helper function for getFilteredDeadlines()
    async getProjectName(id) {
        try {
            const response = await this.notion.pages.retrieve({ page_id: id });
            return response.properties.Name.title[0].text.content;
        } catch (err) {
            console.log(err)
        }
    }
}