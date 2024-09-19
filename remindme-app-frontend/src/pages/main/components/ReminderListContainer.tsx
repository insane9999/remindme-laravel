import React, { createContext, useState } from 'react';
import { Container } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TodoHeader from './ReminderListHeader';
import TodoList from './ReminderList';
import { IReminderData } from '../../../utils/interface';
import EditReminderDlg from '../dialogs/EditReminderDlg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Create a context for managing todo actions: toggle, delete, and add
export const ReminderContext = createContext<{
    onAddItem?: () => void;
    onEditItem?: (item: IReminderData) => void;
    onDeleteItem?: (item: IReminderData) => void;
}>({});

// Define the props interface for TodoContainer
interface ReminderListContainerProps {
    list: IReminderData[];
    onAddItem: (item: IReminderData) => void;
    onEditItem: (item: IReminderData) => void;
    onDeleteItem: (item: IReminderData) => void;
}

// The TodoContainer component manages the todo list state and actions
const ReminderListContainer: React.FC<ReminderListContainerProps> = (props) => {

    const [dlgProps, setDlgProps] = useState<{ open: boolean, data?: IReminderData }>({
        open: false
    });


    const handleOnAddItem = async () => {
        setDlgProps({
            open: true,
            data: undefined
        });
    }

    const handleOnEditItem = async (item: IReminderData) => {
        setDlgProps({
            open: true,
            data: item
        });
    }

    const handleOnDeleteItem = (item: IReminderData) => {
        props.onDeleteItem(item);
    }

    const handleDialogSubmit = async (item: IReminderData) => {
        setDlgProps({
            ...dlgProps,
            open: false
        });

        if (item.id) {
            props.onEditItem(item);
        } else {
            props.onAddItem(item);
        }
    }

    const handleDialogClose = () => {
        setDlgProps({
            ...dlgProps,
            open: false
        })
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ReminderContext.Provider value={{
                onDeleteItem: handleOnDeleteItem,
                onAddItem: handleOnAddItem,
                onEditItem: handleOnEditItem
            }}>
                <Container maxWidth="sm">
                    <Card variant="outlined">
                        <CardContent className='!p-8'>
                            <TodoHeader />
                            <TodoList
                                list={props.list.sort((a, b) => a.remind_at - b.remind_at)}
                            />
                        </CardContent>
                    </Card>
                </Container>
                <EditReminderDlg
                    {...dlgProps}
                    onSubmit={handleDialogSubmit}
                    onClose={handleDialogClose}
                />
            </ReminderContext.Provider>
        </LocalizationProvider>
    )
}

export default ReminderListContainer;