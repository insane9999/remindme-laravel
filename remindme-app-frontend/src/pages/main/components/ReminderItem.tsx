import React, { useContext } from 'react';
import { IconButton, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IReminderData } from "../../../utils/interface";
import { ReminderContext } from './ReminderListContainer';
import { makeStyles } from '@mui/styles';
import Utils from '../../../utils/Utils';

// Props interface to define the structure of TodoItem's props
interface ReminderItemProps {
    data: IReminderData;
}

const useStyles = makeStyles({

})

const ReminderItem: React.FC<ReminderItemProps> = ({ data }) => {

    const classes = useStyles();
    const { onEditItem, onDeleteItem } = useContext(ReminderContext);

    /**
    * Handles the delete button click event to remove the reminder.
    */
    const onClickDeleteBtn = () => {
        onDeleteItem && onDeleteItem(data);
    }

    /**
    * Handles the edit button click event to edit the reminder.
    */
    const onClickEditBtn = () => {
        onEditItem && onEditItem(data);
    }

    return (
        <ListItem>
            <div className='w-full'>
                <ListItemText primary={data.title} secondary={data.description} />
                <span className='text-sm'>Due At: {Utils.formatDate(data.remind_at)}</span>
            </div>

            <IconButton
                onClick={onClickEditBtn}
                edge="end"
                aria-label="delete"
                className='!mr-1'
            >
                <EditIcon />
            </IconButton>

            <IconButton
                onClick={onClickDeleteBtn}
                edge="end"
                aria-label="delete"
            >
                <DeleteIcon />
            </IconButton>

        </ListItem>
    );
};

export default ReminderItem;