import React from 'react';
import { List } from '@mui/material';
import ReminderItem from './ReminderItem';
import { IReminderData } from '../../../utils/interface';

interface ReminderListProps {
    list: IReminderData[];
}

const ReminderList: React.FC<ReminderListProps> = ({ list }) => {

    return (
        <List>
            {list.map((todo, index) => {
                return (
                    <ReminderItem
                        key={index}
                        data={todo}
                    />
                );
            })}
        </List>
    )
}

export default ReminderList;