import { useEffect, useMemo, useState } from "react";
import ReminderListContainer from "./components/ReminderListContainer";
import { IReminderData } from "../../utils/interface";
import APIService from "../../utils/APIService";

const MainPage = () => {

    const [reminderList, setReminderList] = useState<IReminderData[]>([]);

    /**
     * Fetch todo items from the API when the component mounts
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Make an API call to fetch the todos
                const { reminders } = await APIService.get('reminders');

                // Set the fetched data into the todoList state
                setReminderList(reminders);
            } catch (error) {
                console.error('Error fetching the todos:', error);
            }
        };
        fetchData();
    }, []);

    const handleOnAddItem = async (item: IReminderData) => {
        try {
            const newItem = await APIService.post('reminders', item);
            setReminderList([...reminderList, newItem]);
        } catch (err) {
            console.error("Error happend on adding reminder");
        }
    }

    const handleOnEditItem = async (item: IReminderData) => {
        try {
            const newItem = await APIService.put(`reminders/${item.id}`, item);
            setReminderList(reminderList.map(reminder => {
                if (reminder.id === item.id) {
                    return newItem;
                }

                return reminder;
            }));
        } catch (err) {
            console.error("Error happend on adding reminder");
        }
    }

    const handleOnDeleteItem = async (item: IReminderData) => {
        try {
            await APIService.delete(`reminders/${item.id}`);
            setReminderList(reminderList.filter((reminder) => reminder.id !== item.id));
        } catch (err) {
            console.error("Error happend on deleting reminder");
        }
    }

    return (
        <div className='p-12'>
            {
                useMemo(() => (
                    <ReminderListContainer
                        list={reminderList}
                        onAddItem={handleOnAddItem}
                        onEditItem={handleOnEditItem}
                        onDeleteItem={handleOnDeleteItem}
                    />
                ), [reminderList])
            }
        </div>
    )
}

export default MainPage;