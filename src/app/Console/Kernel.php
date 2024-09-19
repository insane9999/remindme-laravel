<?php

namespace App\Console;

use App\Models\Reminder;
use App\Mail\ReminderNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Schedule to run every minute
        $schedule->call(function () {
            // Find reminders that are due
            $reminders = Reminder::where('remind_at', '<=', Carbon::now()->timestamp)
                ->where('remind_at', '>=', Carbon::now()->subMinutes(10)->timestamp) // Ensure it hasn't already passed
                ->where('notified', false) // Only get reminders that haven't been notified
                ->get();

            foreach ($reminders as $reminder) {
                // Send email notification
                Mail::to($reminder->user->email)->send(new ReminderNotification($reminder));
                // Mark the reminder as notified
                $reminder->notified = true;
                $reminder->save();
            }
        })->everySecond(); // Run every minute to check for due reminders
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
