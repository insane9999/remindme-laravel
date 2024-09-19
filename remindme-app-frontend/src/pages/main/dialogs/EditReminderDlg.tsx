import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { IReminderData } from "../../../utils/interface";
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs from 'dayjs';

const GET_DEFAULT_VALUE = (): IReminderData => ({
    title: '',
    description: '',
    remind_at: dayjs().unix(),
    event_at: dayjs().unix()
})

interface EditReminderDlgProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: IReminderData) => void;
    data?: IReminderData;
}

const EditReminderDlg: React.FC<EditReminderDlgProps> = (props) => {

    // State to control the dialog open/close
    const [formData, setFormData] = useState<IReminderData>(GET_DEFAULT_VALUE());

    useEffect(() => {
        if (props.data) {
            setFormData(props.data);
        } else {
            setFormData(GET_DEFAULT_VALUE());
        }
    }, [props]);

    const valid = useMemo(() => {
        return (
            formData.title.length > 0 &&
            formData.description.length > 0
        )
    }, [formData]);

    /**
    * Handles the form submission when the user adds a new reminder.
    * 
    * @param event Form submission event
    */
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        props.onSubmit(formData);
    };

    /**
    * Handles changes in the input field and updates the form data.
    * 
    * @param event Change event for the input field
    */
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    /**
    * Closes the dialog when the user cancels or completes an action
    */
    const handleClose = () => {
        props.onClose();
    };

    return (
        <Dialog open={props.open} onClose={handleClose} disableRestoreFocus>
            <DialogTitle>
                {formData.id ? "Edit " : "Create "}
                Reminder Item
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        name="title"
                        autoComplete="off"
                        variant="outlined"
                        value={formData.title}
                        onChange={handleChange}
                        className="!mb-4"
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        name="description"
                        autoComplete="off"
                        variant="outlined"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <MobileDateTimePicker
                        className="!w-full !mt-6"
                        label="Remind At"
                        name="remind_at"
                        value={dayjs(formData.remind_at * 1000)}
                        onChange={(newValue) => {
                            setFormData({
                                ...formData,
                                remind_at: newValue ? newValue.unix() : 0
                            });
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" disabled={!valid}>
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default EditReminderDlg;