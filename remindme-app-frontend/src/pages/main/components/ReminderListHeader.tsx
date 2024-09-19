import { Fab, Typography } from "@mui/material";
import { useContext } from "react";
import { ReminderContext } from "./ReminderListContainer";
import AddIcon from '@mui/icons-material/Add';

const ReminderListHeader = () => {

    const { onAddItem } = useContext(ReminderContext);

    const onClickAdd = () => {
        onAddItem && onAddItem();
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Typography variant="h4" component="h1" gutterBottom>
                    Reminder List
                </Typography>

                <Fab color="primary" aria-label="add" onClick={onClickAdd}>
                    <AddIcon />
                </Fab>
            </div>
        </>
    )
}

export default ReminderListHeader;