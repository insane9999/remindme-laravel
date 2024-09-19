<?php

namespace App\Http\Controllers;

use Symfony\Component\Translation\Exception\NotFoundResourceException;
use App\Models\Reminder;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReminderNotification;

class ReminderController extends Controller
{
    use ApiResponseTrait;

    protected static $validationRules = [
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'remind_at' => 'required|integer', // Unix timestamp in seconds
        'event_at' => 'required|integer', // Unix timestamp in seconds
    ];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user(); // Get the authenticated user
        // Default limit is 10 if not provided
        $limit = $request->query('limit', 10);

        // Get reminders for the authenticated user, sorted by remind_at
        $reminders = Reminder::where('user_id', $user->id)
            ->orderBy('remind_at', 'asc')
            ->limit($limit)
            ->get();

        // Prepare response data
        $data = [
            'reminders' => $reminders,
            'limit' => $limit
        ];

        // Return standardized API response
        return $this->success($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validatedData = $request->validate(self::$validationRules);

        $reminder = new Reminder($validatedData);
        $request->user()->reminders()->save($reminder);

        return $this->success($reminder);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user(); // Get the authenticated user

        // Fetch the reminder that belongs to the user
        $reminder = $user->reminders()->find($id);

        if (!$reminder) {
            throw new NotFoundResourceException;
        }

        return $this->success($reminder);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user(); // Get the authenticated user

        // Find the reminder that belongs to the user
        $reminder = $user->reminders()->find($id);

        if (!$reminder) {
            throw new NotFoundResourceException;
        }

        $validatedData = $request->validate(self::$validationRules);

        $reminder->update($validatedData);

        return $this->success($reminder);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user(); // Get the authenticated user

        // Find the reminder that belongs to the user
        $reminder = $user->reminders()->find($id);

        if (!$reminder) {
            throw new NotFoundResourceException;
        }

        $reminder->delete();

        return $this->success();
    }
}
