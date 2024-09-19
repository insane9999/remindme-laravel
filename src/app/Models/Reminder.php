<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'remind_at', 'event_at'];
    protected $hidden = ['created_at', 'updated_at'];

     // A reminder belongs to one user
     public function user(): BelongsTo
     {
         return $this->belongsTo(User::class);
     }
}
