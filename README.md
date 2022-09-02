# Notion x Google Calendar Integration

I use Notion to track all of my college homework and deadlines in a todo list. Currently, I manually input the date but seldom input the time that it is due. When tasks start to stack up, it can be hard to know exactly when the task is due, which results in poor time management and late assignments. Through the Notion x GCal Integration, the time that each task is due is inputed automatically by matching the associated class on the Notion task with the next class period in Google Calendar. 

# How it works
The integration uses the [Notion API](https://developers.notion.com/) to get at all the tasks with the `Todo` status, their associated class name, and the day that it is due. Then, we fetch the [Google Calendar API](https://developers.google.com/calendar/api) to find class periods on that dute date that match the associated class name. 

# Use cases
For now, the primary use case will be for deadlines, because it will be difficult to specify a time for smaller tasks that's due date is set multiple days (class periods) before the actual assignment is due. Deadlines are set on the day of the class period where the assignment must be turned in, so we will take advantage of that. 

# Adapt to your Notion environment
I will update this section once I actually build the project, but I will design this project with other users in mind, making it easy to switch over to any database of tasks. Ideally, I will only be using a few fields from the Notion database and all the user will have to do is match the column names with the ones that I choose for the project. 