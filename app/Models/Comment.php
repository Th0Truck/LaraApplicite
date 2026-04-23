<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    protected $fillable = [
        'paragraph_id',
        'user_id',
        'content',
    ];

    public function paragraph(): BelongsTo
    {
        return $this->belongsTo(Paragraph::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
